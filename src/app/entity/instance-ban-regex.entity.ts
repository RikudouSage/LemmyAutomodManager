import {AbstractEntity} from "../services/json-api/abstract.entity";
import {AbstractRepository} from "../services/json-api/abstract.repository";
import {Injectable} from "@angular/core";

export class InstanceBanRegex extends AbstractEntity {
    public override type: string = 'instance-ban-regex';

    public override attributes: {
      regex: string;
      reason: string | null;
      enabled: boolean;
      removeAll: boolean;
    } = {
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
    public override resource: typeof AbstractEntity = InstanceBanRegex;
    public override type: string = 'instance-ban-regex';
}
