import {Component, OnInit, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {TranslatorService} from "../../../services/translator.service";
import {TitleService} from "../../../services/title.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {toPromise} from "../../../helper/resolvable";
import {defaultDetailDeleteCallback, defaultSaveCallback} from "../../../helper/default-implementations";
import {WatchedUser, WatchedUserRepository} from "../../../entity/watched-user.entity";
import {CheckboxComponent} from "../../../root/components/checkbox/checkbox.component";
import {LoaderComponent} from "../../../root/components/loader/loader.component";
import {TranslocoMarkupComponent} from "ngx-transloco-markup";
import {TranslocoPipe} from "@jsverse/transloco";
import {AlertComponent, AlertType} from "../../../root/components/alert/alert.component";

@Component({
  selector: 'app-watched-users-detail',
  standalone: true,
  imports: [
    CheckboxComponent,
    LoaderComponent,
    ReactiveFormsModule,
    TranslocoMarkupComponent,
    TranslocoPipe,
    AlertComponent
  ],
  templateUrl: './watched-users-detail.component.html',
  styleUrl: './watched-users-detail.component.scss'
})
export class WatchedUsersDetailComponent implements OnInit {
  private item = signal<WatchedUser | null>(null);

  protected itemId = signal(0);
  protected loading = signal(true);

  protected form = new FormGroup({
    username: new FormControl<string>(''),
    instance: new FormControl<string>(''),
    userId: new FormControl<number | null>(null),
    enabled: new FormControl<boolean>(true),
  });

  constructor(
    private readonly translator: TranslatorService,
    private readonly titleService: TitleService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly repository: WatchedUserRepository,
    private readonly toastr: ToastrService,
    private readonly router: Router,
  ) {
  }

  public async ngOnInit(): Promise<void> {
    this.activatedRoute.params.subscribe(async params => {
      this.itemId.set(Number(params['id'] as string | undefined ?? null));

      if (this.itemId()) {
        this.titleService.title.set(await toPromise(this.translator.get('app.watched_users.edit.title', {id: this.itemId()})));
        const item = await toPromise(this.repository.get(this.itemId()));
        this.form.patchValue(item.attributes);
        this.item.set(item);
      } else {
        this.titleService.title.set(await toPromise(this.translator.get('app.watched_users.add.title')));
        this.item.set(new WatchedUser(false))
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
          userId: form.value.userId || null,
          enabled: form.value.enabled ?? true,
          instance: form.value.instance || null,
          username: form.value.username || null,
        };
      },
      !this.itemId(),
      this.repository,
      this.item,
      this.router,
      `/watched-users/detail/%id%`,
    )();
  }

  public async removeItem(): Promise<void> {
    await defaultDetailDeleteCallback(
      this.loading,
      this.repository,
      this.item,
      this.router,
      '/watched-users',
      this.toastr,
      this.translator,
    )();
  }

  protected readonly AlertType = AlertType;
}
