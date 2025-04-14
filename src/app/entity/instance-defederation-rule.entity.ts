import {AbstractEntity} from "../services/json-api/abstract.entity";
import {AbstractRepository, EntityConstructor} from "../services/json-api/abstract.repository";
import {Injectable} from "@angular/core";
import {DisableableEntity} from "../helper/common-entity-types";

export class InstanceDefederationRule extends AbstractEntity {
  public override type: string = 'instance-defederation-rule';
  public override attributes: DisableableEntity&{
    software: string | null;
    allowOpenRegistrations: boolean | null;
    allowOpenRegistrationsWithCaptcha: boolean | null;
    allowOpenRegistrationsWithEmailVerification: boolean | null;
    allowOpenRegistrationsWithApplication: boolean | null;
    treatMissingDataAs: boolean | null;
    minimumVersion: string | null;
    reason: string | null;
    evidence: string | null;
  } = {
    software: null,
    allowOpenRegistrations: null,
    allowOpenRegistrationsWithCaptcha: null,
    allowOpenRegistrationsWithEmailVerification: null,
    allowOpenRegistrationsWithApplication: null,
    treatMissingDataAs: null,
    minimumVersion: null,
    reason: null,
    evidence: null,
    enabled: true,
  };
}

@Injectable({
  providedIn: 'root',
})
export class InstanceDefederationRuleRepository extends AbstractRepository<InstanceDefederationRule> {
    public override resource: EntityConstructor<InstanceDefederationRule> = InstanceDefederationRule;
    public override type: string = 'instance-defederation-rule';
}
