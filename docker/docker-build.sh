if [ -z ${API_URL+x} ]; then
  echo "The API url must be configured using the API_URL environment variable."
  exit 1
fi

echo "window['API_URL'] = '$API_URL';" > /usr/share/nginx/html/assets/runtime-environment.js
