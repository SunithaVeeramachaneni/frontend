/* eslint-disable no-underscore-dangle */
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import {
  debounceTime,
  delay,
  distinctUntilChanged,
  map,
  startWith,
  takeUntil,
  tap
} from 'rxjs/operators';
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
export class AssignedToComponent implements OnInit, OnDestroy {
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
  searchUsers: FormControl;
  filteredUsers$: Observable<UserDetails[]>;
  filteredUsersCount: number;
  selectedAssigneeInput$ = new BehaviorSubject({});
  private _assigneeDetails: AssigneeDetails;
  private onDestroy$ = new Subject();

  constructor() {}

  ngOnInit(): void {
    this.searchUsers = new FormControl('');

    this.filteredUsers$ = this.searchUsers.valueChanges.pipe(
      startWith(''),
      debounceTime(500),
      distinctUntilChanged(),
      map((search) => {
        search = search.toLowerCase();
        return this.assigneeDetails.users.filter(
          (user) =>
            user.isActive &&
            (user.firstName.toLowerCase().indexOf(search) !== -1 ||
              user.lastName.toLowerCase().indexOf(search) !== -1)
        );
      }),
      tap((users) => (this.filteredUsersCount = users.length))
    );

    this.selectedAssigneeInput$
      .pipe(
        takeUntil(this.onDestroy$),
        debounceTime(100),
        delay(1000),
        tap((assignee: any) => {
          if (assignee.user) {
            this.selectedAssignee.emit(assignee);
          }
        })
      )
      .subscribe();
  }

  selectAssignee(
    user: UserDetails,
    { checked }: MatCheckboxChange = {} as MatCheckboxChange
  ) {
    this.selectedAssigneeInput$.next({ user, checked });
  }

  isAssigneeSelected(email: string) {
    return this.assignedTo.indexOf(email) !== -1;
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
