import {AbstractEntity} from "../services/json-api/abstract.entity";
import {AbstractRepository, EntityConstructor} from "../services/json-api/abstract.repository";
import {DisableableEntity, RegexReasonEntity, RemoveAllEntity} from "../helper/common-entity-types";
import {Injectable} from "@angular/core";

export class BannedQrCode extends AbstractEntity {
  public override type: string = 'banned-qr-code';
  public override attributes: DisableableEntity&RemoveAllEntity&RegexReasonEntity = {
    regex: '',
    reason: null,
    removeAll: false,
    enabled: true
  };
}

@Injectable({
  providedIn: 'root',
})
export class BannedQrCodeRepository extends AbstractRepository<BannedQrCode> {
    public override resource: EntityConstructor<BannedQrCode> = BannedQrCode;
    public override type: string = 'banned-qr-code';
}
