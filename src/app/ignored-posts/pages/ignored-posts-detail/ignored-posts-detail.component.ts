import {Component, OnInit, signal} from '@angular/core';
import {IgnoredComment, IgnoredCommentRepository} from "../../../entity/ignored-comment.entity";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {TranslatorService} from "../../../services/translator.service";
import {TitleService} from "../../../services/title.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {toPromise} from "../../../helper/resolvable";
import {defaultDetailDeleteCallback, defaultSaveCallback} from "../../../helper/default-implementations";
import {IgnoredPost, IgnoredPostRepository} from "../../../entity/ignored-post.entity";
import {LoaderComponent} from "../../../root/components/loader/loader.component";
import {TranslocoMarkupComponent} from "ngx-transloco-markup";
import {TranslocoPipe} from "@jsverse/transloco";

@Component({
  selector: 'app-ignored-posts-detail',
  standalone: true,
  imports: [
    LoaderComponent,
    ReactiveFormsModule,
    TranslocoMarkupComponent,
    TranslocoPipe
  ],
  templateUrl: './ignored-posts-detail.component.html',
  styleUrl: './ignored-posts-detail.component.scss'
})
export class IgnoredPostsDetailComponent implements OnInit {
  private item = signal<IgnoredPost | null>(null);

  protected itemId = signal(0);
  protected loading = signal(true);

  protected form = new FormGroup({
    postId: new FormControl<number | null>(null, [Validators.required]),
  });

  constructor(
    private readonly translator: TranslatorService,
    private readonly titleService: TitleService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly repository: IgnoredPostRepository,
    private readonly toastr: ToastrService,
    private readonly router: Router,
  ) {
  }

  public async ngOnInit(): Promise<void> {
    this.activatedRoute.params.subscribe(async params => {
      this.itemId.set(Number(params['id'] as string | undefined ?? null));

      if (this.itemId()) {
        this.titleService.title.set(await toPromise(this.translator.get('app.ignored_posts.edit.title', {id: this.itemId()})));
        const item = await toPromise(this.repository.get(this.itemId()));
        this.form.patchValue(item.attributes);
        this.item.set(item);
      } else {
        this.titleService.title.set(await toPromise(this.translator.get('app.ignored_posts.add.title')));
        this.item.set(new IgnoredPost(false))
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
          postId: form.value.postId!,
        };
      },
      !this.itemId(),
      this.repository,
      this.item,
      this.router,
      `/ignored-posts/detail/%id%`,
    )();
  }

  public async removeItem(): Promise<void> {
    await defaultDetailDeleteCallback(
      this.loading,
      this.repository,
      this.item,
      this.router,
      '/ignored-posts',
      this.toastr,
      this.translator,
    )();
  }
}
