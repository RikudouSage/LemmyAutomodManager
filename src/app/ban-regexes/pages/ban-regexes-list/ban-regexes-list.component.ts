import {Component, OnInit, signal} from '@angular/core';
import {TranslatorService} from "../../../services/translator.service";
import {TitleService} from "../../../services/title.service";
import {toPromise} from "../../../helper/resolvable";
import {TranslocoPipe} from "@jsverse/transloco";
import {TranslocoMarkupComponent} from "ngx-transloco-markup";
import {DataListTableComponent} from "../../../root/components/data-list-table/data-list-table.component";
import {InstanceBanRegexRepository} from "../../../entity/instance-ban-regex.entity";
import {FormatNumberPipe} from "../../../pipes/format-number.pipe";
import {RouterLink} from "@angular/router";

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
  public totalCount = signal(0);

  constructor(
    private readonly translator: TranslatorService,
    private readonly titleService: TitleService,
    public readonly repository: InstanceBanRegexRepository,
  ) {
  }

  public async ngOnInit(): Promise<void> {
    this.titleService.title.set(await toPromise(this.translator.get('app.ban_regexes.name')));
  }
}
