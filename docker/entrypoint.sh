#!/bin/sh
set -e

echo "window['APP_VERSION'] = '$APP_VERSION';" > /app/browser/runtime-environment.js
echo "window['API_URL'] = '$API_URL';" >> /app/browser/runtime-environment.js

exec /usr/local/bin/node /app/server/server.mjs
