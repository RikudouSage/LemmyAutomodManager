import {compareVersions} from "compare-versions";

export enum Feature  {
  Filters = '2.21.0',
}

export function IsFeatureAvailable(feature: Feature, currentVersion: string): boolean {
  if (currentVersion === 'dev') {
    return true;
  }

  const result = compareVersions(currentVersion, feature);
  return result === 1 || result === 0;
}
