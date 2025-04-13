import {AbstractEntity} from "../services/json-api/abstract.entity";
import {AbstractRepository} from "../services/json-api/abstract.repository";
import {Injectable} from "@angular/core";
import {DisableableEntity, RemoveAllEntity} from "../helper/common-entity-types";

export class BannedImage extends AbstractEntity {
    public override type: string = 'banned-image';

    public override attributes: {
      imageHash: string;
      similarityPercent: number;
      reason: string | null;
      description: string | null;
    }&RemoveAllEntity&DisableableEntity = {
      imageHash: '',
      similarityPercent: 0.0,
      removeAll: false,
      reason: null,
      description: null,
      enabled: false,
    };
}

@Injectable({
  providedIn: 'root',
})
export class BannedImageRepository extends AbstractRepository<BannedImage> {
  public override resource: typeof BannedImage = BannedImage;
  public override type: string = 'banned-image';
}
