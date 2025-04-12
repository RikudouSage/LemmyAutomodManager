import {DeleteCallback} from "../root/components/data-list-table/data-list-table.component";
import {AbstractEntity} from "../services/json-api/abstract.entity";
import {AbstractRepository} from "../services/json-api/abstract.repository";
import {toPromise} from "./resolvable";
import {ToastrService} from "ngx-toastr";
import {TranslatorService} from "../services/translator.service";

export function getDefaultDeleteCallback<T extends AbstractEntity>(
  repository: AbstractRepository<T>,
  toastr: ToastrService,
  translator: TranslatorService,
): DeleteCallback<AbstractEntity> {
  return async (item: AbstractEntity): Promise<boolean> => {
    try {
      await toPromise(repository.delete(item as T));
      toastr.success(
        await toPromise(translator.get('app.success.item_removed')),
        await toPromise(translator.get('app.success')),
      );
      return true;
    } catch (e) {
      toastr.error(
        await toPromise(translator.get('app.error.failed_removing')),
        await toPromise(translator.get('app.error')),
      );
      return false;
    }
  }
}
