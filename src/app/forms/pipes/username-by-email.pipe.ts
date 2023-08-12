import { Pipe, PipeTransform } from '@angular/core';
import { ObservationsService } from '../services/observations.service';

@Pipe({
  name: 'userNameByEmail'
})
export class UserNameByEmailPipe implements PipeTransform {
  constructor(private observations: ObservationsService) {}

  transform(email: string): string {
    let plainEmail = '';
    if (email?.endsWith(',')) {
      plainEmail = email?.slice(0, -1);
    }
    if (this.isEmail(plainEmail)) {
      return this.observations.formatUserFullNameDisplay(plainEmail) ?? '';
    }
    return plainEmail ?? '';
  }

  private isEmail(email): boolean {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  }
}
