FROM node:18.16.0
RUN npm install -g pnpm
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
#RUN pnpm build
#RUN apt install xdg-utils --fix-missing
EXPOSE 5173

CMD ["pnpm","run", "dev"]