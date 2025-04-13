import {AbstractEntity} from "../services/json-api/abstract.entity";
import {AbstractRepository, EntityConstructor} from "../services/json-api/abstract.repository";
import {DisableableEntity} from "../helper/common-entity-types";
import {Injectable} from "@angular/core";

export class AutoApprovalRegex extends AbstractEntity {
  public override type: string = 'auto-approval-regex';
  public override attributes: DisableableEntity&{regex: string} = {
    regex: '',
    enabled: true,
  };
}

@Injectable({
  providedIn: 'root',
})
export class AutoApprovalRegexRepository extends AbstractRepository<AutoApprovalRegex> {
    public override resource: EntityConstructor<AutoApprovalRegex> = AutoApprovalRegex;
    public override type: string = 'auto-approval-regex';
}
