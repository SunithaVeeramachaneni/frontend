/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable @angular-eslint/component-class-suffix */
import {
  Component,
  OnInit,
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
import { map, startWith } from 'rxjs/operators';

import { MatDialogRef } from '@angular/material/dialog';
import { UsersService } from '../../user-management/services/users.service';

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
    private cdrf: ChangeDetectorRef,
    private usersService: UsersService
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
  sendEmail = () => {
    //
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
