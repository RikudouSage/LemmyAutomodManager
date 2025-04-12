import {Environment} from "./environment.type";

let apiUrl: string;
let appVersion = '0.0.0';

if (typeof process !== "undefined") {
  if (!process.env['API_URL']) {
    throw new Error("Missing environment variable API_URL");
  }
  apiUrl = <string>process.env['API_URL'];
  if (process.env['APP_VERSION']) {
    appVersion = process.env['APP_VERSION'];
  }
} else if (typeof window !== "undefined") {
  if (typeof (<any>window)['API_URL'] === 'undefined') {
    throw new Error("Missing environment variable API_URL");
  }
  apiUrl = <string>(<any>window)['API_URL'];

  if (typeof (<any>window)['APP_VERSION'] !== 'undefined') {
    appVersion = (<any>window)['APP_VERSION'];
  }
} else {
  throw new Error("Unsupported environment");
}

export const environment: Environment = {
  apiUrl: apiUrl,
  appVersion: appVersion,
  appTitle: 'Lemmy Automod',
};
