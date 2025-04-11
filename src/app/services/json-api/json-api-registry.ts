import {Injectable} from '@angular/core';
import {AbstractRepository} from './abstract.repository';
import {AbstractEntity} from './abstract.entity';

@Injectable({
  providedIn: 'root',
})
export class JsonApiRegistry {
  private repositoriesMap: {[key: string]: AbstractRepository<AbstractEntity>} = {};

  get repositories() {
    return this.repositoriesMap;
  }

  public registerRepository<T extends AbstractEntity>(repository: AbstractRepository<T>) {
    const type = repository.type;
    if (typeof this.repositoriesMap[type] === 'undefined') {
      this.repositoriesMap[repository.type] = repository;
    }
  }
}
