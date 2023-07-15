/* eslint-disable no-underscore-dangle */
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  OnChanges,
  Output
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  tap
} from 'rxjs/operators';
import { AssigneeDetails, UserDetails } from 'src/app/interfaces';

@Component({
  selector: 'app-assign-inspection',
  templateUrl: './assign-inspection.component.html',
  styleUrls: ['./assign-inspection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssignInspectionComponent implements OnInit, OnChanges {
  @Input() set assigneeDetails(assigneeDetails: AssigneeDetails) {
    this._assigneeDetails = assigneeDetails;
  }
  get assigneeDetails(): AssigneeDetails {
    return this._assigneeDetails;
  }
  @Output() selectedAssignee: EventEmitter<UserDetails> =
    new EventEmitter<UserDetails>();

  @Input() dropdownPosition;
  searchUsers: FormControl;
  filteredUsers$: Observable<UserDetails[]>;
  filteredUsersCount: number;
  private _assigneeDetails: AssigneeDetails;
  constructor() {}

  ngOnInit(): void {
    this.searchUsers = new FormControl('');
  }
  ngOnChanges() {
    this.filteredUsers$ = this.searchUsers?.valueChanges.pipe(
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

  selectAssignee(user: UserDetails) {
    this.selectedAssignee.emit(user);
  }
}
