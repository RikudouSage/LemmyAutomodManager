import {Component, OnInit} from '@angular/core';
import {TitleService} from "../../../services/title.service";
import {environment} from "../../../../environments/environment";
import {TranslocoMarkupComponent} from "ngx-transloco-markup";

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [
    TranslocoMarkupComponent
  ],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent implements OnInit {
  constructor(
    private readonly titleService: TitleService,
  ) {
  }

  public async ngOnInit(): Promise<void> {
    this.titleService.title.set(environment.appTitle);
  }
}
