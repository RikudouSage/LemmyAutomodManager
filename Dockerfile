FROM node:22 as build

ENV NG_CLI_ANALYTICS="false"

WORKDIR /app
COPY package.json package.json
COPY yarn.lock yarn.lock
RUN yarn install

COPY . .
RUN yarn install
RUN yarn build

FROM nginx

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY docker/docker-build.sh /docker-entrypoint.d/99-docker-build.sh
COPY --from=build /app/dist/lemmy-automod-manager/browser /usr/share/nginx/html
