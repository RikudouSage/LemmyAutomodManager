import {Component, OnInit, signal} from '@angular/core';
import {CommunityRemoveRegex, CommunityRemoveRegexRepository} from "../../../entity/community-remove-regex.entity";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {TranslatorService} from "../../../services/translator.service";
import {TitleService} from "../../../services/title.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {toPromise} from "../../../helper/resolvable";
import {defaultDetailDeleteCallback, defaultSaveCallback} from "../../../helper/default-implementations";
import {
  InstanceDefederationRule,
  InstanceDefederationRuleRepository
} from "../../../entity/instance-defederation-rule.entity";
import {CheckboxComponent} from "../../../root/components/checkbox/checkbox.component";
import {LoaderComponent} from "../../../root/components/loader/loader.component";
import {TranslocoMarkupComponent} from "ngx-transloco-markup";
import {TranslocoPipe} from "@jsverse/transloco";
import {YesNoNullComponent} from "../../components/yes-no-null/yes-no-null.component";
import {YesNoComponent} from "../../../root/components/yes-no/yes-no.component";

@Component({
  selector: 'app-instance-defederations-detail',
  standalone: true,
  imports: [
    CheckboxComponent,
    LoaderComponent,
    ReactiveFormsModule,
    TranslocoMarkupComponent,
    TranslocoPipe,
    YesNoNullComponent,
    YesNoComponent
  ],
  templateUrl: './instance-defederations-detail.component.html',
  styleUrl: './instance-defederations-detail.component.scss'
})
export class InstanceDefederationsDetailComponent implements OnInit {
  private item = signal<InstanceDefederationRule | null>(null);

  protected itemId = signal(0);
  protected loading = signal(true);

  protected form = new FormGroup({
    software: new FormControl<string>(''),
    allowOpenRegistrations: new FormControl<boolean | null>(null),
    allowOpenRegistrationsWithCaptcha: new FormControl<boolean | null>(null),
    allowOpenRegistrationsWithEmailVerification: new FormControl<boolean | null>(null),
    allowOpenRegistrationsWithApplication: new FormControl<boolean | null>(null),
    treatMissingDataAs: new FormControl<boolean | null>(null),
    minimumVersion: new FormControl<string>(''),
    reason: new FormControl<string>(''),
    evidence: new FormControl<string>(''),
    enabled: new FormControl<boolean>(true),
  });

  constructor(
    private readonly translator: TranslatorService,
    private readonly titleService: TitleService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly repository: InstanceDefederationRuleRepository,
    private readonly toastr: ToastrService,
    private readonly router: Router,
  ) {
  }

  public async ngOnInit(): Promise<void> {
    this.activatedRoute.params.subscribe(async params => {
      this.itemId.set(Number(params['id'] as string | undefined ?? null));

      if (this.itemId()) {
        this.titleService.title.set(await toPromise(this.translator.get('app.instance_defederations.edit.title', {id: this.itemId()})));
        const item = await toPromise(this.repository.get(this.itemId()));
        this.form.patchValue(item.attributes);
        this.item.set(item);
      } else {
        this.titleService.title.set(await toPromise(this.translator.get('app.instance_defederations.add.title')));
        this.item.set(new InstanceDefederationRule(false))
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
          software: form.value.software || null,
          allowOpenRegistrations: form.value.allowOpenRegistrations ?? null,
          allowOpenRegistrationsWithCaptcha: form.value.allowOpenRegistrationsWithCaptcha ?? null,
          allowOpenRegistrationsWithEmailVerification: form.value.allowOpenRegistrationsWithEmailVerification ?? null,
          allowOpenRegistrationsWithApplication: form.value.allowOpenRegistrationsWithApplication ?? null,
          treatMissingDataAs: form.value.treatMissingDataAs ?? null,
          minimumVersion: form.value.minimumVersion || null,
          reason: form.value.reason || null,
          evidence: form.value.evidence || null,
          enabled: form.value.enabled ?? false,
        };
      },
      !this.itemId(),
      this.repository,
      this.item,
      this.router,
      `/instance-defederations/detail/%id%`,
    )();
  }

  public async removeItem(): Promise<void> {
    await defaultDetailDeleteCallback(
      this.loading,
      this.repository,
      this.item,
      this.router,
      '/instance-defederations',
      this.toastr,
      this.translator,
    )();
  }
}
