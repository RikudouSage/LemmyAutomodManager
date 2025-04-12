import {AbstractEntity} from "../services/json-api/abstract.entity";
import {AbstractRepository} from "../services/json-api/abstract.repository";
import {Injectable} from "@angular/core";
import {DisableableEntity, UserTargetingEntity} from "../helper/common-entity-types";

export class WatchedUser extends AbstractEntity {
  public override type: string = 'watched-user';
  public override attributes: UserTargetingEntity&DisableableEntity = {
    enabled: true,
    username: null,
    instance: null,
    userId: null,
  };
}

@Injectable({
  providedIn: 'root',
})
export class WatchedUserRepository extends AbstractRepository<WatchedUser> {
    public override resource: typeof AbstractEntity = WatchedUser;
    public override type: string = 'watched-user';
}
