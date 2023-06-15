import { Pipe, PipeTransform } from '@angular/core';
import { ObservationsService } from '../services/observations.service';

@Pipe({
  name: 'userNameByEmail'
})
export class UserNameByEmailPipe implements PipeTransform {
  constructor(private observations: ObservationsService) {}
  transform(email: string): string {
    return this.observations.formatUserFullNameDisplay(email) ?? '';
  }
}
