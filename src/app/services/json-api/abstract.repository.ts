import {AbstractEntity} from './abstract.entity';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, of, tap} from 'rxjs';
import {Injectable} from '@angular/core';
import {catchError, map, switchMap} from 'rxjs/operators';
import {JsonApiRegistry} from './json-api-registry';
import {DocumentCollection, DocumentCollectionLinks} from './document-collection';
import {toObservable} from "../../helper/resolvable";

type Seconds = number;

type RepositoryConstructor<T> = new (httpClient: HttpClient, registry: JsonApiRegistry) => T;

interface Filters {
  [key: string]: string | string[] | null;
}

interface ApiResponse<T> {
  data: T;
  included?: StringRecord[];
}

interface CollectionApiResponse<T> extends ApiResponse<T> {
  meta: {
    totalItems: number;
  };
  links: DocumentCollectionLinks;
}

interface UnknownRecord {
  [key: string]: unknown;
}

interface StringRecord {
  [key: string]: string;
}

interface SortedIncluded {
  [key: string]: {
    [key: string]: StringRecord;
  };
}

interface Relationships {
  [key: string]: {
    data: {
      id: string;
      type: string;
    };
  };
}

interface FetchConfig {
  include?: string[];
  filters?: Filters;
  maxResults?: number;
  sort?: string;
  useCache?: boolean;
  cacheValidity?: Seconds;
  page?: number;
  // some filters might be too long for a get request, that's why support for sending them via put (and request body)
  // was added (put is not used in the api itself, that's why it was used
  // once QUERY http method is supported, it would be better to use that instead
  useHttpQuery?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export abstract class AbstractRepository<T extends AbstractEntity> {
  public abstract resource: typeof AbstractEntity;
  public abstract type: string;

  protected useCache = false;
  protected cacheValidity: Seconds = 10;

  private apiUrl: string = `${environment.apiUrl}/api`;

  private cache: {[key: string]: {value: T | DocumentCollection<T>; validUntil: Date}} = {};
  private filters: Filters | null = null;

  constructor(
    private httpClient: HttpClient,
    private registry: JsonApiRegistry,
  ) {}

  private createFilterQuery(config: FetchConfig = {}): HttpParams {
    let queryParams = new HttpParams();

    const filters = {...(this.filters ?? {}), ...(config.filters ?? {})};
    for (const filterName in filters) {
      if (Object.prototype.hasOwnProperty.call(filters, filterName)) {
        let filterValue = filters[filterName];
        if (Array.isArray(filterValue)) {
          filterValue = filterValue.join(',');
        }
        queryParams = queryParams.set(`filter[${filterName}]`, filterValue ?? 'null');
      }
    }

    return queryParams;
  }

  private getUrl(id: string | number | null = null, config: FetchConfig = {}) {
    let url = `${this.apiUrl}/${this.type}`;
    if (id !== null) {
      url += `/${id}`;
    }

    let queryParams = new HttpParams();

    if (!config.useHttpQuery) {
      queryParams = this.createFilterQuery(config);
    }

    if (config.maxResults !== undefined && config.maxResults !== null) {
      queryParams = queryParams.set('limit', config.maxResults);
    }
    if (config.sort !== undefined) {
      queryParams = queryParams.set('sort', config.sort);
    }
    if (config.include !== undefined) {
      queryParams = queryParams.set('include', config.include.join(','));
    }
    if (config.page !== undefined) {
      queryParams = queryParams.set('page', config.page);
    }

    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }

    return url;
  }

  public get(id: string | number, config: FetchConfig = {}): Observable<T> {
    const useCache = config.useCache ?? this.useCache;
    const cacheKey = 'get' + String(id) + JSON.stringify(config);
    const cacheValidity = config.cacheValidity ?? this.cacheValidity;
    if (useCache && this.cache[cacheKey] !== undefined && this.cache[cacheKey].validUntil > new Date()) {
      return of(this.cache[cacheKey].value as T);
    }

    return this.httpClient.get<ApiResponse<UnknownRecord>>(this.getUrl(id, config)).pipe(
      map(response => {
        return this.parse(response.data, response.included || []);
      }),
      tap(response => {
        if (useCache) {
          const date = new Date();
          date.setSeconds(date.getSeconds() + cacheValidity);

          this.cache[cacheKey] = {
            value: response,
            validUntil: date,
          };
        }
      }),
    );
  }

  public collection(config: FetchConfig = {}): Observable<DocumentCollection<T>> {
    const useCache = config.useCache ?? this.useCache;
    const cacheKey = 'collection' + JSON.stringify(config);
    const cacheValidity = config.cacheValidity ?? this.cacheValidity;
    if (useCache && this.cache[cacheKey] !== undefined && this.cache[cacheKey].validUntil > new Date()) {
      return of(this.cache[cacheKey].value as DocumentCollection<T>);
    }

    const url = this.getUrl(null, config);

    let responseObservable: Observable<CollectionApiResponse<UnknownRecord[]>>;
    if (config.useHttpQuery) {
      responseObservable = this.httpClient.request<CollectionApiResponse<UnknownRecord[]>>('QUERY', url, {
        body: this.createFilterQuery(config),
      });
    } else {
      responseObservable = this.httpClient.get<CollectionApiResponse<UnknownRecord[]>>(url);
    }

    return responseObservable.pipe(
      map(response => {
        const collection = new DocumentCollection<T>();
        const result: T[] = [];

        const data = response.data;
        for (const item of data) {
          result.push(this.parse(item, response.included || []));
        }

        collection.setData(result);
        collection.setTotalItems(response.meta.totalItems);
        collection.links = response.links;

        return collection;
      }),
      tap(response => {
        if (useCache) {
          const date = new Date();
          date.setSeconds(date.getSeconds() + cacheValidity);

          this.cache[cacheKey] = {
            value: response,
            validUntil: date,
          };
        }
      }),
    );
  }

  public create(entity: T, wholeTree: boolean = true): Observable<T> {
    return toObservable(entity.serialize(wholeTree)).pipe(
      switchMap(serialized => {
        return this.httpClient
          .post<ApiResponse<UnknownRecord>>(this.getUrl(), serialized, {
            headers: new HttpHeaders({
              'Content-Type': 'application/vnd.api+json',
            }),
          })
          .pipe(
            map(response => {
              return this.parse(response.data);
            }),
          );
      }),
    );
  }

  public update(entity: T, wholeTree: boolean = true): Observable<T> {
    return toObservable(entity.serialize(wholeTree)).pipe(
      switchMap(serialized => {
        return this.httpClient
          .patch<ApiResponse<UnknownRecord>>(this.getUrl(entity.id), serialized, {
            headers: new HttpHeaders({
              'Content-Type': 'application/vnd.api+json',
            }),
          })
          .pipe(
            map(response => this.parse(response.data)),
            tap(() => this.flushCache()),
          );
      }),
    );
  }

  public delete(entity: T): Observable<boolean> {
    return this.httpClient.delete(this.getUrl(entity.id), {observe: 'response'}).pipe(
      map(response => {
        return response.status >= 200 && response.status < 300;
      }),
      tap(() => this.flushCache()),
      catchError(() => of(false)),
    );
  }

  public filtered(filters: Filters): this {
    const clone: this = new (this.constructor as RepositoryConstructor<this>)(this.httpClient, this.registry);
    clone.filters ??= {};
    clone.filters = {...clone.filters, ...filters};

    return clone;
  }

  private parse(object: UnknownRecord, included: StringRecord[] = []): T {
    // @ts-ignore
    const resource = new this.resource();
    resource.id = object['id'];
    resource.type = object['type'];

    if (typeof object['attributes'] === 'object') {
      const attributes = object['attributes'] as UnknownRecord;
      for (const attributeName in attributes) {
        if (Object.prototype.hasOwnProperty.call(attributes, attributeName)) {
          const attributeValue = attributes[attributeName];
          if (typeof resource.attributes[attributeName] !== 'undefined') {
            resource.attributes[attributeName] = attributeValue;
          }
        }
      }
    }

    const sortedIncluded: SortedIncluded = {};
    for (const include of included) {
      if (typeof sortedIncluded[include['type']] === 'undefined') {
        sortedIncluded[include['type']] = {};
      }
      sortedIncluded[include['type']][include['id']] = include;
    }

    if (typeof object['relationships'] === 'object') {
      const relationships = object['relationships'] as Relationships;
      for (const relationshipName in relationships) {
        if (Object.prototype.hasOwnProperty.call(relationships, relationshipName)) {
          const relationshipData = relationships[relationshipName].data;

          if (typeof resource.relationships[relationshipName] === 'undefined') {
            continue;
          }

          let type: string;

          if (Array.isArray(relationshipData)) {
            if (!relationshipData.length) {
              continue;
            }
            type = relationshipData[0].type;
          } else if (relationshipData === null) {
            resource.relationships[relationshipName] = of(null);
            continue;
          } else {
            type = relationshipData.type;
          }

          if (typeof this.registry.repositories[type] === 'undefined') {
            throw new Error(`Cannot access repository for type '${type}', please inject it to your component/service`);
          }

          const repository = this.registry.repositories[type];

          if (Array.isArray(relationshipData)) {
            resource.relationships[relationshipName] = repository.collection({
              filters: {
                id: relationshipData.map(item => {
                  return item.id;
                }),
              },
              maxResults: -1,
            });
          } else {
            if (
              typeof sortedIncluded[relationshipData.type] !== 'undefined' &&
              typeof sortedIncluded[relationshipData.type][relationshipData.id] !== 'undefined'
            ) {
              if (typeof this.registry.repositories[relationshipData.type] === 'undefined') {
                throw new Error(`Cannot access repository for type '${type}', please inject it to your component/service`);
              }
              const repository = this.registry.repositories[relationshipData.type];

              resource.relationships[relationshipName] = of(repository.parse(sortedIncluded[relationshipData.type][relationshipData.id]));
            } else {
              resource.relationships[relationshipName] = repository.get(relationshipData.id);
            }
          }
        }
      }
    }

    return resource;
  }

  public flushCache(): void {
    this.cache = {};
  }
}
