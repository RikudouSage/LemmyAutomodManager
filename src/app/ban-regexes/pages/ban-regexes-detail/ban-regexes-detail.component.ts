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
import {defaultDetailDeleteCallback, defaultSaveCallback} from "../../../helper/default-implementations";

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
    await defaultSaveCallback(
      this.form,
      this.toastr,
      this.translator,
      this.loading,
      form => {
        this.item()!.attributes = {
          regex: form.value.regex!,
          reason: form.value.reason ?? null,
          removeAll: this.form.value.removeAll ?? false,
          enabled: this.form.value.enabled ?? true,
        };
      },
      !this.itemId(),
      this.repository,
      this.item,
      this.router,
      `/ban-regexes/detail/%id%`,
    )();
  }

  public async removeItem(): Promise<void> {
    await defaultDetailDeleteCallback(
      this.loading,
      this.repository,
      this.item,
      this.router,
      '/ban-regexes',
      this.toastr,
      this.translator,
    )();
  }
}
