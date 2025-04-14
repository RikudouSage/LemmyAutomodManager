import {Component, OnInit, signal} from '@angular/core';
import {InstanceBanRegex, InstanceBanRegexRepository} from "../../../entity/instance-ban-regex.entity";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {TranslatorService} from "../../../services/translator.service";
import {TitleService} from "../../../services/title.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {toPromise} from "../../../helper/resolvable";
import {defaultDetailDeleteCallback, defaultSaveCallback} from "../../../helper/default-implementations";
import {CommunityRemoveRegex, CommunityRemoveRegexRepository} from "../../../entity/community-remove-regex.entity";
import {CheckboxComponent} from "../../../root/components/checkbox/checkbox.component";
import {LoaderComponent} from "../../../root/components/loader/loader.component";
import {TranslocoMarkupComponent} from "ngx-transloco-markup";
import {TranslocoPipe} from "@jsverse/transloco";

@Component({
  selector: 'app-community-remove-regexes-detail',
  standalone: true,
  imports: [
    CheckboxComponent,
    LoaderComponent,
    ReactiveFormsModule,
    TranslocoMarkupComponent,
    TranslocoPipe
  ],
  templateUrl: './community-remove-regexes-detail.component.html',
  styleUrl: './community-remove-regexes-detail.component.scss'
})
export class CommunityRemoveRegexesDetailComponent implements OnInit {
  private item = signal<CommunityRemoveRegex | null>(null);

  protected itemId = signal(0);
  protected loading = signal(true);

  protected form = new FormGroup({
    regex: new FormControl<string>('', [Validators.required]),
    reason: new FormControl<string>(''),
    enabled: new FormControl(true),
    banModerators: new FormControl(true),
  });

  constructor(
    private readonly translator: TranslatorService,
    private readonly titleService: TitleService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly repository: CommunityRemoveRegexRepository,
    private readonly toastr: ToastrService,
    private readonly router: Router,
  ) {
  }

  public async ngOnInit(): Promise<void> {
    this.activatedRoute.params.subscribe(async params => {
      this.itemId.set(Number(params['id'] as string | undefined ?? null));

      if (this.itemId()) {
        this.titleService.title.set(await toPromise(this.translator.get('app.community_remove_regexes.edit.title', {id: this.itemId()})));
        const item = await toPromise(this.repository.get(this.itemId()));
        this.form.patchValue(item.attributes);
        this.item.set(item);
      } else {
        this.titleService.title.set(await toPromise(this.translator.get('app.community_remove_regexes.add.title')));
        this.item.set(new CommunityRemoveRegex(false))
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
          banModerators: this.form.value.banModerators ?? false,
          enabled: this.form.value.enabled ?? true,
        };
      },
      !this.itemId(),
      this.repository,
      this.item,
      this.router,
      `/community-remove-regexes/detail/%id%`,
    )();
  }

  public async removeItem(): Promise<void> {
    await defaultDetailDeleteCallback(
      this.loading,
      this.repository,
      this.item,
      this.router,
      '/community-remove-regexes',
      this.toastr,
      this.translator,
    )();
  }
}
