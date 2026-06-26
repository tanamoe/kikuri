# references: https://pnpm.io/docker
FROM node:24-slim@sha256:b31e7a42fdf8b8aa5f5ed477c72d694301273f1069c5a2f71d53c6482e99a2fc AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml /app
RUN pnpm install --frozen-lockfile
COPY . /app
RUN pnpm run build

# runtime
FROM gcr.io/distroless/nodejs24-debian12@sha256:1eb863ed9b3276bdff6030942999343fe287e7e50ddd8742d1d20668d1cb0ece
COPY --from=build /app/.output /app
WORKDIR /app
CMD ["./server/index.mjs"]
