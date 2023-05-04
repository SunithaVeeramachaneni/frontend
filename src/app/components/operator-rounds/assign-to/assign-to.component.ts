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
import { Observable } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  tap
} from 'rxjs/operators';
import {
  AssigneeDetails,
  SelectedAssignee,
  UserDetails
} from 'src/app/interfaces';

@Component({
  selector: 'app-assign-to',
  templateUrl: './assign-to.component.html',
  styleUrls: ['./assign-to.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssignToComponent implements OnInit {
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
  private _assigneeDetails: AssigneeDetails;
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
