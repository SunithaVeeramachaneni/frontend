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
  selector: 'app-assign-round',
  templateUrl: './assign-round.component.html',
  styleUrls: ['./assign-round.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssignRoundComponent implements OnInit {
  @Input() set assigneeDetails(assigneeDetails: AssigneeDetails) {
    this._assigneeDetails = assigneeDetails;
  }
  get assigneeDetails(): AssigneeDetails {
    return this._assigneeDetails;
  }
  @Output() selectedAssignee: EventEmitter<UserDetails> =
    new EventEmitter<UserDetails>();
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

  selectAssignee(user: UserDetails) {
    this.selectedAssignee.emit(user);
  }
}
