/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable @angular-eslint/component-class-suffix */
import {
  Component,
  OnInit,
  Inject,
  ChangeDetectionStrategy,
  ElementRef,
  ViewChild,
  ChangeDetectorRef
} from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';
import { DatePipe, formatDate } from '@angular/common';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UsersService } from '../../user-management/services/users.service';
import { OperatorRoundsService } from '../services/operator-rounds.service';
import { LoginService } from '../../login/services/login.service';
import { DateUtilService } from 'src/app/shared/utils/dateUtils';
import { ErrorInfo } from 'src/app/interfaces';
import { ToastService } from 'src/app/shared/toast';

@Component({
  selector: 'app-email-dialog',
  templateUrl: './email-dialog.component.html',
  styleUrls: ['./email-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmailDialogComponent implements OnInit {
  @ViewChild('userInput') userInput: ElementRef;
  allUsers$: Observable<any>;

  emailNotes: '';
  allValidEmails = true;
  sendEmailInprogress = false;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = false;

  separatorKeysCodes = [ENTER, COMMA];

  userCtrl = new FormControl();

  filteredUsers: Observable<any[]>;

  users = [];
  selectedUsers = [];

  allUsers = [];
  ghostLoading = new Array(4).fill(0).map((v, i) => i);

  constructor(
    private dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    private cdrf: ChangeDetectorRef,
    private usersService: UsersService,
    private operatorRoundService: OperatorRoundsService,
    private loginService: LoginService,
    private readonly dateUtilService: DateUtilService,
    private toast: ToastService
  ) {
    this.allUsers$ = this.usersService
      .getUsers$({
        isActive: true,
        includeRoles: false
      })
      .pipe(
        map((resp) => {
          this.allUsers = resp.rows;
          this.cdrf.detectChanges();

          return resp.rows;
        })
      );
  }

  ngOnInit() {
    this.emailNotes = '';
    this.filteredUsers = this.userCtrl.valueChanges.pipe(
      startWith(null),
      map((user: string | null) =>
        user ? this.filter(user) : this.allUsers.slice()
      )
    );
  }

  sendEmail = async () => {
    this.sendEmailInprogress = true;
    let isValid = true;
    this.selectedUsers.forEach((email) => {
      const re = /\S+@\S+\.\S+/;
      isValid = isValid && re.test(email);
    });
    if (!isValid) {
      this.allValidEmails = isValid;
      this.cdrf.detectChanges();

      // TODO: Display toast message
      return;
    }
    this.cdrf.detectChanges();
    const toEmailIDs = this.selectedUsers.join(',');
    const emailNotes = this.emailNotes;
    const bodyFormData = new FormData();
    const { timePeriod, plantId, shiftId, startDate, endDate } =
      this.data.filters;
    bodyFormData.append('plantId', plantId);
    bodyFormData.append('shiftId', shiftId);
    bodyFormData.append('toEmailIDs', toEmailIDs);
    bodyFormData.append('notes', emailNotes);

    const userName = this.loginService.getLoggedInUserName();
    bodyFormData.append('userName', userName);
    let startDateTemp = startDate;
    let endDateTemp = endDate;
    const DATE_FORMAT = 'dd MMM yyyy';
    if (timePeriod !== 'custom') {
      const startEndDate = this.dateUtilService.getStartAndEndDates(
        timePeriod,
        startDateTemp,
        endDateTemp
      );
      startDateTemp = formatDate(
        new Date(startEndDate.startDate),
        DATE_FORMAT,
        'en-us'
      );
      endDateTemp = formatDate(
        new Date(startEndDate.endDate),
        DATE_FORMAT,
        'en-us'
      );
      bodyFormData.append('timePeriod', `${startDateTemp} - ${endDateTemp}`);
    } else {
      startDateTemp = formatDate(new Date(startDate), DATE_FORMAT, 'en-us');
      endDateTemp = formatDate(new Date(endDate), DATE_FORMAT, 'en-us');
      bodyFormData.append('timePeriod', `${startDate} - ${endDate}`);
    }
    const { widgetsData = [] } = this.data;
    for (let i = 0; i < widgetsData?.length; i++) {
      // const imgData: any = await this.getWidgetImage(this.widgets[i].id);
      bodyFormData.append('image', widgetsData[i]);
    }
    const info: ErrorInfo = {
      displayToast: false,
      failureResponse: 'throwError'
    };
    const customHeaders = {
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };
    this.operatorRoundService
      .sendDashboardAsEmail$(bodyFormData, customHeaders, info)
      .pipe(tap((resp: any) => {}))
      .subscribe(
        (res) => {
          this.emailNotes = '';
          this.sendEmailInprogress = true;
          this.cdrf.detectChanges();
          this.toast.show({
            text: 'Successfully sent email.',
            type: 'success'
          });
          this.dialogRef.close({ confirmed: true });
        },
        (err) => {
          this.emailNotes = '';
          this.sendEmailInprogress = false;
          this.cdrf.detectChanges();
          this.toast.show({
            text: 'Error occured while sending email.',
            type: 'warning'
          });
        }
      );
  };

  confirm() {
    this.dialogRef.close({ confirmed: true });
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      this.users.push(value.trim());
      this.selectedUsers.push(value.trim());
      const re = /\S+@\S+\.\S+/;
      this.allValidEmails = this.allValidEmails && re.test(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.userCtrl.setValue(null);
  }

  remove(user: any): void {
    const index = this.users.indexOf(user);

    if (index >= 0) {
      this.users.splice(index, 1);
      this.selectedUsers.splice(index, 1);
    }
  }

  filter(name: string) {
    return this.allUsers.filter(
      (user) => user.firstName.toLowerCase().indexOf(name.toLowerCase()) === 0
    );
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.users.push(event.option.viewValue);
    this.selectedUsers.push(event.option.value);
    this.userInput.nativeElement.value = '';
    this.userCtrl.setValue(null);
  }
}
