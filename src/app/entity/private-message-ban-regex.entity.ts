import {AbstractEntity} from "../services/json-api/abstract.entity";
import {AbstractRepository} from "../services/json-api/abstract.repository";
import {Injectable} from "@angular/core";

export class PrivateMessageBanRegex extends AbstractEntity {
    public override type: string = 'private-message-ban-regex';
    public override attributes: {
      regex: string;
      reason: string | null;
      removeAll: boolean;
      enabled: boolean;
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
export class PrivateMessageBanRegexRepository extends AbstractRepository<PrivateMessageBanRegex> {
    public override resource: typeof AbstractEntity = PrivateMessageBanRegex;
    public override type: string = 'private-message-ban-regex';
}
