import {Component, OnInit, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {TranslatorService} from "../../../services/translator.service";
import {TitleService} from "../../../services/title.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {toPromise} from "../../../helper/resolvable";
import {defaultDetailDeleteCallback, defaultSaveCallback} from "../../../helper/default-implementations";
import {
  ComplexRule,
  ComplexRuleRepository,
  ComplexRuleType,
  RunConfiguration
} from "../../../entity/complex-rule.entity";
import {LoaderComponent} from "../../../root/components/loader/loader.component";
import {TranslocoMarkupComponent} from "ngx-transloco-markup";
import {TranslocoPipe} from "@jsverse/transloco";
import {KeyValuePipe} from "@angular/common";
import {CheckboxComponent} from "../../../root/components/checkbox/checkbox.component";

@Component({
  selector: 'app-complex-rule-detail',
  standalone: true,
  imports: [
    LoaderComponent,
    ReactiveFormsModule,
    TranslocoMarkupComponent,
    TranslocoPipe,
    KeyValuePipe,
    CheckboxComponent
  ],
  templateUrl: './complex-rule-detail.component.html',
  styleUrl: './complex-rule-detail.component.scss'
})
export class ComplexRuleDetailComponent implements OnInit {
  protected readonly ComplexRuleType = ComplexRuleType;
  protected readonly RunConfiguration = RunConfiguration;

  private item = signal<ComplexRule | null>(null);

  protected itemId = signal(0);
  protected loading = signal(true);

  protected form = new FormGroup({
    type: new FormControl<ComplexRuleType>(ComplexRuleType.Post, [Validators.required]),
    rule: new FormControl<string>('', [Validators.required]),
    actions: new FormControl<string>('', [Validators.required]),
    runConfiguration: new FormControl<RunConfiguration>(RunConfiguration.WhenNotAborted, [Validators.required]),
    enabled: new FormControl<boolean>(true),
  });

  constructor(
    private readonly translator: TranslatorService,
    private readonly titleService: TitleService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly repository: ComplexRuleRepository,
    private readonly toastr: ToastrService,
    private readonly router: Router,
  ) {
  }

  public async ngOnInit(): Promise<void> {
    this.activatedRoute.params.subscribe(async params => {
      this.itemId.set(Number(params['id'] as string | undefined ?? null));

      if (this.itemId()) {
        this.titleService.title.set(await toPromise(this.translator.get('app.complex_rules.edit.title', {id: this.itemId()})));
        const item = await toPromise(this.repository.get(this.itemId()));
        this.form.patchValue(item.attributes);
        this.item.set(item);
      } else {
        this.titleService.title.set(await toPromise(this.translator.get('app.complex_rules.add.title')));
        this.item.set(new ComplexRule(false))
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
          rule: form.value.rule!,
          actions: form.value.actions!,
          enabled: form.value.enabled!,
          type: form.value.type!,
          runConfiguration: form.value.runConfiguration!
        };
      },
      !this.itemId(),
      this.repository,
      this.item,
      this.router,
      `/complex-rules/detail/%id%`,
    )();
  }

  public async removeItem(): Promise<void> {
    await defaultDetailDeleteCallback(
      this.loading,
      this.repository,
      this.item,
      this.router,
      '/complex-rules',
      this.toastr,
      this.translator,
    )();}

}
