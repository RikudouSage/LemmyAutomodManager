function Nullable<T, R>(type: (value: T) => R): (value: T | null | undefined) => R | null {
  const transformer = (value: T | null | undefined) => {
    if (value === null || value === undefined) {
      return null;
    }

    if (type.name === Boolean.name) {
      switch (value) {
        case 'true':
          return true as R;
        case 'false':
          return false as R;
        case 'null':
          return null;
      }
    }

    let result = type(value);

    if (
      (type.name === String.name && result === '') ||
      (type.name === Number.name && result === 0)
    ) {
      return null;
    }

    return result;
  };

  Object.defineProperty(transformer, 'name', {
    value: type.name,
    writable: false,
  });

  return transformer;
}

export const FilterTypes = {
  Boolean: Nullable(Boolean),
  Number: Nullable(Number),
  String: Nullable(String),
}

export type FilterType = typeof FilterTypes[keyof typeof FilterTypes];
