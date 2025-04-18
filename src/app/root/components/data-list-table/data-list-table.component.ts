import {Component, computed, effect, input, OnInit, output, Signal, signal} from '@angular/core';
import {AbstractRepository} from "../../../services/json-api/abstract.repository";
import {AbstractEntity} from "../../../services/json-api/abstract.entity";
import {toPromise} from "../../../helper/resolvable";
import {debounceTime, Subscription, tap} from "rxjs";
import {map} from "rxjs/operators";
import {LoaderComponent} from "../loader/loader.component";
import {TranslatorService} from "../../../services/translator.service";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {DisplayDatabaseValuePipe} from "../../../pipes/display-database-value.pipe";
import {TranslocoPipe} from "@jsverse/transloco";
import {GetTypeofPipe} from "../../../pipes/get-typeof.pipe";
import {FilterType, FilterTypes} from "./filter-types.data-list-table";
import {JsonPipe, KeyValuePipe} from "@angular/common";
import {DataListTableFilterFieldComponent} from "./filter-field/data-list-table-filter-field.component";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {nonEmptyObject, shallowEqual} from "../../../helper/object.helper";
import {NewVersionCheckerService} from "../../../services/new-version-checker.service";
import {Feature, IsFeatureAvailable} from "../../../helper/feature-map";

export type DeleteCallback<T extends AbstractEntity> = (item: T) => Promise<boolean>;

@Component({
  selector: 'app-data-list-table',
  standalone: true,
  imports: [
    LoaderComponent,
    RouterLink,
    DisplayDatabaseValuePipe,
    TranslocoPipe,
    GetTypeofPipe,
    KeyValuePipe,
    DataListTableFilterFieldComponent,
    ReactiveFormsModule,
    JsonPipe
  ],
  templateUrl: './data-list-table.component.html',
  styleUrl: './data-list-table.component.scss'
})
export class DataListTableComponent implements OnInit {
  private readonly perPage = 30;
  private readonly paginationSpaceAround = 2;

  private cachedHeaders: string[] | null = null;
  private defaultColumnNames = signal<Record<string, string>>({});
  protected allColumnNames: Signal<Record<string, string | undefined>> = computed(() => ({...this.defaultColumnNames(), ...this.columnNames()}));
  private defaultFilters = signal<Record<string, FilterType>>({});
  protected allFilters = computed(() => ({...this.defaultFilters(), ...this.filters()}));

  public repository = input.required<AbstractRepository<AbstractEntity>>();
  public identifierField = input.required<string>();
  public detailUrl = input.required<string>();
  public hiddenColumns = input<string[]>([]);
  public columnNames = input<Record<string, string>>({});
  public deleteCallback = input<DeleteCallback<AbstractEntity> | null>(null);
  public filters = input<Record<string, FilterType>>({});
  public filtersAvailable = signal(false);

  public loadingChanged = output<boolean>();
  public totalCountResolved = output<number>();

  protected loading = signal(true);
  protected items = signal<AbstractEntity[]>([]);
  protected totalCount = signal(0);
  protected lastPage = computed(() => Math.ceil(this.totalCount() / this.perPage))
  protected currentPage = signal(1);
  protected prevPageAvailable = computed(() => this.currentPage() > 1);
  protected nextPageAvailable = computed(() => this.currentPage() < this.lastPage());
  protected apiFilters = signal<Record<string, unknown>>({});
  protected normalizedApiFilters = computed(() => {
    const result: Record<string, string> = {};
    for (const [key, value] of Object.entries(this.apiFilters())) {
      if (typeof value === 'string') {
        result[key] = `~${value}`;
      } else if (typeof value === 'boolean') {
        result[key] = value ? 'true' : 'false';
      } else if (typeof value === 'number') {
        result[key] = String(value);
      }
    }
    return result;
  });

  protected filterForm: FormGroup<Record<string, FormControl>> = new FormGroup({});

  public currentUrl = signal<string>('');
  public previousPageHref = computed(() => {
    if (this.currentPage() - 1 < 1) {
      return `${this.currentUrl()}?perPage=${this.perPage}&page=${this.currentPage()}`;
    }

    return `${this.currentUrl()}?perPage=${this.perPage}&page=${this.currentPage() - 1}`;
  });
  public nextPageHref = computed(() => {
    if (this.currentPage() + 1 > this.lastPage()) {
      return `${this.currentUrl()}?perPage=${this.perPage}&page=${this.currentPage()}`;
    }

    return `${this.currentUrl()}?perPage=${this.perPage}&page=${this.currentPage() + 1}`;
  });

  protected pages = computed((): Array<'...' | number> => {
    const result= [1];

    for (let i = -this.paginationSpaceAround; i < 0; ++i) {
      const page = this.currentPage() + i;
      if (page < 1 || page >= this.lastPage()) {
        continue;
      }
      result.push(this.currentPage() + i);
    }
    for (let i = 0; i <= this.paginationSpaceAround; ++i) {
      const page = this.currentPage() + i;
      if (page < 1 || page >= this.lastPage()) {
        continue;
      }
      result.push(this.currentPage() + i);
    }
    result.push(this.lastPage());
    const unique = [...new Set(result)];

    const finalResult: Array<'...' | number> = [];
    let previous: number | null = null;
    for (const page of unique) {
      if (previous === null || previous + 1 === page) {
        previous = page;
      } else {
        finalResult.push('...');
        previous = null;
      }

      finalResult.push(page);
    }

    return finalResult;
  });
  public renderPageHrefs = computed((): string[] => {
    return this.pages().map(page => {
      if (Number(page) < 1 || Number(page) > this.lastPage()) {
        return this.currentUrl();
      }

      return `${this.currentUrl()}?perPage=${this.perPage}&page=${page}`;
    });
  });
  protected headers = computed(() => {
    if (this.cachedHeaders !== null) {
      return this.cachedHeaders;
    }

    const result: string[] = [];

    if (!this.items().length) {
      return result;
    }

    result.push('id');
    result.push(...Object.keys(this.items()[0].attributes));

    this.cachedHeaders = result;
    return result;
  });

  constructor(
    private readonly translator: TranslatorService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly currentVersionChecker: NewVersionCheckerService,
  ) {
    effect(() => {
      this.loadingChanged.emit(this.loading());
    });
    effect(() => {
      this.totalCountResolved.emit(this.totalCount());
    });

    const urlTree = router.parseUrl(router.url);
    this.currentUrl.set(`/${urlTree.root.children['primary']?.segments.map(segment => segment.path).join('/')}`);
  }

  public async ngOnInit(): Promise<void> {
    this.filtersAvailable.set(IsFeatureAvailable(Feature.Filters, await this.currentVersionChecker.getCurrentApiVersion()));

    const defaultColumnNames = {
      id: 'app.column.id',
      regex: 'app.column.regex',
      reason: 'app.column.reason',
      enabled: 'app.column.enabled',
      removeAll: 'app.column.remove_all',
    };
    const defaultFilters: Record<keyof typeof defaultColumnNames, FilterType> = {
      id: FilterTypes.Number,
      regex: FilterTypes.String,
      reason: FilterTypes.String,
      enabled: FilterTypes.Boolean,
      removeAll: FilterTypes.Boolean,
    };

    for (const columnName of Object.keys(defaultColumnNames) as (keyof typeof defaultColumnNames)[]) {
      defaultColumnNames[columnName] = await toPromise(this.translator.get(defaultColumnNames[columnName]));
    }
    this.defaultColumnNames.set(defaultColumnNames);
    this.defaultFilters.set(defaultFilters);

    this.activatedRoute.queryParams.subscribe(async query => {
      this.loading.set(true);

      this.currentPage.set(Number(query['page'] ?? 1));
      await this.loadCurrentPage();

      this.loading.set(false);
    });
  }

  public async deleteItem(itemToDelete: AbstractEntity): Promise<void> {
    const callback = this.deleteCallback()!;
    if (await callback(itemToDelete)) {
      this.items.update(items => items.filter(item => item.id !== itemToDelete.id));
    }
  }

  public async navigateToPage(page: number, event: MouseEvent): Promise<void> {
    event.preventDefault();

    if (page === this.currentPage()) {
      return;
    }
    if (page < 1) {
      return;
    }
    if (page > this.lastPage()) {
      return;
    }

    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('page', String(page));

    const queryParams: {[key: string]: string} = {};
    searchParams.forEach((value, name) => {
      queryParams[name] = value;
    });

    await this.router.navigate(['.'], {
      relativeTo: this.activatedRoute,
      queryParams: queryParams,
      queryParamsHandling: 'merge',
    });
  }

  private async loadCurrentPage(): Promise<void> {
    this.items.set(await toPromise(
      this.repository().collection({
        page: this.currentPage(),
        maxResults: this.perPage,
        filters: this.filtersAvailable() ? this.normalizedApiFilters() : {},
      }).pipe(
        tap(collection => this.totalCount.set(collection.totalItems)),
        map(collection => collection.toArray()),
      )
    ));

    if (Object.keys(this.filterForm.controls).length === 0) {
      this.filterForm = new FormGroup({});
      for (const header of this.headers()) {
        const filter = this.allFilters()[header] ?? null;
        if (filter === null) {
          continue;
        }

        this.filterForm.addControl(header, new FormControl(null));
      }
      this.filterForm.valueChanges.pipe(
        debounceTime(300),
      ).subscribe(value => {
        if (typeof window === 'undefined') {
          return;
        }
        const filter = nonEmptyObject(value);
        if (shallowEqual(filter, this.apiFilters())) {
          return;
        }
        this.apiFilters.set(filter);

        if (this.currentPage() !== 1) {
          this.navigateToPage(1, new MouseEvent('click'));
        } else {
          this.loadCurrentPage().then(() => {
            this.loading.set(false);
          });
        }
      });
    }
  }
}
