import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getTypeof',
  standalone: true
})
export class GetTypeofPipe implements PipeTransform {

  public transform(value: unknown): string {
    return typeof value;
  }

}
