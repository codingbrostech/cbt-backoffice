#!/usr/bin/env bash
set -eo pipefail

: "${SLACK_CHANNEL:?SLACK_CHANNEL must not be empty}"
: "${TARGET_LABEL:?TARGET_LABEL must not be empty}"
: "${OTHER_APP_PREFIXES:?OTHER_APP_PREFIXES must not be empty}"
: "${ENV:?ENV must not be empty}"
: "${REPO_FULL:?REPO_FULL must not be empty}"
: "${AUTHOR:?AUTHOR must not be empty}"
: "${COMMIT_SHA:?COMMIT_SHA must not be empty}"
: "${SERVER_URL:?SERVER_URL must not be empty}"
: "${RUN_ID:?RUN_ID must not be empty}"
: "${REF_NAME:?REF_NAME must not be empty}"
: "${EVENT_NAME:?EVENT_NAME must not be empty}"
: "${JOB_STATUS:?JOB_STATUS must not be empty}"

: "${SLACK_BOT_TOKEN?SLACK_BOT_TOKEN is required}"
: "${IMAGE_TAG?IMAGE_TAG is required}"
: "${PREVIOUS_TAG?PREVIOUS_TAG is required}"
: "${COMMIT_MSG?COMMIT_MSG is required}"

if [ -z "$SLACK_BOT_TOKEN" ]; then
  echo "未設定 SLACK_BOT_TOKEN,跳過通知"
  exit 0
fi

SHORT_SHA="${COMMIT_SHA:0:7}"
COMMIT_TITLE=$(printf '%s' "$COMMIT_MSG" | head -1 | tr -d '\r')
[ -z "$COMMIT_TITLE" ] && COMMIT_TITLE=$(git log -1 --format=%s "$COMMIT_SHA" 2>/dev/null | tr -d '\r')
[ -z "$COMMIT_TITLE" ] && COMMIT_TITLE="—"
BUILD_TIME=$(date -u -d '+8 hours' +'%Y-%m-%d %H:%M UTC+8')

if [ "$EVENT_NAME" = "workflow_dispatch" ]; then
  BRANCH="$REF_NAME"
else
  BRANCH=$(git branch -r --points-at "$COMMIT_SHA" 2>/dev/null \
    | sed 's/^[ *]*//' | grep -v '^origin/HEAD' | sed 's#^origin/##' | sort -u | paste -sd ', ' -)
  [ -z "$BRANCH" ] && BRANCH="—"
fi

RANGE="${PREVIOUS_TAG}..${REF_NAME}"
[ -z "$PREVIOUS_TAG" ] && RANGE="$REF_NAME"
CHANGES=$(git log --no-merges --pretty=format:'%h%x09%an%x09%s%x09%b%x1e' "$RANGE" 2>/dev/null | awk -v others="$OTHER_APP_PREFIXES" '
  function isPrefixed(name, arr, n,   i) {
    for (i=1; i<=n; i++) { if (index(name, arr[i])==1) return 1; }
    return 0;
  }
  BEGIN {
    RS="\036"; FS="\t";
    no=split(others, otherApps, " ");
    nt=split("feat fix perf refactor docs style test build ci chore revert other", types, " ");
    head["feat"]="✨ *New Features*";      head["fix"]="🐛 *Bug Fixes*";
    head["perf"]="⚡ *Performance*";       head["refactor"]="♻️ *Refactoring*";
    head["docs"]="📝 *Documentation*";     head["style"]="🎨 *Styles*";
    head["test"]="✅ *Tests*";             head["build"]="🏗️ *Build*";
    head["ci"]="👷 *CI*";                  head["chore"]="🔧 *Chores*";
    head["revert"]="⏪ *Reverts*";         head["other"]="🗂 *Others*";
  }
  {
    sha=$1; sub(/^[\n\r]+/,"",sha); if (sha=="") next;
    author=$2; subj=$3; body=$4;
    for (i=5; i<=NF; i++) body=body "\t" $i;
    if (tolower(subj) ~ /^chore: release v[0-9]/) {
      match(subj, /v[0-9]+\.[0-9]+\.[0-9]+/); ver=substr(subj,RSTART,RLENGTH);
      blk="> 📦 *" ver "* (" sha ")\n";
      isSectionKept=0; isBlockKept=0;
      nb=split(body, bl, "\n");
      for (i=1; i<=nb; i++) {
        l=bl[i]; sub(/\r$/,"",l);
        if (l=="" || l ~ /^Co-Authored-By:/) { continue; }
        if (l ~ /^\[[^]]+\]$/) {
          sectionName=substr(l,2,length(l)-2);
          isSectionKept=!isPrefixed(sectionName, otherApps, no);
          if (isSectionKept) { isBlockKept=1; blk=blk "> \n> *" l "*\n"; }
          continue;
        }
        if (isSectionKept) { blk=blk "> " l "\n"; }
      }
      if (isBlockKept) { rel[nrel++]=blk; }
      next;
    }
    ci=index(subj,":");
    if (ci>0) {
      rawtype=substr(subj,1,ci-1); desc=substr(subj,ci+1); sub(/^ +/,"",desc);
      bang=(rawtype ~ /!$/);
      scope="";
      if (match(rawtype, /\(/)) { scope=tolower(substr(rawtype,RSTART+1)); sub(/\).*/,"",scope); }
      type=tolower(rawtype); sub(/\(.*/,"",type); sub(/!$/,"",type);
      if (!(type in head)) { type="other"; }
    } else { type="other"; desc=subj; bang=0; scope=""; }
    isCommitKept=1;
    np=split(scope, parts, ",");
    for (j=1; j<=np; j++) { p=parts[j]; gsub(/^ +| +$/,"",p); if (isPrefixed(p, otherApps, no)) isCommitKept=0; }
    if (!isCommitKept) next;
    buck[type]=buck[type] "> - " desc " by " author " (" sha ")\n";
    brk="";
    if (bang) { brk=desc; }
    nb=split(body, bl, "\n");
    for (i=1; i<=nb; i++) {
      if (bl[i] ~ /^BREAKING[- ]CHANGE: /) { brk=bl[i]; sub(/^BREAKING[- ]CHANGE: /,"",brk); break; }
    }
    if (brk!="") { breaking=breaking "> - " brk " by " author " (" sha ")\n"; }
  }
  END {
    ns=0;
    if (breaking!="") sec[ns++]="> 💥 *Breaking Changes*\n" breaking;
    for (i=1; i<=nt; i++) { t=types[i]; if (buck[t]!="") sec[ns++]="> " head[t] "\n" buck[t]; }
    for (i=0; i<nrel; i++) sec[ns++]=rel[i];
    for (i=0; i<ns; i++) { if (i>0) out=out "> \n"; out=out sec[i]; }
    printf "%s", out;
  }')
[ -z "$CHANGES" ] && CHANGES="（此目標無相關變更）"
if [ ${#CHANGES} -gt 2900 ]; then
  CHANGES="${CHANGES:0:2900}"$'\n> _（內容過長，已截斷）_'
fi

CI_RUN_URL="${SERVER_URL}/${REPO_FULL}/actions/runs/${RUN_ID}"
COMMIT_URL="${SERVER_URL}/${REPO_FULL}/commit/${COMMIT_SHA}"
REPO_URL="${SERVER_URL}/${REPO_FULL}"

REPO_SHORT="${REPO_FULL##*/}"
if [ "$JOB_STATUS" = "success" ]; then
  TITLE="✅ Build Success ｜ ${REPO_SHORT} (${TARGET_LABEL}) ｜ ${ENV} ｜ ${IMAGE_TAG}"
else
  TITLE="❌ Build Failed ｜ ${REPO_SHORT} (${TARGET_LABEL}) ｜ ${ENV} ｜ ${IMAGE_TAG}"
fi

PAYLOAD=$(jq -n \
  --arg channel "$SLACK_CHANNEL" --arg title "$TITLE" \
  --arg repo "$REPO_FULL" --arg env "$ENV" --arg image "$IMAGE_TAG" \
  --arg author "$AUTHOR" --arg commit "$SHORT_SHA" --arg branch "$BRANCH" \
  --arg message "$COMMIT_TITLE" --arg changes "$CHANGES" --arg time "$BUILD_TIME" \
  --arg ci_url "$CI_RUN_URL" --arg commit_url "$COMMIT_URL" --arg repo_url "$REPO_URL" \
  '{channel:$channel,text:$title,blocks:[
    {type:"header",text:{type:"plain_text",text:$title,emoji:true}},
    {type:"section",fields:[
      {type:"mrkdwn",text:("*📁 專案 Repo*\n`"+$repo+"`")},
      {type:"mrkdwn",text:("*🌿 分支 Branch*\n`"+$branch+"`")},
      {type:"mrkdwn",text:("*🌍 環境 Env*\n`"+$env+"`")},
      {type:"mrkdwn",text:("*🐳 映像 Image*\n`"+$image+"`")},
      {type:"mrkdwn",text:("*👤 提交者 Author*\n`"+$author+"`")},
      {type:"mrkdwn",text:("*🔖 Commit*\n`"+$commit+"`")},
      {type:"mrkdwn",text:("*🕐 打包時間 Build Time*\n`"+$time+"`")}
    ]},
    {type:"section",text:{type:"mrkdwn",text:("*💬 訊息 Message*\n`"+$message+"`")}},
    {type:"divider"},
    {type:"section",text:{type:"mrkdwn",text:("*📋 變更 Changes*\n"+$changes)}},
    {type:"context",elements:[{type:"mrkdwn",text:("📋 <"+$ci_url+"|CI 執行記錄>  |  🔖 <"+$commit_url+"|Commit>  |  📁 <"+$repo_url+"|Repository>")}]}
  ]}')

RESP=$(curl -s -X POST https://slack.com/api/chat.postMessage \
  -H "Authorization: Bearer $SLACK_BOT_TOKEN" \
  -H 'Content-Type: application/json; charset=utf-8' \
  --data "$PAYLOAD")
echo "$RESP" | jq -e .ok >/dev/null || { echo "Slack error: $RESP"; exit 1; }
