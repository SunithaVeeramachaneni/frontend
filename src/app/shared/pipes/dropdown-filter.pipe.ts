import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dropdownFilter'
})
export class DropDownFilterPipe implements PipeTransform {
  transform(list: any[], value: string) {
    return value ? list.filter(item => item.CreatedBy === value) : list;
  }
}
