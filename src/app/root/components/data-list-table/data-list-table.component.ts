import {Component, computed, effect, input, OnInit, output, Signal, signal} from '@angular/core';
import {AbstractRepository} from "../../../services/json-api/abstract.repository";
import {AbstractEntity} from "../../../services/json-api/abstract.entity";
import {toPromise} from "../../../helper/resolvable";
import {tap} from "rxjs";
import {map} from "rxjs/operators";
import {LoaderComponent} from "../loader/loader.component";
import {TranslatorService} from "../../../services/translator.service";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {DisplayDatabaseValuePipe} from "../../../pipes/display-database-value.pipe";
import {TranslocoPipe} from "@jsverse/transloco";

export type DeleteCallback<T extends AbstractEntity> = (item: T) => Promise<boolean>;

@Component({
  selector: 'app-data-list-table',
  standalone: true,
  imports: [
    LoaderComponent,
    RouterLink,
    DisplayDatabaseValuePipe,
    TranslocoPipe
  ],
  templateUrl: './data-list-table.component.html',
  styleUrl: './data-list-table.component.scss'
})
export class DataListTableComponent implements OnInit {
  private readonly perPage = 30;

  private defaultColumnNames = signal<Record<string, string>>({});
  protected allColumnNames: Signal<Record<string, string | undefined>> = computed(() => ({...this.defaultColumnNames(), ...this.columnNames()}));

  public repository = input.required<AbstractRepository<AbstractEntity>>();
  public identifierField = input.required<string>();
  public detailUrl = input.required<string>();
  public hiddenColumns = input<string[]>([]);
  public columnNames = input<Record<string, string>>({});
  public deleteCallback = input<DeleteCallback<AbstractEntity> | null>(null);

  public loadingChanged = output<boolean>();
  public totalCountResolved = output<number>();

  protected loading = signal(true);
  protected items = signal<AbstractEntity[]>([]);
  protected totalCount = signal(0);
  protected maxPage = computed(() => Math.ceil(this.totalCount() / this.perPage))
  protected currentPage = signal(1);
  protected prevPageAvailable = computed(() => this.currentPage() > 1);
  protected nextPageAvailable = computed(() => this.currentPage() < this.maxPage());

  protected headers = computed(() => {
    const result: string[] = [];

    if (!this.items().length) {
      return result;
    }

    result.push('id');
    result.push(...Object.keys(this.items()[0].attributes));

    return result;
  });

  constructor(
    private readonly translator: TranslatorService,
    private readonly activatedRoute: ActivatedRoute,
  ) {
    effect(() => {
      this.loadingChanged.emit(this.loading());
    });
    effect(() => {
      this.totalCountResolved.emit(this.totalCount());
    });
  }

  public async ngOnInit(): Promise<void> {
    const defaultColumnNames = {
      id: 'app.column.id',
      regex: 'app.column.regex',
      reason: 'app.column.reason',
      enabled: 'app.column.enabled',
      removeAll: 'app.column.remove_all',
    };

    for (const columnName of Object.keys(defaultColumnNames) as (keyof typeof defaultColumnNames)[]) {
      defaultColumnNames[columnName] = await toPromise(this.translator.get(defaultColumnNames[columnName]));
    }
    this.defaultColumnNames.set(defaultColumnNames);

    this.activatedRoute.queryParams.subscribe(async query => {
      this.loading.set(true);

      this.currentPage.set(Number(query['page'] ?? 1));

      this.items.set(await toPromise(
        this.repository().collection({
          page: this.currentPage(),
          maxResults: this.perPage,
        }).pipe(
          tap(collection => this.totalCount.set(collection.totalItems)),
          map(collection => collection.toArray()),
        )
      ));

      this.loading.set(false);
    });
  }

  public async deleteItem(itemToDelete: AbstractEntity): Promise<void> {
    const callback = this.deleteCallback()!;
    if (await callback(itemToDelete)) {
      this.items.update(items => items.filter(item => item.id !== itemToDelete.id));
    }
  }
}
