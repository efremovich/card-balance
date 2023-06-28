FROM node:latest as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY ./ .
# Используем старую версию ноды
ENV NODE_OPTIONS=--openssl-legacy-provider
RUN npm run build

FROM nginx as production-stage
RUN mkdir /app
COPY --from=build-stage /app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf

COPY certs/re-base.crt /etc/nginx/re-base.crt
COPY certs/re-base.key /etc/nginx/re-base.key

