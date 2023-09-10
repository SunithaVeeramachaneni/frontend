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
import { BehaviorSubject, Observable, Subject, combineLatest } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  takeUntil,
  tap
} from 'rxjs/operators';
import {
  AssigneeDetails,
  SelectedAssignee,
  UserDetails,
  UserGroup
} from 'src/app/interfaces';
@Component({
  selector: 'app-assigned-to',
  templateUrl: './assigned-to.component.html',
  styleUrls: ['./assigned-to.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssignedToComponent implements OnInit, OnDestroy {
  @Input() set assigneeDetails(assigneeDetails: AssigneeDetails) {
    this.assigneeDetails$.next(assigneeDetails);
  }
  @Output() selectedAssignee: EventEmitter<SelectedAssignee> =
    new EventEmitter<SelectedAssignee>();

  @Input() set assigneeType(assigneeType) {
    this._assigneeType = assigneeType;
  }

  get assigneeType() {
    return this._assigneeType;
  }

  @Input() set showAssigneeOptions(assigneeOption: boolean) {
    this._showAssigneeOptions = assigneeOption;
  }

  get showAssigneeOptions() {
    return this._showAssigneeOptions;
  }

  @Input() dropdownPosition;
  @Input() isMultiple = false;
  @Input() assignedTo: string;
  searchInput = new FormControl('');
  filteredData$: Observable<any[]>;
  filteredDataCount: number;
  assignTypes = ['plant', 'userGroup', 'user'];
  assigneeTypeControl = new FormControl('userGroup');
  assigneeDetails$ = new BehaviorSubject({} as AssigneeDetails);
  private _assigneeType = 'userGroup';
  private _showAssigneeOptions = false;
  private onDestroy$ = new Subject();
  constructor() {}

  ngOnInit(): void {
    this.assigneeTypeControl.valueChanges
      .pipe(
        takeUntil(this.onDestroy$),
        tap((type) => {
          this.assigneeType = type;
          this.searchInput.patchValue('');
        })
      )
      .subscribe();

    this.filteredData$ = combineLatest([
      this.searchInput.valueChanges.pipe(
        startWith(''),
        debounceTime(500),
        distinctUntilChanged()
      ),
      this.assigneeDetails$
    ]).pipe(
      map(([search, assigneeDetails]) => {
        search = search.toLowerCase();
        if (this.assigneeType === 'user') {
          return (
            assigneeDetails.users?.filter(
              (user) =>
                user.isActive &&
                (user.firstName.toLowerCase().indexOf(search) !== -1 ||
                  user.lastName.toLowerCase().indexOf(search) !== -1)
            ) || []
          );
        }
        if (this.assigneeType === 'userGroup') {
          return (
            assigneeDetails.userGroups?.filter(
              (userGroup: any) => userGroup.searchTerm.indexOf(search) !== -1
            ) || []
          );
        }
      }),
      tap((data) => (this.filteredDataCount = data.length))
    );
  }

  selectAssignee(
    data: any,
    { checked }: MatCheckboxChange = {} as MatCheckboxChange
  ) {
    const selectedAssignee: any = {
      assigneeType: this.assigneeType,
      checked
    };
    if (this.assigneeType === 'user') {
      selectedAssignee.user = data;
    }
    if (this.assigneeType === 'userGroup') {
      selectedAssignee.userGroup = data;
    }
    if (this.assigneeType) this.selectedAssignee.emit(selectedAssignee);
  }

  isAssigneeSelected(email: string) {
    return this.assignedTo.indexOf(email) !== -1;
  }
  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
