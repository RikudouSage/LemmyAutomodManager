import {Component, input} from '@angular/core';
import {TranslocoPipe} from "@jsverse/transloco";

@Component({
  selector: 'app-yes-no',
  standalone: true,
  imports: [
    TranslocoPipe
  ],
  templateUrl: './yes-no.component.html',
  styleUrl: './yes-no.component.scss'
})
export class YesNoComponent {
  public value = input.required<boolean>();
}
