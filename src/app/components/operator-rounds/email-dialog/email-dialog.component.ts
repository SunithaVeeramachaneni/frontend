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
  toEmailIDs: '';
  validEmailIDs = false;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = false;

  separatorKeysCodes = [ENTER, COMMA];

  userCtrl = new FormControl();

  filteredUsers: Observable<any[]>;

  users = [];

  allUsers = [];

  constructor(
    private dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    private cdrf: ChangeDetectorRef,
    private usersService: UsersService,
    private operatorRoundService: OperatorRoundsService,
    private loginService: LoginService,
    private readonly dateUtilService: DateUtilService
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

    // .subscribe((resp) => {
    //   this.allUsers = resp.rows;
    //   this.cdrf.detectChanges();
    // });
  }

  ngOnInit() {
    this.emailNotes = '';
    this.toEmailIDs = '';
    this.filteredUsers = this.userCtrl.valueChanges.pipe(
      startWith(null),
      map((user: string | null) =>
        user ? this.filter(user) : this.allUsers.slice()
      )
    );
  }

  emailChanged = (event) => {
    this.validEmailIDs = false;
    this.toEmailIDs = event.target.value;
    const emails = this.toEmailIDs.split(',');

    this.validEmailIDs = emails
      .filter((e) => e.length)
      .every((email) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
      });
    this.cdrf.detectChanges();
    return this.validEmailIDs;
  };
  sendEmail = async () => {
    const toEmailIDs = 'shiva.kanneboina@innovapptive.com';
    const emailNotes = 'sample notes';
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
      displayToast: true,
      failureResponse: 'throwError'
    };
    const customHeaders = {
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };
    console.log(bodyFormData);
    this.operatorRoundService
      .sendDashboardAsEmail$(bodyFormData, customHeaders, info)
      .pipe(tap((resp: any) => {}))
      .subscribe(
        (res) => {
          // this.emailMenuTrigger.closeMenu();
          this.emailNotes = '';
          this.toEmailIDs = '';
        },
        (err) => {
          // this.emailMenuTrigger.closeMenu();
          this.emailNotes = '';
          this.toEmailIDs = '';
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
    }
  }

  filter(name: string) {
    return this.allUsers.filter(
      (user) => user.firstName.toLowerCase().indexOf(name.toLowerCase()) === 0
    );
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.users.push(event.option.viewValue);
    this.userInput.nativeElement.value = '';
    this.userCtrl.setValue(null);
  }
}
