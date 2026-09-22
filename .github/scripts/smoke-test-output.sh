#!/usr/bin/env bash
set -eo pipefail

# 把每個 app 的 .output 複製到 workspace 之外的暫存目錄啟動，確認 Nitro 產物沒有偷靠
# repo 的 node_modules，跟 Docker 映像裡的執行條件一致。

if [ "$#" -eq 0 ]; then
  echo "usage: $0 <app> [<app>...]" >&2
  exit 1
fi

port=3900
status=0

for app in "$@"; do
  output="apps/$app/.output"
  if [ ! -f "$output/server/index.mjs" ]; then
    echo "::error title=Missing build output::$output/server/index.mjs not found, run pnpm build first"
    status=1
    continue
  fi

  workdir=$(mktemp -d)
  cp -R "$output" "$workdir/.output"

  port=$((port + 1))
  PORT=$port BRAND=SO MGT_BASE_URL=http://127.0.0.1:1 MGT_SITE_ID=0 \
    node "$workdir/.output/server/index.mjs" > "$workdir/server.log" 2>&1 &
  pid=$!

  isHealthy=false
  for _ in $(seq 1 30); do
    if curl -sf "http://127.0.0.1:$port/api/health" >/dev/null 2>&1; then
      isHealthy=true
      break
    fi
    sleep 1
  done

  loginStatus=$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:$port/login" || echo 000)

  kill "$pid" >/dev/null 2>&1 || true
  wait "$pid" 2>/dev/null || true

  if [ "$isHealthy" = true ] && [ "$loginStatus" = 200 ]; then
    echo "✅ $app: /api/health ok, /login $loginStatus"
  else
    echo "::error title=Standalone server failed::$app: health=$isHealthy login=$loginStatus"
    cat "$workdir/server.log"
    status=1
  fi

  rm -rf "$workdir"
done

exit $status
