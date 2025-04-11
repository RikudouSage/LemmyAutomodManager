import {Pipe, PipeTransform} from '@angular/core';
import {IntlService} from "../services/intl.service";

@Pipe({
  name: 'formatNumber',
  standalone: true,
})
export class FormatNumberPipe implements PipeTransform {
  constructor(private readonly intl: IntlService) {}

  transform(value: string | number, digits: number | null = null, locale: string | null = null): string {
    return this.intl.formatNumber(value, digits, locale);
  }
}
