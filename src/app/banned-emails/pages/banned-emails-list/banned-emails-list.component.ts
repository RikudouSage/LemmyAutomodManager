import {Component, OnInit, signal, WritableSignal} from '@angular/core';
import {TranslatorService} from "../../../services/translator.service";
import {TitleService} from "../../../services/title.service";
import {InstanceBanRegex, InstanceBanRegexRepository} from "../../../entity/instance-ban-regex.entity";
import {ToastrService} from "ngx-toastr";
import {toPromise} from "../../../helper/resolvable";
import {BannedEmail, BannedEmailRepository} from "../../../entity/banned-email.entity";
import {AbstractEntity} from "../../../services/json-api/abstract.entity";
import {defaultDeleteCallback} from "../../../helper/default-implementations";
import {
  DataListTableComponent,
  DeleteCallback
} from "../../../root/components/data-list-table/data-list-table.component";
import {FormatNumberPipe} from "../../../pipes/format-number.pipe";
import {RouterLink} from "@angular/router";
import {TranslocoMarkupComponent} from "ngx-transloco-markup";
import {TranslocoPipe} from "@jsverse/transloco";

@Component({
  selector: 'app-banned-emails-list',
  standalone: true,
  imports: [
    DataListTableComponent,
    FormatNumberPipe,
    RouterLink,
    TranslocoMarkupComponent,
    TranslocoPipe
  ],
  templateUrl: './banned-emails-list.component.html',
  styleUrl: './banned-emails-list.component.scss'
})
export class BannedEmailsListComponent implements OnInit {
  protected deleteItemCallback: WritableSignal<DeleteCallback<AbstractEntity>>;
  protected totalCount = signal(0);

  constructor(
    private readonly translator: TranslatorService,
    private readonly titleService: TitleService,
    public readonly repository: BannedEmailRepository,
    toastr: ToastrService,
  ) {
    this.deleteItemCallback = signal(defaultDeleteCallback(this.repository, toastr, this.translator));
  }

  public async ngOnInit(): Promise<void> {
    this.titleService.title.set(await toPromise(this.translator.get('app.banned_emails.name')));
  }
}
