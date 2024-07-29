FROM node:18-alpine AS base
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
COPY . .

ARG NUXT_MONGO_URI
ENV NUXT_MONGO_URI ${NUXT_MONGO_URI}

ENV NODE_ENV production

RUN npm run build
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
