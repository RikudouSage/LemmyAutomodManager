import {Component, OnInit, signal} from '@angular/core';
import {TranslatorService} from "../../../services/translator.service";
import {TitleService} from "../../../services/title.service";
import {toPromise} from "../../../helper/resolvable";
import {TranslocoPipe} from "@jsverse/transloco";
import {TranslocoMarkupComponent} from "ngx-transloco-markup";
import {
  DataListTableComponent,
  DeleteCallback
} from "../../../root/components/data-list-table/data-list-table.component";
import {InstanceBanRegex, InstanceBanRegexRepository} from "../../../entity/instance-ban-regex.entity";
import {FormatNumberPipe} from "../../../pipes/format-number.pipe";
import {RouterLink} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {AbstractEntity} from "../../../services/json-api/abstract.entity";

@Component({
  selector: 'app-ban-regexes-list',
  standalone: true,
  imports: [
    TranslocoPipe,
    TranslocoMarkupComponent,
    DataListTableComponent,
    FormatNumberPipe,
    RouterLink
  ],
  templateUrl: './ban-regexes-list.component.html',
  styleUrl: './ban-regexes-list.component.scss'
})
export class BanRegexesListComponent implements OnInit {
  protected deleteItemCallback = signal(async (item: AbstractEntity): Promise<boolean> => {
    try {
      await toPromise(this.repository.delete(item as InstanceBanRegex));
      this.toastr.success(
        await toPromise(this.translator.get('app.success.item_removed')),
        await toPromise(this.translator.get('app.success')),
      );
      return true;
    } catch (e) {
      this.toastr.error(
        await toPromise(this.translator.get('app.error.failed_removing')),
        await toPromise(this.translator.get('app.error')),
      );
      return false;
    }
  });
  protected totalCount = signal(0);

  constructor(
    private readonly translator: TranslatorService,
    private readonly titleService: TitleService,
    public readonly repository: InstanceBanRegexRepository,
    private readonly toastr: ToastrService,
  ) {
  }

  public async ngOnInit(): Promise<void> {
    this.titleService.title.set(await toPromise(this.translator.get('app.ban_regexes.name')));
  }
}
