#Use Adapter Node. Make sure you install adapter-node in dependencies, and set adapter to adapter-node in svelte.config.js
FROM node:18.16.0-alpine AS builder
RUN npm install -g pnpm
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
RUN pnpm prune --prod

FROM node:18.16.0-alpine AS deployer
WORKDIR /app
COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules ./node_modules
COPY package.json .
EXPOSE 5173
ENV NODE_ENV=production
CMD [ "node", "build" ]
