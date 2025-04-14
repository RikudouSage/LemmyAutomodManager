import {Component, input} from '@angular/core';
import {RouterLink} from "@angular/router";
import {TranslocoPipe} from "@jsverse/transloco";

@Component({
  selector: 'app-nav-item',
  standalone: true,
  imports: [
    RouterLink,
    TranslocoPipe
  ],
  templateUrl: './nav-item.component.html',
  styleUrl: './nav-item.component.scss'
})
export class NavItemComponent {
  public link = input.required<string>();
  public icon = input.required<string>();
  public title = input.required<string>();
}
