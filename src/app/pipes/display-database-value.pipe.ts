import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'displayDatabaseValue',
  standalone: true
})
export class DisplayDatabaseValuePipe implements PipeTransform {

  public transform(value: unknown): string {
    let result: string = '';

    if (typeof value === 'string') {
      result = value;
    }
    if (typeof value === 'number' || typeof value === 'bigint') {
      result = String(value);
    }
    if (typeof value === 'boolean') {
      result = value ? 'true' : 'false';
    }
    if (typeof value === 'undefined' || value === null) {
      result = 'null';
    }
    if (typeof value === 'object') {
      result = JSON.stringify(value);
    }

    return result.replace(/\s+/g, ' ');
  }

}
