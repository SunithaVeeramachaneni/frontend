/* eslint-disable no-underscore-dangle */
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Observable, combineLatest, of, pipe } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  switchMap,
  tap
} from 'rxjs/operators';
import { RoundPlanScheduleConfigurationService } from 'src/app/components/operator-rounds/services/round-plan-schedule-configuration.service';
import {
  AssigneeDetails,
  SelectedAssignee,
  UserDetails
} from 'src/app/interfaces';
@Component({
  selector: 'app-assigned-to',
  templateUrl: './assigned-to.component.html',
  styleUrls: ['./assigned-to.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssignedToComponent implements OnInit {
  @Input() set assigneeDetails(assigneeDetails: AssigneeDetails) {
    this._assigneeDetails = assigneeDetails;
  }
  get assigneeDetails(): AssigneeDetails {
    return this._assigneeDetails;
  }
  @Output() selectedAssignee: EventEmitter<SelectedAssignee> =
    new EventEmitter<SelectedAssignee>();

  @Input() dropdownPosition;
  @Input() isMultiple = false;
  @Input() assignedTo: string;
  @Input() type: string;

  searchUsers: FormControl;
  searchUserGroups: FormControl;
  filteredUsers$: Observable<UserDetails[]>;
  filteredUsersCount: number;
  filteredUserGroupsCount: number;
  filteresUserGroupCount: number;
  filteredUserGroups$: Observable<UserDetails[]>;
  private _assigneeDetails: AssigneeDetails;
  constructor(private rpscService: RoundPlanScheduleConfigurationService) {}

  ngOnInit(): void {
    this.searchUsers = new FormControl('');
    console.log('type', this.type);
    if (this.type === 'user') {
      this.filteredUserGroups$ = this.searchUsers.valueChanges.pipe(
        startWith(''),
        debounceTime(500),
        distinctUntilChanged(),
        map((search) => {
          console.log('search', search);
          search = search.toLowerCase();
          console.log('assigneede', this.assigneeDetails);
          return this.assigneeDetails.users.filter(
            (user) =>
              user.isActive &&
              (user.firstName.toLowerCase().indexOf(search) !== -1 ||
                user.lastName.toLowerCase().indexOf(search) !== -1)
          );
        }),

        tap((users) => (this.filteredUsersCount = users.length))
      );
    } else if (this.type === 'userGroup') {
      this.filteredUserGroups$ = this.searchUsers.valueChanges.pipe(
        startWith(''),
        debounceTime(500),
        distinctUntilChanged(),

        tap((res) => console.log('Received user groups:', res)),
        // this.rpscService.listAllUserGroups$().subscribe((data) => {
        //   console.log(data);
        //   });

        switchMap((search) => {
          search = search.toLowerCase().trim();
          console.log('Search term:', search);
          return this.rpscService.userGroups.pipe(
            map((userGroups) => {
              console.log('usegroups', userGroups.items);
              if (!Array.isArray(userGroups.items)) {
                return [];
              }
              return userGroups.items.filter((group) => {
                console.log('Group:', group.name);
                return group.name.toLowerCase().indexOf(search) !== -1;
              });
            })
          );
        }),
        tap((filteredUserGroups) => {
          this.filteredUserGroupsCount = filteredUserGroups.length;
        })
      );
      this.rpscService.userGroups.subscribe((data) => {
        console.log(data);
      });
    }
  }

  selectAssignee(
    user: UserDetails,

    { checked }: MatCheckboxChange = {} as MatCheckboxChange
  ) {
    this.selectedAssignee.emit({ user, checked });
  }

  isAssigneeSelected(email: string) {
    return this.assignedTo.indexOf(email) !== -1;
  }
}
