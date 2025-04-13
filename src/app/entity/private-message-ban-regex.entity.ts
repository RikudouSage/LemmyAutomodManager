import {AbstractEntity} from "../services/json-api/abstract.entity";
import {AbstractRepository} from "../services/json-api/abstract.repository";
import {Injectable} from "@angular/core";
import {DisableableEntity, RegexReasonEntity, RemoveAllEntity} from "../helper/common-entity-types";

export class PrivateMessageBanRegex extends AbstractEntity {
    public override type: string = 'private-message-ban-regex';
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
export class PrivateMessageBanRegexRepository extends AbstractRepository<PrivateMessageBanRegex> {
    public override resource: typeof PrivateMessageBanRegex = PrivateMessageBanRegex;
    public override type: string = 'private-message-ban-regex';
}
