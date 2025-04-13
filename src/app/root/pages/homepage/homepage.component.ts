import {Component, OnInit, signal} from '@angular/core';
import {TitleService} from "../../../services/title.service";
import {environment} from "../../../../environments/environment";
import {TranslocoMarkupComponent} from "ngx-transloco-markup";
import {Stats, StatsService} from "../../../services/stats.service";
import {TranslocoPipe} from "@jsverse/transloco";
import {LoaderComponent} from "../../components/loader/loader.component";
import {FormatNumberPipe} from "../../../pipes/format-number.pipe";
import {YesNoComponent} from "../../components/yes-no/yes-no.component";

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [
    TranslocoMarkupComponent,
    TranslocoPipe,
    LoaderComponent,
    FormatNumberPipe,
    YesNoComponent
  ],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent implements OnInit {
  public stats = signal<Stats | null>(null);

  constructor(
    private readonly titleService: TitleService,
    private readonly statsService: StatsService,
  ) {
  }

  public async ngOnInit(): Promise<void> {
    this.titleService.title.set(environment.appTitle);
    this.stats.set(await this.statsService.getStats());
  }
}
