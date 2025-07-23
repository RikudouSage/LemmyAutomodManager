import {AbstractEntity} from "../services/json-api/abstract.entity";
import {AbstractRepository, EntityConstructor} from "../services/json-api/abstract.repository";
import {Injectable} from "@angular/core";

export class ExternalRegexList extends AbstractEntity {
  public override type: string = 'external-regex-list';
  public override attributes: {
    url: string;
    delimiter: string;
    name: string;
    append: string | null;
    prepend: string | null;
  } = {
    url: '',
    delimiter: '',
    name: '',
    append: null,
    prepend: null
  };
}

@Injectable({
  providedIn: 'root',
})
export class ExternalRegexListRepository extends AbstractRepository<ExternalRegexList> {
  public override resource: EntityConstructor<ExternalRegexList> = ExternalRegexList;
  public override type: string = 'external-regex-list';
}
