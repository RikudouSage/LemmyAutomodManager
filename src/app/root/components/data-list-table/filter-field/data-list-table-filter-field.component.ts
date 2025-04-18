import {Component, computed, effect, forwardRef, input, signal} from '@angular/core';
import {FilterType, FilterTypes} from "../filter-types.data-list-table";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {OnChange, OnTouched} from "../../../../helper/form-types";
import {TranslocoPipe} from "@jsverse/transloco";

@Component({
  selector: 'app-data-list-table-filter-field',
  standalone: true,
  imports: [
    TranslocoPipe
  ],
  templateUrl: './data-list-table-filter-field.component.html',
  styleUrl: './data-list-table-filter-field.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DataListTableFilterFieldComponent),
      multi: true,
    },
  ],
})
export class DataListTableFilterFieldComponent implements ControlValueAccessor {
  public type = input<FilterType>(FilterTypes.String);
  public label = input.required<string>();

  protected value = signal<unknown | null>(null);
  protected disabled = signal<boolean>(false);

  protected onTouched = signal<OnTouched | null>(null);
  protected onChange = signal<OnChange<unknown | null> | null>(null);

  protected isBoolean = computed(() => this.type().name === FilterTypes.Boolean.name);
  protected inputType = computed(() => {
    if (this.isBoolean()) {
      return '';
    }

    switch (this.type().name) {
      case FilterTypes.Number.name:
        return 'number';
      case FilterTypes.String.name:
        return 'text';
    }

    throw new Error(`Unknown filter type ${this.type().name}`);
  })

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

  public registerOnChange(fn: OnChange<unknown | null>): void {
    this.onChange.set(fn);
  }

  public registerOnTouched(fn: OnTouched): void {
    this.onTouched.set(fn);
  }

  public writeValue(value: unknown): void {
    this.value.set(value);
  }

  public setDisabledState(isDisabled: boolean) {
    this.disabled.set(isDisabled);
  }
}
