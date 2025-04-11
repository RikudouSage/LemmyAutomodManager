import {Environment} from "./environment.type";

if (typeof (<any>window)['API_URL'] === 'undefined') {
  throw new Error("Missing environment variable API_URL");
}

export const environment: Environment = {
  apiUrl: <string>(<any>window)['API_URL'],
  appVersion: typeof (<any>window)['APP_VERSION'] === 'undefined' ? '0.0.0' : <string>(<any>window)['APP_VERSION'],
  appTitle: 'Lemmy Automod',
};
