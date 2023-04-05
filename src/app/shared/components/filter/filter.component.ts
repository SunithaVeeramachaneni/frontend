import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';
import { OperatorRoundsService } from 'src/app/components/operator-rounds/services/operator-rounds.service';
import { UserDetails, UsersInfoByEmail } from 'src/app/interfaces';
import { UsersService } from '../../../components/user-management/services/users.service';
import { FilterSidePanelComponent } from '../filter-side-panel/filter-side-panel.component';
import { Buffer } from 'buffer';
@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit, OnChanges {
  readonly FilterSidePanelComponent = FilterSidePanelComponent;
  users$: Observable<UserDetails[]>;
  usersInfoByEmail: UsersInfoByEmail;

  @Input()
  json: any[] = [];

  @Output()
  close: EventEmitter<any> = new EventEmitter();

  @Output()
  apply: EventEmitter<any> = new EventEmitter();

  @Output()
  reset: EventEmitter<any> = new EventEmitter();

  constructor(private userService: UsersService,
    private operatorRoundsService: OperatorRoundsService) { }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.json && changes.json.currentValue) {
      this.json = changes.json.currentValue;
    }
  }

  ngOnInit(): void {
    this.userService
      .getUsers$(
        {
          includeRoles: false,
          includeSlackDetails: false
        },
        { displayToast: true, failureResponse: { rows: [] } }
      )
      .pipe(
        map(({ rows: users }) =>
          users.map((user: UserDetails) => ({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            profileImage: this.userService.getImageSrc(
              Buffer.from(user.profileImage).toString()
            ),
            isActive: user.isActive
          }))
        ),
        shareReplay(1),
        tap((users) => {
          this.setUsers(users)
        })
    ).subscribe();
  }
  setUsers(users: any) {
    this.usersInfoByEmail = users.reduce((acc, curr) => {
      acc[curr.email] = { fullName: `${curr.firstName} ${curr.lastName}`, profileImage: curr.profileImage };
      return acc;
    }, {});
  }

  closeFilter() {
    this.close.emit();
  }

  getUsersInfo(): UsersInfoByEmail {
    return this.usersInfoByEmail;
  }

  getUserName(email: string): string {
    if (this.usersInfoByEmail && this.usersInfoByEmail[email]) {
      return this.usersInfoByEmail[email]?.fullName;
    } else {
      return this.getFromEmail(email);
    }
  }

  getUserProfile(email: string): string {
    if (this.usersInfoByEmail) {
      return this.usersInfoByEmail[email]?.profileImage;
    } else {
      return null;
    }
  }
  getUserProfileForView(emails) {
    if (emails && emails.length > 0) {
      const users = [];
      for (const item of emails) {
        users.push(this.getUserName(item));
      }
      return users.join(", ");
    } else {
      return "";
    }
  }
 
  getFromEmail(email) {
    const emailSplit = email.split("@");
    return emailSplit[0].split(".").join(" ");
  }
 
  applyFilter() {
    this.apply.emit(this.json);
  }
  resetFilter() {
    for (const item of this.json) {
      item.value = '';
      if (item.itemValue) {
        item.itemValue = '';
      }
    }
    this.reset.emit(this.json);
  }

  checkState() {
    let status = true;
    for (const item of this.json) {
      if (item.value || item.itemValue) {
        status = false;
      }
    }
    return status;
  }

  dateRangeSelect(item: any) {
    if (item.startDate && item.endDate) {
      const startDate = new Date(item.startDate).toISOString();
      const endDate = new Date(item.endDate).toISOString();
      item.value = [startDate, endDate];
    }
  }
}
