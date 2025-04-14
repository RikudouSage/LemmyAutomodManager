import {AbstractEntity} from "../services/json-api/abstract.entity";
import {AbstractRepository, EntityConstructor} from "../services/json-api/abstract.repository";
import {Injectable} from "@angular/core";

export class IgnoredComment extends AbstractEntity {
  public override type: string = 'ignored-comment';
  public override attributes: {
    commentId: number;
  } = {
    commentId: 0,
  };
}

@Injectable({
  providedIn: 'root',
})
export class IgnoredCommentRepository extends AbstractRepository<IgnoredComment> {
    public override resource: EntityConstructor<IgnoredComment> = IgnoredComment;
    public override type: string = 'ignored-comment';
}
