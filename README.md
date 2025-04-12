# Lemmy Automod Manager

This is a web GUI for [Lemmy Automod](https://github.com/RikudouSage/LemmyAutomod).

You need to enable the management api for this UI to work. **The management api should not be accessible over public networks.**
Additionally, if you use a custom build of this app (meaning you don't use the official docker image) and you enable server side rendering,
**you should make this UI inaccessible over a public network as well**.

> Don't forget to enable CORS for the management api.

## Installation

Simply use the `ghcr.io/rikudousage/lemmy-automod-manager` docker image and configure the api URL using the environment variable `API_URL`.

For example, using docker compose:

> replace `http://127.0.0.1:4005` with any URL the management api is accessible on from your computer.

```yaml
  automod_manager:
    image: ghcr.io/rikudousage/lemmy-automod-manager:dev
    environment:
      - API_URL=http://127.0.0.1:4005
    ports:
      - 4006:80
```

The UI runs on port 80 in the container, in the example above it's bound to local port 4006.

> Because all api requests are done client-side, you can install the UI anywhere (even locally) and simply expose the api
> to your computer - it doesn't have to run on the server at all.
