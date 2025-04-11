import {Environment} from "./environment.type";

export const environment: Environment = {
  apiUrl: typeof window !== 'undefined' && typeof (<any>window)['API_URL'] !== 'undefined' ? (<any>window)['API_URL'] : 'https://127.0.0.1:8000',
  appTitle: 'Lemmy Automod',
  appVersion: 'dev',
};
