import {Injectable} from '@angular/core';

interface CurrencyResponse {
  currency: string;
}

interface KeyValueStore {
  [key: string]: string;
}

@Injectable({
  providedIn: 'root',
})
export class IntlService {
  public formatDate(value: string, locale: string | null = null): string {
    return new Intl.DateTimeFormat(locale ?? undefined, {
      dateStyle: 'medium',
    }).format(new Date(value));
  }

  public formatDatetime(value: string | Date, locale: string | null = null): string {
    return new Intl.DateTimeFormat(locale ?? undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value));
  }

  public formatNumber(value: string | number, digits: number | null = null, locale: string | null = null): string {
    return new Intl.NumberFormat(locale ?? undefined, {
      minimumFractionDigits: digits ?? undefined,
      maximumFractionDigits: digits ?? undefined,
    }).format(Number(value));
  }

  public formatPercentage(value: string | number, digits: number | null = null, locale: string | null = null): string {
    return new Intl.NumberFormat(locale ?? undefined, {
      minimumFractionDigits: digits ?? undefined,
      maximumFractionDigits: digits ?? undefined,
      style: 'percent',
    }).format(Number(value));
  }
}
