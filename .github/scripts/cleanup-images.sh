#!/usr/bin/env bash
set -eo pipefail

ANNOTATION_FILE="$0"
PKG="${GH_REPO#*/}"

versions=$(gh api "orgs/$ORG/packages/container/$PKG/versions" --paginate --jq '
  def hage:
    (sub("\\.[0-9]+Z$"; "Z") | fromdateiso8601) as $created
    | (now - $created) as $seconds
    | if $seconds < 3600 then (($seconds / 60) | floor | tostring) + "m"
      elif $seconds < 86400 then (($seconds / 3600) | floor | tostring) + "h"
      else (($seconds / 86400) | floor | tostring) + "d" end;
  .[] | [
    (.id | tostring),
    .name,
    (.created_at | hage),
    (.metadata.container.tags | length | tostring),
    (.metadata.container.tags | join(","))
  ] | @tsv')

registryToken=$(curl -sf -u "x:$GH_TOKEN" \
  "https://ghcr.io/token?scope=repository:$GH_REPO:pull" | jq -r '.token // empty') || true

gh api "repos/$GH_REPO/git/matching-refs/tags/?per_page=100" --paginate \
  --jq '.[].ref | ltrimstr("refs/tags/") | ascii_downcase' 2>/dev/null \
  | sort -u > /tmp/git-tags || : > /tmp/git-tags

if [ -z "$versions" ]; then
  echo "✅ No versions, nothing to do"
  exit 0
fi

if [ -z "$registryToken" ]; then
  echo "::error file=$ANNOTATION_FILE,title=Cleanup aborted::Could not mint a ghcr.io pull token. Refusing to delete anything."
  exit 1
fi

if [ ! -s /tmp/git-tags ]; then
  echo "::error file=$ANNOTATION_FILE,title=Cleanup aborted::Could not list the remote git tags. Refusing to delete anything."
  exit 1
fi

manifestTypes='application/vnd.oci.image.index.v1+json, application/vnd.docker.distribution.manifest.list.v2+json, application/vnd.oci.image.manifest.v1+json'
rowFormat='%s  %-13s  %-18s  %4s   %-18s  %s\n'

childManifestsOf() {
  curl -sf \
    -H "Accept: $manifestTypes" \
    -H "Authorization: Bearer $registryToken" \
    "https://ghcr.io/v2/$GH_REPO/manifests/$1" \
    | jq -r '.manifests[]? | [
        .digest,
        (if (.annotations."vnd.docker.reference.type") == "attestation-manifest"
         then "attestation"
         else (.platform.os + "/" + .platform.architecture) end)
      ] | @tsv'
}

isKeptTag() {
  local lowerTag
  lowerTag=$(printf '%s' "$1" | tr '[:upper:]' '[:lower:]')

  [ "$1" = "buildcache" ] && return 0
  grep -qxF "$lowerTag" /tmp/git-tags && return 0
  grep -qxF "v$lowerTag" /tmp/git-tags
}

isKeptVersion() {
  local tag

  for tag in ${1//,/ }; do
    if isKeptTag "$tag"; then
      return 0
    fi
  done
  return 1
}

labelFor() {
  local tags="$1"
  local tagCount="$2"
  local firstTag="${tags%%,*}"
  local coreVersion

  if [ "$tagCount" -eq 1 ]; then
    printf '%s' "$firstTag" | sed -E 's/^(sha-[0-9a-f]{7})[0-9a-f]+$/\1/'
    return
  fi

  coreVersion=$(printf '%s' "$firstTag" | sed -E 's/^(v?[0-9]+\.[0-9]+\.[0-9]+).*/\1/')
  printf '%s x%s' "$coreVersion" "$tagCount"
}

: > /tmp/kept
: > /tmp/condemned
: > /tmp/untagged

while IFS=$'\t' read -r id digest age tagCount tags; do
  if [ "$tagCount" -eq 0 ]; then
    printf '%s\t%s\t%s\n' "$id" "$digest" "$age" >> /tmp/untagged
  elif isKeptVersion "$tags"; then
    printf '%s\t%s\t%s\t%s\n' "$id" "$digest" "$age" "$(labelFor "$tags" "$tagCount")" >> /tmp/kept
  else
    printf '%s\t%s\t%s\t%s\n' "$id" "$digest" "$age" "$(labelFor "$tags" "$tagCount")" >> /tmp/condemned
  fi
done <<< "$versions"

countLines() {
  awk 'END { print NR }' "$1"
}

plural() {
  local count="$1"
  local singular="$2"
  local pluralForm="${3:-${singular}s}"

  if [ "$count" -eq 1 ]; then
    printf '%s %s' "$count" "$singular"
  else
    printf '%s %s' "$count" "$pluralForm"
  fi
}

keptCount=$(countLines /tmp/kept)
condemnedCount=$(countLines /tmp/condemned)
untaggedCount=$(countLines /tmp/untagged)
versionCount=$((keptCount + condemnedCount + untaggedCount))

echo "📋 $versionCount versions   $keptCount kept   $condemnedCount to delete   $untaggedCount untagged"

echo "::group::Keeping $keptCount versions"
while IFS=$'\t' read -r id digest age label; do
  printf '     %-18s  %4s\n' "$label" "$age"
done < /tmp/kept
echo "::endgroup::"

: > /tmp/children

while IFS=$'\t' read -r id digest age label; do
  childManifestsOf "$digest" > /tmp/children.one || : > /tmp/children.one

  while IFS=$'\t' read -r childDigest kind; do
    printf '%s\t%s\t%s\n' "$childDigest" "$kind" "$label" >> /tmp/children
  done < /tmp/children.one
done < /tmp/condemned

deletedVersions=0
refusedVersions=0

while IFS=$'\t' read -r id digest age label; do
  if gh api --method DELETE "orgs/$ORG/packages/container/$PKG/versions/$id" >/dev/null; then
    deletedVersions=$((deletedVersions + 1))
    printf "$rowFormat" "🗑️" "version" "$label" "$age" "no remote tag" "id $id"
  else
    refusedVersions=$((refusedVersions + 1))
    echo "::warning file=$ANNOTATION_FILE,title=Kept::Cannot delete $label  $age  id $id"
  fi
done < /tmp/condemned

: > /tmp/protected
isSweepable=true

while IFS=$'\t' read -r id digest age label; do
  childManifestsOf "$digest" > /tmp/children.one || {
    echo "::warning file=$ANNOTATION_FILE,title=Orphan sweep skipped::Cannot read the manifest of $label, so $untaggedCount untagged versions were left alone"
    isSweepable=false
    break
  }

  while IFS=$'\t' read -r childDigest kind; do
    printf '%s\t%s\t%s\n' "$childDigest" "$kind" "$label" >> /tmp/children
    echo "$childDigest" >> /tmp/protected
  done < /tmp/children.one
done < /tmp/kept

childCount=$(countLines /tmp/protected)

if [ "$isSweepable" != true ]; then
  echo "✅ Done   kept $(plural "$keptCount" version)   deleted $(plural "$deletedVersions" version)   orphan sweep skipped"
  exit 0
fi

deletedOrphans=0
refusedOrphans=0

while IFS=$'\t' read -r id digest age; do
  grep -qxF "$digest" /tmp/protected && continue

  shortDigest="${digest#sha256:}"
  shortDigest="${shortDigest:0:12}"
  attribution=$(awk -F'\t' -v target="$digest" '$1 == target { print $2 "\t" $3; exit }' /tmp/children)

  if [ -n "$attribution" ]; then
    kind="${attribution%%$'\t'*}"
    parent="${attribution#*$'\t'}"
    reason="parent deleted"
    origin="$kind from $parent"
  else
    kind="manifest"
    parent="-"
    reason="no parent"
    origin="unreferenced $kind"
  fi

  if gh api --method DELETE "orgs/$ORG/packages/container/$PKG/versions/$id" >/dev/null; then
    deletedOrphans=$((deletedOrphans + 1))
    printf "$rowFormat" "🗑️" "$kind" "$parent" "$age" "$reason" "$shortDigest"
  else
    refusedOrphans=$((refusedOrphans + 1))
    echo "::warning file=$ANNOTATION_FILE,title=Kept::Cannot delete $origin  $age  $shortDigest"
  fi
done < /tmp/untagged

refusedCount=$((refusedVersions + refusedOrphans))
attemptedCount=$((deletedVersions + deletedOrphans + refusedCount))

summary="✅ Done   kept $(plural "$keptCount" version), $(plural "$childCount" child children)"

if [ "$attemptedCount" -eq 0 ]; then
  summary="$summary   nothing to delete"
else
  summary="$summary   deleted $(plural "$deletedVersions" version), $(plural "$deletedOrphans" orphan)"
fi

if [ "$refusedCount" -gt 0 ]; then
  summary="$summary, $refusedCount refused"
fi

echo "$summary"
