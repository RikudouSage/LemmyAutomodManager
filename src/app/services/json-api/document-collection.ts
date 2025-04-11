import {AbstractEntity} from './abstract.entity';

export interface DocumentCollectionRaw<T extends AbstractEntity> {
  data: T[];
  links: DocumentCollectionLinks;
}

export interface DocumentCollectionLinks {
  self: string;
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

export class DocumentCollection<T extends AbstractEntity> implements DocumentCollectionRaw<T> {
  private _data: T[] = [];
  private _totalItems: number = 0;
  private _links: DocumentCollectionLinks | null = null;

  constructor(public initialized = true) {}

  public filter(callback: (value: T) => boolean) {
    const copy = new DocumentCollection<T>(this.initialized);
    copy._data = this._data.filter(callback);
    copy.links = this.links;

    return copy;
  }

  public get length(): number {
    return this._data.length;
  }

  public setData(entities: T[]) {
    this._data = entities;
    return this;
  }

  public add(entity: T) {
    this._data.push(entity);
    return this;
  }

  public at(index: number): T {
    return this._data[index];
  }

  public toArray(): T[] {
    const copy = [];
    for (const item of this._data) {
      copy.push(item);
    }
    return copy;
  }

  get totalItems(): number {
    return this._totalItems;
  }

  public setTotalItems(count: number): void {
    this._totalItems = count;
  }

  public get data(): T[] {
    return this.toArray();
  }

  public set links(metadata: DocumentCollectionLinks) {
    this._links = metadata;
  }

  public get links(): DocumentCollectionLinks {
    if (this._links === null) {
      throw new Error('The collection was not initialized properly, links missing.');
    }

    return this._links;
  }

  [Symbol.iterator](): {next: () => {value: T; done: boolean}} {
    let index = 0;
    const length = this._data.length;
    const data = this._data;
    return {
      next(): {value: T; done: boolean} {
        if (index >= length) {
          // This is a hack, because typescript is not smart enough to have the last case as null.
          // The null is never returned when iterating over the object, but we'd have to include null
          // in the type signature thus forcing the consuming code to handle null which will never be actually returned.
          return {value: null as unknown as T, done: true};
        }
        const value = data[index];
        ++index;
        return {value, done: false};
      },
    };
  }

  public first(): T {
    return this.at(0);
  }
}
