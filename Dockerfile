FROM node:18.16.0-alpine AS base
RUN npm install -g pnpm

FROM base AS dependency
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM dependency AS builder
WORKDIR /app
COPY . .
RUN pnpm build
RUN pnpm prune --prod
RUN cp -rL node_modules node_modules2
RUN rm -r node_modules
RUN mv node_modules2 node_modules

FROM node:18.16.0-alpine AS deployer
WORKDIR /app
COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules ./node_modules
COPY package.json .
EXPOSE 5173
#ENV NODE_ENV=production
CMD [ "node", "build" ]
#CMD ["pnpm","run", "dev"]