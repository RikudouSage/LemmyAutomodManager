export function nonEmptyObject<TKey extends string, TValue>(obj: Record<TKey, TValue | null>): Partial<Record<TKey, TValue>> {
  const result: Partial<Record<TKey, TValue>> = {};

  for (const key in obj) {
    if (obj[key] === null) {
      continue;
    }

    result[key] = obj[key];
  }

  return result;
}

export function shallowEqual<T extends Record<string, any>>(a: T, b: T): boolean {
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);

  if (aKeys.length !== bKeys.length) {
    return false;
  }

  for (const key of aKeys) {
    if (a[key] !== b[key]) {
      return false;
    }
  }

  return true;
}
