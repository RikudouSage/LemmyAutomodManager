import {AbstractEntity} from "../services/json-api/abstract.entity";
import {DisableableEntity, UserTargetingEntity} from "../helper/common-entity-types";
import {AbstractRepository} from "../services/json-api/abstract.repository";
import {Injectable} from "@angular/core";

export class TrustedUser extends AbstractEntity {
    public override type: string = 'trusted-user';
    public override attributes: DisableableEntity&UserTargetingEntity = {
      enabled: false,
      instance: null,
      userId: null,
      username: null,
    }
}

@Injectable({
  providedIn: 'root',
})
export class TrustedUserRepository extends AbstractRepository<TrustedUser> {
  public override resource: typeof TrustedUser = TrustedUser;
  public override type = 'trusted-user';
}
