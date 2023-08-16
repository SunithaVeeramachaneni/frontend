import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddEditUserGroupModalComponent } from '../add-edit-user-group-modal/add-edit-user-group-modal.component';
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
import { TableEvent } from 'src/app/interfaces';
import { ToastService } from 'src/app/shared/toast';
import { HeaderService } from 'src/app/shared/services/header.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { UserGroupDeleteModalComponent } from '../user-group-delete-modal/user-group-delete-modal.component';
import { LoginService } from '../../login/services/login.service';

@Component({
  selector: 'app-user-group-list',
  templateUrl: './user-group-list.component.html',
  styleUrls: ['./user-group-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserGroupListComponent
  implements OnInit, AfterViewChecked, OnDestroy
{
  currentRouteUrl$: Observable<string>;
  readonly routingUrls = routingUrls;
  userGroupList$: Observable<any> = of([]);
  filteredUserGroupsList$: Observable<any> = of([]);
  selectedUserGroupList = [];
  selectedUserGroupIDList = [];
  selectedUserGroupUsers$: Observable<any>;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  ghostLoading = new Array(12).fill(0).map((v, i) => i);
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
  allUserGroups$: Observable<any[]>;
  selectUserGroup = false;
  userGroupMode: string;
  addingUserGroup$ = new BehaviorSubject<boolean>(false);

  userGroupList: any = [];
  selectedUserGroup: any;
  selectedUserGroupId$: BehaviorSubject<string> = new BehaviorSubject<string>(
    ''
  );
  userGroupCountUpdate$: BehaviorSubject<number> = new BehaviorSubject<number>(
    0
  );

  userGroupListCount$: Observable<number>;
  selectedUserGroupPlantId$: BehaviorSubject<string> =
    new BehaviorSubject<string>('');

  listHeight = '68vh';
  bottomHit = false;
  permissionsArray = [];
  counterSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  userGroupCount$: Observable<number> = this.counterSubject.asObservable();
  private onDestroy$ = new Subject();

  constructor(
    public dialog: MatDialog,
    private userGroupService: UserGroupService,
    private cdrf: ChangeDetectorRef,
    private toast: ToastService,
    private headerService: HeaderService,
    private commonService: CommonService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.counterSubject.next(0);
    this.userGroupCount$.pipe(takeUntil(this.onDestroy$)).subscribe();
    this.currentRouteUrl$ = this.commonService.currentRouteUrlAction$.pipe(
      tap(() => this.headerService.setHeaderTitle(routingUrls.userGroups.title))
    );
    this.userGroupService.addUpdateDeleteCopyUserGroup = false;
    this.userGroupService.fetchUserGroups$.next({ data: 'load' });
    this.userGroupService.fetchUserGroups$.next({} as TableEvent);
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

    this.getDisplayedUserGroups();
    this.loginService.loggedInUserInfo$
      .pipe(
        tap(({ permissions = [] }) => {
          this.permissionsArray = permissions;
        })
      )
      .subscribe();
  }
  ngAfterViewChecked(): void {}

  createUserGroup(): void {
    const addEditUserGroupRef = this.dialog.open(
      AddEditUserGroupModalComponent,
      {
        data: {
          userGroupData: null,
          type: 'create'
        }
      }
    );
    addEditUserGroupRef.afterClosed().subscribe((resp) => {
      if (!resp || Object.keys(resp).length === 0) return;
    });
  }

  editUserGroup(data: any): void {
    const addEditUserGroupRef = this.dialog.open(
      AddEditUserGroupModalComponent,
      {
        data: {
          userGroupData: data,
          type: 'update'
        }
      }
    );
    addEditUserGroupRef.afterClosed().subscribe((resp) => {
      if (!resp || Object.keys(resp).length === 0) return;
    });
  }

  getDisplayedUserGroups() {
    const userGroupList$ = this.userGroupService.fetchUserGroups$.pipe(
      filter(({ data }) => data === 'load' || data === 'search'),
      switchMap(({ data }) => {
        this.skip = 0;
        this.fetchType = data;
        this.nextToken = '';
        this.isLoading$.next(true);
        return this.getUserGroups();
      }),
      tap((data) => {
        this.selectedUserGroup = data[0];
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
    let initial = [];

    this.allUserGroups$ = combineLatest([
      userGroupList$,
      onScrollUserGroups$,
      this.userGroupService.userGroupActions$,
      this.userGroupService.usersCount$
    ]).pipe(
      map(([rows, scrollData, { action, group }, { groupId, count }]) => {
        if (this.skip === 0) {
          if (rows.length === 0) {
            this.selectedUserGroup = null;
          }
          if (
            this.userGroupService.addUpdateDeleteCopyUserGroup &&
            action === 'add'
          ) {
            initial.unshift(group);
            this.selectedUserGroup = group;
            this.toast.show({
              type: 'success',
              text: 'User Group added successfully'
            });
            this.increment();
          }
          initial = rows;
        } else if (this.userGroupService.addUpdateDeleteCopyUserGroup) {
          switch (action) {
            case 'copy':
              initial.unshift(group);
              this.increment();
              break;
            case 'edit':
              const indexCpy = initial.findIndex(
                (data) => data?.id === group?.id
              );
              initial[indexCpy] = group;
              this.toast.show({
                type: 'success',
                text: 'User Group edited successfully'
              });
              this.userGroupService.addUpdateDeleteCopyUserGroup = false;

              break;
            case 'add':
              initial.unshift(group);
              this.selectedUserGroup = group;
              this.toast.show({
                type: 'success',
                text: 'User Group added successfully'
              });
              this.increment();

              break;
            case 'delete':
              const indexDel = initial.findIndex(
                (data) => data.id === group.id
              );
              initial.splice(indexDel, 1);
              if (initial?.length === 0) {
                this.selectedUserGroup = null;
              }
              if (indexDel === 0) {
                this.selectedUserGroup = initial[indexDel];
              } else {
                this.selectedUserGroup = initial[indexDel - 1];
              }
              this.toast.show({
                type: 'success',
                text: 'User Group deleted successfully'
              });
              this.decrement();

              break;
          }
        } else if (this.userGroupService.usersListEdit) {
          initial.map((data) => {
            if (data?.id === groupId) {
              data.usersCount = count;
            }
          });
          this.userGroupService.usersListEdit = false;
        } else {
          initial = initial.concat(scrollData);
        }
        this.skip = initial.length;
        this.cdrf.markForCheck();
        return initial;
      })
    );
  }

  getUserGroups() {
    return this.userGroupService
      .listUserGroups$({
        limit: this.limit,
        fetchType: this.fetchType,
        nextToken: this.nextToken,
        searchKey: this.searchUserGroup.value.toLowerCase(),
        plantId: ''
      })
      .pipe(
        map((data) => {
          this.isLoading$.next(false);
          if (data?.count !== null && data?.count !== undefined) {
            this.counterSubject.next(data?.count);
          }
          this.nextToken = data.next;
          if (this.bottomHit === true) {
            this.bottomHit = false;
          }
          return data.items;
        }),
        catchError(() => {
          this.isLoading$.next(false);
          return of([]);
        })
      );
  }
  copyUserGroup(id: any) {
    this.userGroupService.copyUserGroup$(id).subscribe((data) => {
      this.userGroupService.addUpdateDeleteCopyUserGroup = true;
      const preparedData = Object.fromEntries(
        Object.entries(data).filter(([key, value]) => key !== 'users')
      );
      preparedData.usersCount = data?.users?.length;
      this.userGroupService.userGroupActions$.next({
        action: 'copy',
        group: preparedData
      });

      this.toast.show({
        type: 'success',
        text: 'User Group copied successfully'
      });
    });
  }
  deleteUserGroup(data: any) {
    const deleteUserGroupModalRef = this.dialog.open(
      UserGroupDeleteModalComponent,
      {
        data: {
          userGroupData: data,
          type: 'delete'
        }
      }
    );
    deleteUserGroupModalRef.afterClosed().subscribe((resp) => {
      if (!resp) return;
      this.userGroupService.deleteUserGroup$(data.id).subscribe(() => {
        this.userGroupService.addUpdateDeleteCopyUserGroup = true;
        this.userGroupService.userGroupActions$.next({
          action: 'delete',
          group: data
        });
      });
    });
  }
  showSelectedUserGroup(userGroup) {
    this.selectedUserGroup = userGroup;
  }
  listBottom(event: any) {
    if (
      event.target.offsetHeight + Math.ceil(event.target.scrollTop) >=
      Math.ceil(0.95 * event.target.scrollHeight)
    ) {
      if (this.nextToken && !this.bottomHit) {
        this.userGroupService.fetchUserGroups$.next({ data: 'infiniteScroll' });
        this.bottomHit = true;
      }
    }
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
  increment() {
    if (this.userGroupService.addUpdateDeleteCopyUserGroup) {
      this.counterSubject.next(this.counterSubject.value + 1);
      this.userGroupService.addUpdateDeleteCopyUserGroup = false;
    }
  }

  decrement() {
    if (this.userGroupService.addUpdateDeleteCopyUserGroup) {
      this.counterSubject.next(this.counterSubject.value - 1);
      this.userGroupService.addUpdateDeleteCopyUserGroup = false;
    }
  }
  checkPermissions = (permission) =>
    this.loginService.checkUserHasPermission(this.permissionsArray, permission);
}
