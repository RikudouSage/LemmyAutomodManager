import {AbstractEntity} from "../services/json-api/abstract.entity";
import {AbstractRepository, EntityConstructor} from "../services/json-api/abstract.repository";
import {Injectable} from "@angular/core";

export enum ComplexRuleType {
  Post = 'post',
  Comment = 'comment',
  Person = 'person',
  CommentReport = 'comment_report',
  PostReport = 'post_report',
  PrivateMessageReport = 'private_message_report',
  RegistrationApplication = 'registration_application',
  LocalUser = 'local_user',
  Instance = 'instance',
  Community = 'community',
  PrivateMessageWithContent = 'private_message_with_content',
}

export enum RunConfiguration {
  Always = 'always',
  WhenNotAborted = 'not_aborted',
}

export class ComplexRule extends AbstractEntity {
  public override type: string = 'complex-rule';
  public override attributes: {
    type: ComplexRuleType;
    rule: string;
    actions: string;
    runConfiguration: RunConfiguration;
    enabled: boolean;
  } = {
    type: ComplexRuleType.Post,
    rule: "",
    actions: "",
    runConfiguration: RunConfiguration.Always,
    enabled: false,
  };
}

@Injectable({
  providedIn: 'root',
})
export class ComplexRuleRepository extends AbstractRepository<ComplexRule> {
  public override resource: EntityConstructor<ComplexRule> = ComplexRule;
  public override type: string = 'complex-rule';
}
