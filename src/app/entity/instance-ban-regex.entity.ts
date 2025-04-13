import {AbstractEntity} from "../services/json-api/abstract.entity";
import {AbstractRepository} from "../services/json-api/abstract.repository";
import {Injectable} from "@angular/core";
import {DisableableEntity, RegexReasonEntity, RemoveAllEntity} from "../helper/common-entity-types";

export class InstanceBanRegex extends AbstractEntity {
    public override type: string = 'instance-ban-regex';

    public override attributes: RegexReasonEntity&DisableableEntity&RemoveAllEntity = {
      regex: '',
      reason: null,
      enabled: false,
      removeAll: false,
    };
}

@Injectable({
  providedIn: 'root',
})
export class InstanceBanRegexRepository extends AbstractRepository<InstanceBanRegex> {
    public override resource: typeof InstanceBanRegex = InstanceBanRegex;
    public override type: string = 'instance-ban-regex';
}
