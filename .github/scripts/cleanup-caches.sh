#!/usr/bin/env bash
set -eo pipefail

ANNOTATION_FILE="$0"

caches=$(gh cache list --limit 1000 --sort created_at --order desc \
  --json id,key,ref,createdAt,sizeInBytes --jq '
  def hsize:
    if . >= 1073741824 then ((((. / 1073741824) * 10) | round) / 10 | tostring) + " GB"
    elif . >= 1048576 then ((. / 1048576) | round | tostring) + " MB"
    else ((. / 1024) | round | tostring) + " KB" end;
  def hage:
    (sub("\\.[0-9]+Z$"; "Z") | fromdateiso8601) as $created
    | (now - $created) as $seconds
    | if $seconds < 3600 then (($seconds / 60) | floor | tostring) + "m"
      elif $seconds < 86400 then (($seconds / 3600) | floor | tostring) + "h"
      else (($seconds / 86400) | floor | tostring) + "d" end;
  def href:
    if startswith("refs/heads/") then ltrimstr("refs/heads/")
    elif startswith("refs/pull/") then "PR #" + (capture("refs/pull/(?<number>[0-9]+)/").number)
    elif startswith("refs/tags/") then "tag " + ltrimstr("refs/tags/")
    else . end;
  .[] | [
    (.id | tostring),
    .ref,
    (.ref | href),
    (.key as $key | ($key | sub("-[0-9a-f]{32,}$"; "")) | if . == "" then $key else . end),
    (.sizeInBytes | hsize),
    (.createdAt | hage),
    (.sizeInBytes | tostring)
  ] | @tsv')

if [ -z "$caches" ]; then
  echo "✅ No caches, nothing to do"
  exit 0
fi

rowFormat='%s  %-27s  %-16s  %7s  %4s   %s\n'

formatBytes() {
  awk -v bytes="$1" 'BEGIN {
    if (bytes >= 1073741824) printf "%.1f GB", bytes / 1073741824
    else if (bytes >= 1048576) printf "%.0f MB", bytes / 1048576
    else printf "%.0f KB", bytes / 1024
  }'
}

goneReasonFor() {
  case "$1" in
    refs/pull/*) printf 'PR closed' ;;
    refs/tags/*) printf 'tag deleted' ;;
    *) printf 'branch deleted' ;;
  esac
}

plural() {
  local count="$1"
  local singular="$2"

  if [ "$count" -eq 1 ]; then
    printf '%s %s' "$count" "$singular"
  else
    printf '%s %ss' "$count" "$singular"
  fi
}

declare -A newestOf
declare -A stateOf
declare -A unresolvedCountOf
refState=""

setRefState() {
  local ref="$1"
  local header

  if [ -z "${stateOf[$ref]:-}" ]; then
    header=$(gh api "repos/$GH_REPO/git/ref/${ref#refs/}" --include --silent 2>/dev/null | head -n 1) || true

    case "$header" in
      *" 200"*) stateOf[$ref]=alive ;;
      *" 404"*) stateOf[$ref]=gone ;;
      *) stateOf[$ref]=unknown ;;
    esac
  fi

  refState="${stateOf[$ref]}"
}

cacheCount=$(printf '%s\n' "$caches" | grep -c .)
totalBytes=$(printf '%s\n' "$caches" | awk -F'\t' '{ total += $7 } END { printf "%d", total }')

echo "📋 $(plural "$cacheCount" cache)   $(formatBytes "$totalBytes") total"

keptCount=0
deletedCount=0
refusedCount=0
keptBytes=0
freedBytes=0

while IFS=$'\t' read -r id ref humanRef prefix size age bytes; do
  reason=""
  slot="$ref|$prefix"

  setRefState "$ref"

  if [ "$refState" = gone ]; then
    reason=$(goneReasonFor "$ref")
  elif [ -n "${newestOf[$slot]:-}" ]; then
    reason="newer copy kept"
  else
    newestOf[$slot]=1
    keptCount=$((keptCount + 1))
    keptBytes=$((keptBytes + bytes))

    if [ "$refState" = unknown ]; then
      unresolvedCountOf[$humanRef]=$(( ${unresolvedCountOf[$humanRef]:-0} + 1 ))
    fi
  fi

  if [ -n "$reason" ]; then
    if gh cache delete "$id" >/dev/null; then
      deletedCount=$((deletedCount + 1))
      freedBytes=$((freedBytes + bytes))
      printf "$rowFormat" "🗑️" "$prefix" "$humanRef" "$size" "$age" "$reason"
    else
      refusedCount=$((refusedCount + 1))
      echo "::warning file=$ANNOTATION_FILE,title=Kept::Cannot delete $prefix on $humanRef  $size  id $id"
    fi
  fi
done <<< "$caches"

for unresolvedRef in "${!unresolvedCountOf[@]}"; do
  echo "::notice file=$ANNOTATION_FILE,title=Ref unresolved::Could not resolve $unresolvedRef, keeping its ${unresolvedCountOf[$unresolvedRef]} caches"
done

summary="✅ Done   kept $(plural "$keptCount" cache), $(formatBytes "$keptBytes")   deleted $deletedCount, $(formatBytes "$freedBytes") reclaimed"

if [ "$refusedCount" -gt 0 ]; then
  summary="$summary, $refusedCount refused"
fi

echo "$summary"
