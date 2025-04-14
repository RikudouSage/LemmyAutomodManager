import {AbstractEntity} from "../services/json-api/abstract.entity";
import {DisableableEntity, RegexReasonEntity} from "../helper/common-entity-types";
import {AbstractRepository, EntityConstructor} from "../services/json-api/abstract.repository";
import {Injectable} from "@angular/core";

export class CommunityRemoveRegex extends AbstractEntity {
  public override type: string = 'community-remove-regex';
  public override attributes: DisableableEntity & RegexReasonEntity & {
    banModerators: boolean;
  } = {
    regex: '',
    reason: null,
    banModerators: false,
    enabled: true,
  };
}

@Injectable({
  providedIn: 'root',
})
export class CommunityRemoveRegexRepository extends AbstractRepository<CommunityRemoveRegex> {
    public override resource: EntityConstructor<CommunityRemoveRegex> = CommunityRemoveRegex;
    public override type: string = 'community-remove-regex';
}
