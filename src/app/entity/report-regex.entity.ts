import {AbstractEntity} from "../services/json-api/abstract.entity";
import {DisableableEntity} from "../helper/common-entity-types";
import {AbstractRepository, EntityConstructor} from "../services/json-api/abstract.repository";
import {Injectable} from "@angular/core";

export class ReportRegex extends AbstractEntity {
  public override type: string = 'report-regex';
  public override attributes: DisableableEntity & {
    regex: string;
    message: string;
    private: boolean;
  } = {
    regex: '',
    message: '',
    private: true,
    enabled: true,
  };
}

@Injectable({
  providedIn: 'root',
})
export class ReportRegexRepository extends AbstractRepository<ReportRegex> {
    public override resource: EntityConstructor<ReportRegex> = ReportRegex;
    public override type: string = 'report-regex';
}
