import {Component, OnInit} from '@angular/core';
import {TranslatorService} from "../../../services/translator.service";
import {TitleService} from "../../../services/title.service";
import {toPromise} from "../../../helper/resolvable";
import {TranslocoPipe} from "@jsverse/transloco";
import {TranslocoMarkupComponent} from "ngx-transloco-markup";

@Component({
  selector: 'app-ban-regexes-list',
  standalone: true,
  imports: [
    TranslocoPipe,
    TranslocoMarkupComponent
  ],
  templateUrl: './ban-regexes-list.component.html',
  styleUrl: './ban-regexes-list.component.scss'
})
export class BanRegexesListComponent implements OnInit {
  constructor(
    private readonly translator: TranslatorService,
    private readonly titleService: TitleService,
  ) {
  }

  public async ngOnInit(): Promise<void> {
    this.titleService.title.set(await toPromise(this.translator.get('app.ban_regexes.name')));
  }
}
