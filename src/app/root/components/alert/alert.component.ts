import {Component, input, signal} from '@angular/core';

export enum AlertType {
  Info,
  Success,
  Error,
  Warning,
}

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss'
})
export class AlertComponent {
  protected readonly AlertType = AlertType;

  public title = input.required<string>();
  public type = input.required<AlertType>();

  protected deleted = signal(false);
}
