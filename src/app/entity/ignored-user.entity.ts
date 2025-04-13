import {AbstractEntity} from "../services/json-api/abstract.entity";
import {AbstractRepository, EntityConstructor} from "../services/json-api/abstract.repository";
import {Injectable} from "@angular/core";
import {DisableableEntity, UserTargetingEntity} from "../helper/common-entity-types";

export class IgnoredUser extends AbstractEntity {
  public override type: string = 'ignored-user';
  public override attributes: UserTargetingEntity&DisableableEntity = {
    enabled: false,
    instance: null,
    userId: null,
    username: null,
  };
}

@Injectable({
  providedIn: 'root',
})
export class IgnoredUserRepository extends AbstractRepository<IgnoredUser> {
    public override resource: EntityConstructor<IgnoredUser> = IgnoredUser;
    public override type: string = 'ignored-user';
}
