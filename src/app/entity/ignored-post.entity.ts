import {AbstractEntity} from "../services/json-api/abstract.entity";
import {AbstractRepository, EntityConstructor} from "../services/json-api/abstract.repository";
import {Injectable} from "@angular/core";

export class IgnoredPost extends AbstractEntity {
  public override type: string = 'ignored-post';
  public override attributes: {
    postId: number;
  } = {
    postId: 0,
  };
}

@Injectable({
  providedIn: 'root',
})
export class IgnoredPostRepository extends AbstractRepository<IgnoredPost> {
    public override resource: EntityConstructor<IgnoredPost> = IgnoredPost;
    public override type: string = 'ignored-post';
}
