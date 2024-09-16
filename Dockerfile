FROM node:18

WORKDIR /app

COPY package*.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install

COPY . .

# RUN chown -R node:node /app
RUN pnpm build
RUN pnpm prune --production

CMD [ "node", "./dist/main.js" ]