import {
  Component,
  computed,
  effect,
  EventEmitter,
  forwardRef,
  input,
  Input,
  OnInit,
  output,
  Output,
  signal
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {AsyncPipe} from "@angular/common";
import {Observable} from "rxjs";
import {ToObservablePipe} from "../../../pipes/to-observable.pipe";
import {OnChange, OnTouched} from "../../../helper/form-types";
import {Resolvable} from "../../../helper/resolvable";

export enum Color {
  Success,
  Danger,
  Warning,
  Primary,
  Info,
  Secondary,
}

@Component({
  selector: 'app-checkbox',
  standalone: true,
  imports: [
    ToObservablePipe,
    AsyncPipe
  ],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss',
  providers: [
    {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => CheckboxComponent), multi: true},
  ]
})
export class CheckboxComponent implements ControlValueAccessor, OnInit {
  protected readonly Color = Color;
  protected value = signal(false);

  private changedEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();

  private onChange: OnChange<boolean> | null = null;
  private onTouched: OnTouched | null = null;

  public onColor = input<Color | null>(null);
  public offColor = input<Color | null>(null);
  public label = input('');
  public disabled = input(false);

  protected disabledOverride = signal<boolean | null>(null);
  protected isDisabled = computed(() => {
    if (this.disabledOverride() !== null) {
      return this.disabledOverride()!;
    }

    return this.disabled();
  })

  public valueChanged = output<boolean>();

  public controlId = `checkbox${Math.random()}`;

  constructor() {
    effect(() => {
      const value = this.value();
      if (this.onChange !== null) {
        this.onChange(value);
      }
      if (this.onTouched !== null) {
        this.onTouched();
      }
      this.changedEmitter.next(value);
    });
  }

  public ngOnInit(): void {
  }

  public writeValue(value: boolean): void {
    this.value.set(value);
  }

  public registerOnChange(fn: OnChange<boolean>): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: OnTouched): void {
    this.onTouched = fn;
  }

  public setDisabledState(disabled: boolean): void {
    this.disabledOverride.set(disabled);
  }
}
