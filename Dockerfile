FROM node:18-alpine AS base
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
COPY . .

ARG NUXT_MONGO_URI
ARG AUTH_ORIGIN
ARG NUXT_MEASUREMENT_ID
ARG NUXT_API_SECRET_KEY
ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY
ARG AWS_BUCKET_NAME
ARG AWS_REGION

ENV NODE_ENV production

RUN npm run build
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
