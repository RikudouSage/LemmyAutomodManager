import {AbstractEntity} from "../services/json-api/abstract.entity";
import {AbstractRepository} from "../services/json-api/abstract.repository";
import {Injectable} from "@angular/core";
import {DisableableEntity, RegexReasonEntity} from "../helper/common-entity-types";

export class BannedEmail extends AbstractEntity {
    public override type: string = 'banned-email';

    public override attributes: RegexReasonEntity&DisableableEntity = {
      regex: '',
      reason: null,
      enabled: false,
    };
}

@Injectable({
  providedIn: 'root',
})
export class BannedEmailRepository extends AbstractRepository<BannedEmail> {
    public override resource: typeof AbstractEntity = BannedEmail;
    public override type: string = 'banned-email';
}
