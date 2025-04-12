import {AbstractEntity} from "../services/json-api/abstract.entity";
import {AbstractRepository} from "../services/json-api/abstract.repository";
import {Injectable} from "@angular/core";

export class BannedImage extends AbstractEntity {
    public override type: string = 'banned-image';

    public override attributes: {
      imageHash: string;
      similarityPercent: number;
      removeAll: boolean;
      reason: string | null;
      description: string | null;
      enabled: boolean;
    } = {
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
  public override resource: typeof AbstractEntity = BannedImage;
  public override type: string = 'banned-image';
}
