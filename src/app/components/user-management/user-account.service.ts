import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from './user';
import { of } from 'rxjs';
import { InstructionService } from '../workinstructions/instruction.service';
import { ErrorInfo } from '../../interfaces/error-info';

@Injectable({ providedIn: 'root'})
export class UserAccountService {
  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;

  constructor(private router: Router,
              private instructionService: InstructionService) {}

  public get userValue(): User | null {
    return this.userSubject ? this.userSubject.value : null;
  }

  login(email, password, info: ErrorInfo = {} as ErrorInfo) {
    return this.instructionService.getUsersByEmail(email, info).pipe(
      map((res: User[]) => {
        this.userSubject = new BehaviorSubject<User>(res[0]);
        return res;
      })
    );
  }

  register(userFormData, info: ErrorInfo = {} as ErrorInfo) {
    const user = {
      "empId": userFormData.empId,
      "email": userFormData.email,
      "first_name": userFormData.firstname,
      "last_name": userFormData.lastname,
      "password": userFormData.empId + userFormData.firstname.substring(0, 3).toLowerCase(),
      "role": "user"
    };
    return this.instructionService.addUser(user, info);
  }

  sendApproveMail = (userDetail, info: ErrorInfo = {} as ErrorInfo) => {
     const mailOptions = {
      "to": userDetail.email,
      "from": "info@innovapptive.com",
      "subject": 'Work Instructions Access Request - Approved | ' + userDetail.firstname + " "  + userDetail.lastname,
      "text": "Hello",
      "html": "<h3> Hey " + userDetail.firstname + ", </h3></br>" +
        "<h2> Welcome to WorkInstructions!</h2></br>" +
        "<p> Here is the information to access WorkInstructions</p></br>" +
        "<p> Username: " +  "<b>" +  "Your registered Email" + "</b>" + "</p></br>" +
        "<p>Password: " + "Combination of " + "<b>" + "Employee Id " + "</b>"  + "and " + "<b>" + "first 3 characters of the first name" + "</b>" + "</p></br>" +
        "<p>" +  "Ex: If Employee ID is ‘51001234’ and First Name is ‘John’ then Password must be ‘51001234joh’" + "</p></br>"
    };
    return this.instructionService.sendApprovalEmail(mailOptions, info);
  }


  logout() {
      localStorage.removeItem('loggedInUser');
      if (this.userSubject) {
        this.userSubject.next(null);
      }
      this.router.navigate(['/signin']);
  }
}
