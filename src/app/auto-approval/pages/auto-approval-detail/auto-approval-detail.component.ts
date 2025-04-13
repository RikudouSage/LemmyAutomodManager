import {Component, OnInit, signal} from '@angular/core';
import {BannedEmail, BannedEmailRepository} from "../../../entity/banned-email.entity";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {TranslatorService} from "../../../services/translator.service";
import {TitleService} from "../../../services/title.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {toPromise} from "../../../helper/resolvable";
import {defaultDetailDeleteCallback, defaultSaveCallback} from "../../../helper/default-implementations";
import {AutoApprovalRegex, AutoApprovalRegexRepository} from "../../../entity/auto-approval-regex.entity";
import {CheckboxComponent} from "../../../root/components/checkbox/checkbox.component";
import {LoaderComponent} from "../../../root/components/loader/loader.component";
import {TranslocoMarkupComponent} from "ngx-transloco-markup";
import {TranslocoPipe} from "@jsverse/transloco";

@Component({
  selector: 'app-auto-approval-detail',
  standalone: true,
  imports: [
    CheckboxComponent,
    FormsModule,
    LoaderComponent,
    ReactiveFormsModule,
    TranslocoMarkupComponent,
    TranslocoPipe
  ],
  templateUrl: './auto-approval-detail.component.html',
  styleUrl: './auto-approval-detail.component.scss'
})
export class AutoApprovalDetailComponent implements OnInit {
  private item = signal<AutoApprovalRegex | null>(null);

  protected itemId = signal(0);
  protected loading = signal(true);

  protected form = new FormGroup({
    regex: new FormControl<string>('', [Validators.required]),
    enabled: new FormControl(true),
  });

  constructor(
    private readonly translator: TranslatorService,
    private readonly titleService: TitleService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly repository: AutoApprovalRegexRepository,
    private readonly toastr: ToastrService,
    private readonly router: Router,
  ) {
  }

  public async ngOnInit(): Promise<void> {
    this.activatedRoute.params.subscribe(async params => {
      this.itemId.set(Number(params['id'] as string | undefined ?? null));

      if (this.itemId()) {
        this.titleService.title.set(await toPromise(this.translator.get('app.auto_approval.edit.title', {id: this.itemId()})));
        const item = await toPromise(this.repository.get(this.itemId()));
        this.form.patchValue(item.attributes);
        this.item.set(item);
      } else {
        this.titleService.title.set(await toPromise(this.translator.get('app.auto_approval.add.title')));
        this.item.set(new AutoApprovalRegex(false));
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
          enabled: this.form.value.enabled ?? true,
        };
      },
      !this.itemId(),
      this.repository,
      this.item,
      this.router,
      `/auto-approval/detail/%id%`,
    )();
  }

  public async removeItem(): Promise<void> {
    await defaultDetailDeleteCallback(
      this.loading,
      this.repository,
      this.item,
      this.router,
      '/auto-approval',
      this.toastr,
      this.translator,
    )();
  }
}
