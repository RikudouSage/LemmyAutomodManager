import {Component, OnInit, signal} from '@angular/core';
import {InstanceBanRegex, InstanceBanRegexRepository} from "../../../entity/instance-ban-regex.entity";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {TranslatorService} from "../../../services/translator.service";
import {TitleService} from "../../../services/title.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {toPromise} from "../../../helper/resolvable";
import {defaultDetailDeleteCallback, defaultSaveCallback} from "../../../helper/default-implementations";
import {BannedUsername, BannedUsernameRepository} from "../../../entity/banned-username.entity";
import {CheckboxComponent} from "../../../root/components/checkbox/checkbox.component";
import {LoaderComponent} from "../../../root/components/loader/loader.component";
import {TranslocoMarkupComponent} from "ngx-transloco-markup";
import {TranslocoPipe} from "@jsverse/transloco";

@Component({
  selector: 'app-banned-usernames-detail',
  standalone: true,
  imports: [
    CheckboxComponent,
    LoaderComponent,
    ReactiveFormsModule,
    TranslocoMarkupComponent,
    TranslocoPipe
  ],
  templateUrl: './banned-usernames-detail.component.html',
  styleUrl: './banned-usernames-detail.component.scss'
})
export class BannedUsernamesDetailComponent implements OnInit {
  private item = signal<BannedUsername | null>(null);

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
    private readonly repository: BannedUsernameRepository,
    private readonly toastr: ToastrService,
    private readonly router: Router,
  ) {
  }

  public async ngOnInit(): Promise<void> {
    this.activatedRoute.params.subscribe(async params => {
      this.itemId.set(Number(params['id'] as string | undefined ?? null));

      if (this.itemId()) {
        this.titleService.title.set(await toPromise(this.translator.get('app.banned_usernames.edit.title', {id: this.itemId()})));
        const item = await toPromise(this.repository.get(this.itemId()));
        this.form.patchValue({
          ...item.attributes,
          regex: item.attributes.username,
        });
        this.item.set(item);
      } else {
        this.titleService.title.set(await toPromise(this.translator.get('app.banned_usernames.add.title')));
        this.item.set(new BannedUsername(false))
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
          username: form.value.regex!,
          reason: form.value.reason ?? null,
          removeAll: this.form.value.removeAll ?? false,
          enabled: this.form.value.enabled ?? true,
        };
      },
      !this.itemId(),
      this.repository,
      this.item,
      this.router,
      `/banned-usernames/detail/%id%`,
    )();
  }

  public async removeItem(): Promise<void> {
    await defaultDetailDeleteCallback(
      this.loading,
      this.repository,
      this.item,
      this.router,
      '/banned-usernames',
      this.toastr,
      this.translator,
    )();
  }
}
