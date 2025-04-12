import {DeleteCallback} from "../root/components/data-list-table/data-list-table.component";
import {AbstractEntity} from "../services/json-api/abstract.entity";
import {AbstractRepository} from "../services/json-api/abstract.repository";
import {toPromise} from "./resolvable";
import {ToastrService} from "ngx-toastr";
import {TranslatorService} from "../services/translator.service";
import {AbstractControl, FormGroup} from "@angular/forms";
import {Signal, WritableSignal} from "@angular/core";
import {Router} from "@angular/router";

export function defaultDeleteCallback<T extends AbstractEntity>(
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

export function defaultSaveCallback<TEntity extends AbstractEntity, TControl extends {
  [K in keyof TControl]: AbstractControl;
} = any>(
  form: FormGroup<TControl>,
  toastr: ToastrService,
  translator: TranslatorService,
  loading: WritableSignal<boolean>,
  setDataCallback: (form: FormGroup<TControl>) => void,
  isNew: boolean,
  repository: AbstractRepository<TEntity>,
  item: WritableSignal<TEntity | null>,
  router: Router,
  redirectUrl: string,
): () => Promise<void> {
  return async (): Promise<void> => {
    if (!form.valid) {
      toastr.error(
        await toPromise(translator.get('app.error.invalid_form')),
        await toPromise(translator.get('app.error')),
      );

      for (const control of Object.values(form.controls)) {
        control.markAsDirty();
      }

      return;
    }

    loading.set(true);
    setDataCallback(form);

    const saveMethod = !isNew ? repository.update.bind(repository) : repository.create.bind(repository);

    try {
      item.set(await toPromise(saveMethod(item()!, false)));

      let message: string;
      if (!isNew) {
        message = await toPromise(translator.get('app.success.item_updated'));
      } else {
        message = await toPromise(translator.get('app.success.item_created'));
      }

      const displayNotification = async () => toastr.success(
        message,
        await toPromise(translator.get('app.success')),
      );

      if (isNew) {
        router.navigateByUrl(redirectUrl.replace('%id%', String(item()!.id))).then(async () => {
          await displayNotification();
        })
      } else {
        await displayNotification();
      }
    } catch (e) {
      console.error(e)
      toastr.error(
        await toPromise(translator.get('app.error.failed_saving')),
        await toPromise(translator.get('app.error')),
      );
    }

    loading.set(false);
  }
}

export function defaultDetailDeleteCallback<TEntity extends AbstractEntity>(
  loading: WritableSignal<boolean>,
  repository: AbstractRepository<TEntity>,
  item: Signal<TEntity | null>,
  router: Router,
  redirectUrl: string,
  toastr: ToastrService,
  translator: TranslatorService,
): () => Promise<void> {
  return async (): Promise<void> => {
    loading.set(true);
    try {
      await toPromise(repository.delete(item()!));
      router.navigateByUrl(redirectUrl).then(async () => {
        toastr.success(
          await toPromise(translator.get('app.success.item_removed')),
          await toPromise(translator.get('app.success')),
        )
      })
    } catch (e) {
      console.error(e);
      toastr.error(
        await toPromise(translator.get('app.error.failed_removing')),
        await toPromise(translator.get('app.error')),
      );
    }
    loading.set(false);
  };
}
