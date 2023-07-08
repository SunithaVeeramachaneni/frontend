import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddEditUserGroupModalComponent } from '../add-edit-user-group-modal/add-edit-user-group-modal.component';
import { Plant } from 'src/app/interfaces/plant';
import { PlantService } from '../../master-configurations/plants/services/plant.service';
import { UserGroupService } from '../services/user-group.service';
import { Observable, of, BehaviorSubject, combineLatest, Subject } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  takeUntil,
  tap
} from 'rxjs/operators';
import { defaultLimit, routingUrls } from 'src/app/app.constants';
import { FormControl } from '@angular/forms';
import { ErrorInfo } from 'src/app/interfaces';
import { ToastService } from 'src/app/shared/toast';
import { HeaderService } from 'src/app/shared/services/header.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

interface UserGroupListUpdate {
  action: 'add' | 'edit' | 'delete' | 'copy' | null;
  group: any;
}
@Component({
  selector: 'app-user-group-list',
  templateUrl: './user-group-list.component.html',
  styleUrls: ['./user-group-list.component.scss']
})
export class UserGroupListComponent implements OnInit, AfterViewChecked {
  currentRouteUrl$: Observable<string>;
  readonly routingUrls = routingUrls;
  userGroupList$: Observable<any> = of([]);
  filteredUserGroupsList$: Observable<any> = of([]);
  selectedUserGroupList = [];
  selectedUserGroupIDList = [];
  selectedUserGroupUsers$: Observable<any>;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  userGroupListUpdate$: BehaviorSubject<UserGroupListUpdate> =
    new BehaviorSubject<UserGroupListUpdate>({
      action: null,
      group: {}
    });
  skip = 0;
  fetchType = 'load';
  nextToken = '';
  userGroupId;
  usergrp = 0;
  next = '';
  limit = defaultLimit;
  search: '';
  isOpenAddEditUserGroupModal = false;
  searchUserGroup: FormControl;
  searchUserGroup$: Observable<string>;
  selectUserGroup = false;
  userGroupMode: string;
  addingUserGroup$ = new BehaviorSubject<boolean>(false);
  userGroupList: any = [];
  selectedUserGroup = null;
  selectedUserGroupId$: BehaviorSubject<string> = new BehaviorSubject<string>(
    ''
  );
  selectedUserGroupPlantId$: BehaviorSubject<string> =
    new BehaviorSubject<string>('');
  listHeight = '68vh';
  private onDestroy$ = new Subject();

  constructor(
    public dialog: MatDialog,
    private plantService: PlantService,
    private userGroupService: UserGroupService,
    private cdrf: ChangeDetectorRef,
    private toast: ToastService,
    private headerService: HeaderService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.userGroupService.fetchUserGroups$.next({ data: 'load' });
    this.searchUserGroup = new FormControl('');
    this.searchUserGroup.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.onDestroy$),
        tap((value) => {
          this.userGroupService.fetchUserGroups$.next({ data: 'search' });
        })
      )
      .subscribe(() => this.isLoading$.next(true));

    this.currentRouteUrl$ = this.commonService.currentRouteUrlAction$.pipe(
      tap(() => this.headerService.setHeaderTitle(routingUrls.userGroups.title))
    );
    this.getDisplayedUserGroups();
  }
  ngAfterViewChecked(): void {}

  openAddEditUserGroupModal(): void {
    const addEditUserGroupRef = this.dialog.open(
      AddEditUserGroupModalComponent,
      {
        data: {
          dialogText: 'createUserGroup'
        }
      }
    );
    addEditUserGroupRef.afterClosed().subscribe((resp) => {
      if (!resp || Object.keys(resp).length === 0) return;
    });
  }

  getDisplayedUserGroups() {
    this.userGroupList$ = this.userGroupService.fetchUserGroups$.pipe(
      filter(({ data }) => data === 'load' || data === 'search'),
      switchMap(({ data }) => {
        this.skip = 0;
        this.fetchType = data;
        this.nextToken = '';
        return this.getUserGroups();
      }),
      tap((data) => {
        this.selectUserGroup = data[0];
      })
    );
    const onScrollUserGroups$ = this.userGroupService.fetchUserGroups$.pipe(
      filter(({ data }) => data !== 'load' && data !== 'search'),
      switchMap(({ data }) => {
        if (data === 'infiniteScroll') {
          this.fetchType = 'infiniteScroll';
          return this.getUserGroups();
        } else {
          return of([]);
        }
      })
    );

    onScrollUserGroups$.subscribe((data) => console.log('On scroll :', data));
  }

  copyUserGroup(event) {
    console.log('Id' + event);
    this.userGroupId = event;
    console.log();
    return this.userGroupService
      .copyUserGroup$(event, {
        displayToast: true,
        failureResponse: {}
      })
      .subscribe((data) => {
        console.log(data);
      });
  }
  getUserGroups() {
    console.log('into get users');
    return this.userGroupService
      .listUserGroups({
        limit: this.limit,
        fetchType: this.fetchType,
        nextToken: this.nextToken,
        searchKey: this.searchUserGroup.value,
        plantId: ''
      })
      .pipe(
        map((data) => {
          this.isLoading$.next(false);
          // console.log(data);
          this.usergrp = data.count;
          return data.items;
        }),
        catchError(() => {
          this.isLoading$.next(false);
          return of([]);
        })
      );
  }
  showSelectedUserGroup(userGroup) {
    this.selectedUserGroup = userGroup;
  }
}
