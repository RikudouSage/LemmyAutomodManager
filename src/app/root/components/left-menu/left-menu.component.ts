import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";
import {TranslocoPipe} from "@jsverse/transloco";
import {NavItemComponent} from "../nav-item/nav-item.component";

@Component({
  selector: 'app-left-menu',
  standalone: true,
  imports: [
    RouterLink,
    TranslocoPipe,
    NavItemComponent
  ],
  templateUrl: './left-menu.component.html',
  styleUrl: './left-menu.component.scss'
})
export class LeftMenuComponent {

}
