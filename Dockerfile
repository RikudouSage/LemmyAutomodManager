FROM node:22 as build

ENV NG_CLI_ANALYTICS="false"

WORKDIR /app
COPY package.json package.json
COPY yarn.lock yarn.lock
RUN yarn install

COPY . .
RUN yarn install
RUN yarn build

FROM node:22-slim

COPY docker/entrypoint.sh /entrypoint.sh
COPY --from=build /app/dist/lemmy-automod-manager /app
ENTRYPOINT ["/entrypoint.sh"]
