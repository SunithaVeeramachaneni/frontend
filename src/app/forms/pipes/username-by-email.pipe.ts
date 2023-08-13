import { Pipe, PipeTransform } from '@angular/core';
import { ObservationsService } from '../services/observations.service';

@Pipe({
  name: 'userNameByEmail'
})
export class UserNameByEmailPipe implements PipeTransform {
  constructor(private observations: ObservationsService) {}

  transform(email: string): string {
    if (email?.includes(',')) {
      return this.processEmails(email);
    }
    if (this.isEmail(email)) {
      return this.observations.formatUserFullNameDisplay(email) ?? '';
    }
    return email ?? '';
  }

  private processEmails(plainEmails): string {
    if (!plainEmails) {
      return '';
    }
    const formattedEmails = plainEmails
      .split(',')
      .map((email) =>
        this.isEmail(email)
          ? this.observations.formatUserFullNameDisplay(email) ?? ''
          : email
      )
      .filter(Boolean)
      .toString();
    return formattedEmails;
  }

  private isEmail(email): boolean {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  }
}
