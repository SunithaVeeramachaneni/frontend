import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'jsonparse'
})
export class JsonParsePipe implements PipeTransform {

  transform(value: string, ...args: any[]): any {
    try {
      return JSON.parse(value);
    }catch {
      return value;
    }
  }
}
