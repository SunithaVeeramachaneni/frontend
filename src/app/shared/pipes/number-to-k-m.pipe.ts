import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberToKM'
})
export class NumberToKMPipe implements PipeTransform {
  transform(value: number): string | number {
    if (value > 999 && value < 1000000) {
      return Math.floor(value / 1000) + 'k+'; // convert to K for number from > 1000 < 1 million
    } else if (value >= 1000000) {
      return Math.floor(value / 1000000) + 'm+'; // convert to M for number from >= 1 million
    }
    return value;
  }
}
