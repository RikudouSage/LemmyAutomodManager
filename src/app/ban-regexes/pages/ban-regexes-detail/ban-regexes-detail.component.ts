import {Component, OnInit, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {TranslocoPipe} from "@jsverse/transloco";
import {TranslatorService} from "../../../services/translator.service";
import {TitleService} from "../../../services/title.service";
import {toPromise} from "../../../helper/resolvable";
import {ActivatedRoute, Router} from "@angular/router";
import {LoaderComponent} from "../../../root/components/loader/loader.component";
import {InstanceBanRegex, InstanceBanRegexRepository} from "../../../entity/instance-ban-regex.entity";
import {TranslocoMarkupComponent} from "ngx-transloco-markup";
import {CheckboxComponent} from "../../../root/components/checkbox/checkbox.component";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-ban-regexes-detail',
  standalone: true,
  imports: [
    TranslocoPipe,
    LoaderComponent,
    ReactiveFormsModule,
    TranslocoMarkupComponent,
    CheckboxComponent
  ],
  templateUrl: './ban-regexes-detail.component.html',
  styleUrl: './ban-regexes-detail.component.scss'
})
export class BanRegexesDetailComponent implements OnInit {
  private item = signal<InstanceBanRegex | null>(null);

  protected itemId = signal(0);
  protected loading = signal(true);

  protected form = new FormGroup({
    regex: new FormControl<string>('', [Validators.required]),
    reason: new FormControl<string>(''),
    enabled: new FormControl(true),
    removeAll: new FormControl(true),
  });

  constructor(
    private readonly translator: TranslatorService,
    private readonly titleService: TitleService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly repository: InstanceBanRegexRepository,
    private readonly toastr: ToastrService,
    private readonly router: Router,
  ) {
  }

  public async ngOnInit(): Promise<void> {
    this.activatedRoute.params.subscribe(async params => {
      this.itemId.set(Number(params['id'] as string | undefined ?? null));

      if (this.itemId()) {
        this.titleService.title.set(await toPromise(this.translator.get('app.ban_regexes.edit.title', {id: this.itemId()})));
        const item = await toPromise(this.repository.get(this.itemId()));
        this.form.patchValue(item.attributes);
        this.item.set(item);
      } else {
        this.titleService.title.set(await toPromise(this.translator.get('app.ban_regexes.add.title')));
        this.item.set(new InstanceBanRegex(false))
      }
      this.loading.set(false);
    });
  }

  public async save(): Promise<void> {
    if (!this.form.valid) {
      this.toastr.error(
        await toPromise(this.translator.get('app.error.invalid_form')),
        await toPromise(this.translator.get('app.error')),
      );

      for (const control of Object.values(this.form.controls)) {
        control.markAsDirty();
      }

      return;
    }

    this.loading.set(true);
    this.item()!.attributes = {
      regex: this.form.value.regex!,
      reason: this.form.value.reason ?? null,
      removeAll: this.form.value.removeAll ?? false,
      enabled: this.form.value.enabled ?? true,
    };

    const saveMethod = this.itemId() ? this.repository.update.bind(this.repository) : this.repository.create.bind(this.repository);

    try {
      this.item.set(await toPromise(saveMethod(this.item()!, false)));

      let message: string;
      if (this.itemId()) {
        message = await toPromise(this.translator.get('app.success.item_updated'));
      } else {
        message = await toPromise(this.translator.get('app.success.item_created'));
      }

      const displayNotification = async () => this.toastr.success(
        message,
        await toPromise(this.translator.get('app.success')),
      );

      if (!this.itemId()) {
        this.router.navigateByUrl(`/ban-regexes/detail/${this.item()!.id!}`).then(async () => {
          await displayNotification();
        })
      } else {
        await displayNotification();
      }
    } catch (e) {
      console.error(e)
      this.toastr.error(
        await toPromise(this.translator.get('app.error.failed_saving')),
        await toPromise(this.translator.get('app.error')),
      );
    }

    this.loading.set(false);
  }

  public async removeItem(): Promise<void> {
    this.loading.set(true);
    try {
      await toPromise(this.repository.delete(this.item()!));
      this.router.navigateByUrl('/ban-regexes').then(async () => {
        this.toastr.success(
          await toPromise(this.translator.get('app.success.item_removed')),
          await toPromise(this.translator.get('app.success')),
        )
      })
    } catch (e) {
      console.error(e);
      this.toastr.error(
        await toPromise(this.translator.get('app.error.failed_removing')),
        await toPromise(this.translator.get('app.error')),
      );
    }
    this.loading.set(false);
  }
}
