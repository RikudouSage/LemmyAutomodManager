import {Component, OnInit, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {TranslatorService} from "../../../services/translator.service";
import {TitleService} from "../../../services/title.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {toPromise} from "../../../helper/resolvable";
import {defaultDetailDeleteCallback, defaultSaveCallback} from "../../../helper/default-implementations";
import {ExternalRegexList, ExternalRegexListRepository} from "../../../entity/external-regex-list.entity";
import {CheckboxComponent} from "../../../root/components/checkbox/checkbox.component";
import {LoaderComponent} from "../../../root/components/loader/loader.component";
import {TranslocoMarkupComponent} from "ngx-transloco-markup";
import {TranslocoPipe} from "@jsverse/transloco";

@Component({
  selector: 'app-external-list-detail',
  standalone: true,
  imports: [
    CheckboxComponent,
    LoaderComponent,
    ReactiveFormsModule,
    TranslocoMarkupComponent,
    TranslocoPipe
  ],
  templateUrl: './external-list-detail.component.html',
  styleUrl: './external-list-detail.component.scss'
})
export class ExternalListDetailComponent implements OnInit {
  private item = signal<ExternalRegexList | null>(null);

  protected itemId = signal(0);
  protected loading = signal(true);

  protected form = new FormGroup({
    url: new FormControl<string>('', [Validators.required]),
    delimiter: new FormControl<string>('', [Validators.required]),
    name: new FormControl<string>('', [Validators.required]),
    append: new FormControl<string>(''),
    prepend: new FormControl<string>(''),
  });

  constructor(
    private readonly translator: TranslatorService,
    private readonly titleService: TitleService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly repository: ExternalRegexListRepository,
    private readonly toastr: ToastrService,
    private readonly router: Router,
  ) {
  }

  public async ngOnInit(): Promise<void> {
    this.activatedRoute.params.subscribe(async params => {
      this.itemId.set(Number(params['id'] as string | undefined ?? null));

      if (this.itemId()) {
        this.titleService.title.set(await toPromise(this.translator.get('app.external_lists.edit.title', {id: this.itemId()})));
        const item = await toPromise(this.repository.get(this.itemId()));
        this.form.patchValue(item.attributes);
        this.item.set(item);
      } else {
        this.titleService.title.set(await toPromise(this.translator.get('app.external_lists.add.title')));
        this.item.set(new ExternalRegexList(false))
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
          name: form.value.name!,
          url: form.value.url!,
          delimiter: form.value.delimiter!,
          append: form.value.append ?? null,
          prepend: form.value.prepend ?? null,
        };
      },
      !this.itemId(),
      this.repository,
      this.item,
      this.router,
      `/external-lists/detail/%id%`,
    )();
  }

  public async removeItem(): Promise<void> {
    await defaultDetailDeleteCallback(
      this.loading,
      this.repository,
      this.item,
      this.router,
      '/external-lists',
      this.toastr,
      this.translator,
    )();
  }
}
