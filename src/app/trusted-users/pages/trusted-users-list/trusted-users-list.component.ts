import {Component, OnInit, signal, WritableSignal} from '@angular/core';
import {
  DataListTableComponent,
  DeleteCallback
} from "../../../root/components/data-list-table/data-list-table.component";
import {AbstractEntity} from "../../../services/json-api/abstract.entity";
import {TranslatorService} from "../../../services/translator.service";
import {TitleService} from "../../../services/title.service";
import {WatchedUserRepository} from "../../../entity/watched-user.entity";
import {ToastrService} from "ngx-toastr";
import {defaultDeleteCallback} from "../../../helper/default-implementations";
import {toPromise} from "../../../helper/resolvable";
import {TrustedUserRepository} from "../../../entity/trusted-user.entity";
import {FormatNumberPipe} from "../../../pipes/format-number.pipe";
import {RouterLink} from "@angular/router";
import {TranslocoMarkupComponent} from "ngx-transloco-markup";
import {TranslocoPipe} from "@jsverse/transloco";
import {FilterTypes} from "../../../root/components/data-list-table/filter-types.data-list-table";

@Component({
  selector: 'app-trusted-users-list',
  standalone: true,
  imports: [
    DataListTableComponent,
    FormatNumberPipe,
    RouterLink,
    TranslocoMarkupComponent,
    TranslocoPipe
  ],
  templateUrl: './trusted-users-list.component.html',
  styleUrl: './trusted-users-list.component.scss'
})
export class TrustedUsersListComponent implements OnInit {
  protected readonly FilterTypes = FilterTypes;

  protected deleteItemCallback: WritableSignal<DeleteCallback<AbstractEntity>>;
  protected totalCount = signal(0);

  constructor(
    private readonly translator: TranslatorService,
    private readonly titleService: TitleService,
    public readonly repository: TrustedUserRepository,
    toastr: ToastrService,
  ) {
    this.deleteItemCallback = signal(defaultDeleteCallback(this.repository, toastr, this.translator));
  }

  public async ngOnInit(): Promise<void> {
    this.titleService.title.set(await toPromise(this.translator.get('app.trusted_users.name')));
  }
}
