import { Component } from '@angular/core';
import {TranslocoPipe} from "@jsverse/transloco";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-top-menu',
  standalone: true,
  imports: [
    TranslocoPipe,
    RouterLink
  ],
  templateUrl: './top-menu.component.html',
  styleUrl: './top-menu.component.scss'
})
export class TopMenuComponent {

}
