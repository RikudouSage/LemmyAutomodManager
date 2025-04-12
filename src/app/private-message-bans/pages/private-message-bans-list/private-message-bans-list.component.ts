import {Component, OnInit, signal, WritableSignal} from '@angular/core';
import {
  DataListTableComponent,
  DeleteCallback
} from "../../../root/components/data-list-table/data-list-table.component";
import {AbstractEntity} from "../../../services/json-api/abstract.entity";
import {TranslatorService} from "../../../services/translator.service";
import {TitleService} from "../../../services/title.service";
import {BannedEmailRepository} from "../../../entity/banned-email.entity";
import {ToastrService} from "ngx-toastr";
import {defaultDeleteCallback} from "../../../helper/default-implementations";
import {toPromise} from "../../../helper/resolvable";
import {PrivateMessageBanRegexRepository} from "../../../entity/private-message-ban-regex.entity";
import {FormatNumberPipe} from "../../../pipes/format-number.pipe";
import {RouterLink} from "@angular/router";
import {TranslocoMarkupComponent} from "ngx-transloco-markup";
import {TranslocoPipe} from "@jsverse/transloco";

@Component({
  selector: 'app-private-message-bans-list',
  standalone: true,
  imports: [
    DataListTableComponent,
    FormatNumberPipe,
    RouterLink,
    TranslocoMarkupComponent,
    TranslocoPipe
  ],
  templateUrl: './private-message-bans-list.component.html',
  styleUrl: './private-message-bans-list.component.scss'
})
export class PrivateMessageBansListComponent implements OnInit {
  protected deleteItemCallback: WritableSignal<DeleteCallback<AbstractEntity>>;
  protected totalCount = signal(0);

  constructor(
    private readonly translator: TranslatorService,
    private readonly titleService: TitleService,
    public readonly repository: PrivateMessageBanRegexRepository,
    toastr: ToastrService,
  ) {
    this.deleteItemCallback = signal(defaultDeleteCallback(this.repository, toastr, this.translator));
  }

  public async ngOnInit(): Promise<void> {
    this.titleService.title.set(await toPromise(this.translator.get('app.banned_emails.name')));
  }
}
