# 映像只放 vite build 產出的 .output/（Nitro node-server 輸出，已把依賴打包進去，
# react 與 react-dom 由 traceDeps 複製到 .output/server/node_modules），不安裝 pnpm、
# 不複製原始碼，容器內不做任何編譯。品牌由執行期的 BRAND 環境變數決定（SO 或 FM），
# 同一個映像同時服務兩個品牌。
FROM node:24.21.0-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 --ingroup nodejs nitro

COPY --chown=nitro:nodejs apps/backoffice/.output ./.output

USER nitro

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
