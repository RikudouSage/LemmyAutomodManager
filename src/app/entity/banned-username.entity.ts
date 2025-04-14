import {AbstractEntity} from "../services/json-api/abstract.entity";
import {DisableableEntity, RemoveAllEntity} from "../helper/common-entity-types";
import {AbstractRepository, EntityConstructor} from "../services/json-api/abstract.repository";
import {Injectable} from "@angular/core";

export class BannedUsername extends AbstractEntity {
  public override type: string = 'banned-username';
  public override attributes: DisableableEntity & RemoveAllEntity & {
    username: string;
    reason: string | null;
  } = {
    username: "",
    reason: null,
    removeAll: false,
    enabled: true,
  };
}

@Injectable({
  providedIn: 'root',
})
export class BannedUsernameRepository extends AbstractRepository<BannedUsername> {
    public override resource: EntityConstructor<BannedUsername> = BannedUsername;
    public override type: string = 'banned-username';
}
