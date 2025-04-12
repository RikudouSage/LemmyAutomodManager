import {Component, OnInit, signal, TemplateRef} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {TranslatorService} from "../../../services/translator.service";
import {TitleService} from "../../../services/title.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {toPromise} from "../../../helper/resolvable";
import {defaultDetailDeleteCallback, defaultSaveCallback} from "../../../helper/default-implementations";
import {BannedImage, BannedImageRepository} from "../../../entity/banned-image.entity";
import {CheckboxComponent} from "../../../root/components/checkbox/checkbox.component";
import {LoaderComponent} from "../../../root/components/loader/loader.component";
import {TranslocoMarkupComponent} from "ngx-transloco-markup";
import {TranslocoPipe} from "@jsverse/transloco";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ImageHashCalculatorService} from "../../../services/image-hash-calculator.service";

@Component({
  selector: 'app-banned-images-detail',
  standalone: true,
  imports: [
    CheckboxComponent,
    LoaderComponent,
    ReactiveFormsModule,
    TranslocoMarkupComponent,
    TranslocoPipe
  ],
  templateUrl: './banned-images-detail.component.html',
  styleUrl: './banned-images-detail.component.scss'
})
export class BannedImagesDetailComponent implements OnInit {
  private item = signal<BannedImage | null>(null);

  protected itemId = signal(0);
  protected loading = signal(true);

  protected form = new FormGroup({
    imageHash: new FormControl<string>('', [
      Validators.required,
      Validators.pattern('[01]{64}'),
    ]),
    similarityPercent: new FormControl<number>(100, [
      Validators.min(0),
      Validators.max(100),
      Validators.required,
    ]),
    removeAll: new FormControl<boolean>(false),
    reason: new FormControl<string>(''),
    description: new FormControl<string>(''),
    enabled: new FormControl(true),
  });

  constructor(
    private readonly translator: TranslatorService,
    private readonly titleService: TitleService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly repository: BannedImageRepository,
    private readonly toastr: ToastrService,
    private readonly router: Router,
    private readonly modalService: NgbModal,
    private readonly imageHashCalculator: ImageHashCalculatorService,
  ) {
  }

  public async ngOnInit(): Promise<void> {
    this.activatedRoute.params.subscribe(async params => {
      this.itemId.set(Number(params['id'] as string | undefined ?? null));

      if (this.itemId()) {
        this.titleService.title.set(await toPromise(this.translator.get('app.banned_images.edit.title', {id: this.itemId()})));
        const item = await toPromise(this.repository.get(this.itemId()));
        this.form.patchValue(item.attributes);
        this.item.set(item);
      } else {
        this.titleService.title.set(await toPromise(this.translator.get('app.banned_images.add.title')));
        this.item.set(new BannedImage(false));
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
          reason: form.value.reason ?? null,
          enabled: form.value.enabled ?? true,
          description: form.value.description ?? null,
          removeAll: form.value.removeAll ?? false,
          similarityPercent: form.value.similarityPercent ?? 100,
          imageHash: form.value.imageHash ?? '',
        };
      },
      !this.itemId(),
      this.repository,
      this.item,
      this.router,
      `/banned-images/detail/%id%`,
    )();
  }

  public async removeItem(): Promise<void> {
    await defaultDetailDeleteCallback(
      this.loading,
      this.repository,
      this.item,
      this.router,
      '/banned-images',
      this.toastr,
      this.translator,
    )();
  }

  public async openModal(calculateHashModal: TemplateRef<unknown>): Promise<void> {
    try {
      const result: string = await this.modalService.open(calculateHashModal).result;
      if (!result) {
        return;
      }
      this.loading.set(true);

      const url = new URL(result);
      const hash = await this.imageHashCalculator.calculateHash(url.toString());
      if (hash === null) {
        this.toastr.error(
          await toPromise(this.translator.get('app.error.failed_calculating_hash')),
          await toPromise(this.translator.get('app.error')),
        );
        return;
      }

      this.form.patchValue({
        imageHash: hash,
      });
    } catch (e) {
      if (!e) {
        return;
      }

      if (e instanceof TypeError) {
        this.toastr.error(
          await toPromise(this.translator.get('app.error.invalid_url')),
          await toPromise(this.translator.get('app.error')),
        );
      }
    } finally {
      this.loading.set(false);
    }
  }
}
