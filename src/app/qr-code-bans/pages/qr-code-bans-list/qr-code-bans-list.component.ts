import {Component, OnInit, signal, WritableSignal} from '@angular/core';
import {
  DataListTableComponent,
  DeleteCallback
} from "../../../root/components/data-list-table/data-list-table.component";
import {AbstractEntity} from "../../../services/json-api/abstract.entity";
import {TranslatorService} from "../../../services/translator.service";
import {TitleService} from "../../../services/title.service";
import {PrivateMessageBanRegexRepository} from "../../../entity/private-message-ban-regex.entity";
import {ToastrService} from "ngx-toastr";
import {defaultDeleteCallback} from "../../../helper/default-implementations";
import {toPromise} from "../../../helper/resolvable";
import {BannedQrCodeRepository} from "../../../entity/banned-qr-code.entity";
import {CheckboxComponent} from "../../../root/components/checkbox/checkbox.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {LoaderComponent} from "../../../root/components/loader/loader.component";
import {TranslocoMarkupComponent} from "ngx-transloco-markup";
import {TranslocoPipe} from "@jsverse/transloco";
import {FormatNumberPipe} from "../../../pipes/format-number.pipe";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-qr-code-bans-list',
  standalone: true,
  imports: [
    CheckboxComponent,
    FormsModule,
    LoaderComponent,
    ReactiveFormsModule,
    TranslocoMarkupComponent,
    TranslocoPipe,
    DataListTableComponent,
    FormatNumberPipe,
    RouterLink
  ],
  templateUrl: './qr-code-bans-list.component.html',
  styleUrl: './qr-code-bans-list.component.scss'
})
export class QrCodeBansListComponent implements OnInit {
  protected deleteItemCallback: WritableSignal<DeleteCallback<AbstractEntity>>;
  protected totalCount = signal(0);

  constructor(
    private readonly translator: TranslatorService,
    private readonly titleService: TitleService,
    public readonly repository: BannedQrCodeRepository,
    toastr: ToastrService,
  ) {
    this.deleteItemCallback = signal(defaultDeleteCallback(this.repository, toastr, this.translator));
  }

  public async ngOnInit(): Promise<void> {
    this.titleService.title.set(await toPromise(this.translator.get('app.qr_code_bans.name')));
  }
}
