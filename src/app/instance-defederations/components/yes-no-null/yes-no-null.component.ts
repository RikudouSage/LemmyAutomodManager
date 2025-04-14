import {Component, effect, forwardRef, input, signal} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {OnChange, OnTouched} from "../../../helper/form-types";
import {TranslocoPipe} from "@jsverse/transloco";

@Component({
  selector: 'app-yes-no-null',
  standalone: true,
  imports: [
    TranslocoPipe
  ],
  templateUrl: './yes-no-null.component.html',
  styleUrl: './yes-no-null.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => YesNoNullComponent),
      multi: true,
    },
  ],
})
export class YesNoNullComponent implements ControlValueAccessor {
  public label = input.required<string>();

  protected value = signal<boolean | null>(null);
  protected disabled = signal(false);

  protected onTouched = signal<OnTouched | null>(null);
  protected onChange = signal<OnChange<boolean | null> | null>(null);

  protected controlId = signal(`yes-no-null-${Math.random()}`)

  constructor() {
    effect(() => {
      const value = this.value();

      if (this.onTouched()) {
        this.onTouched()!();
      }
      if (this.onChange()) {
        this.onChange()!(value);
      }
    });
  }

  public writeValue(value: boolean | null): void {
    this.value.set(value);
  }

  public registerOnChange(fn: OnChange<boolean | null>): void {
    this.onChange.set(fn);
  }

  public registerOnTouched(fn: OnTouched): void {
    this.onTouched.set(fn);
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  protected setControlValue(event: Event): void {
    const rawValue = (<HTMLSelectElement>event.target).value;

    let value: boolean | null;
    switch (rawValue) {
      case 'true':
        value = true;
        break;
      case 'false':
        value = false;
        break;
      case 'null':
        value = null;
        break;
      default:
        throw new Error(`Unexpected value: ${rawValue}`);
    }

    this.value.set(value);
  }
}
