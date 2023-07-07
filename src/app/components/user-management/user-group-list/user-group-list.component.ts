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

    // this.userGroupList$ = combineLatest([
    //   userGroupsOnLoadSearch$,
    //   onScrollUserGroups$
    // ]).pipe();
    // this.userGroupList$.subscribe((data) => console.log('got data :', data));
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
          return data.items;
        }),
        catchError(() => {
          this.isLoading$.next(false);
          return of([]);
        })
      );
  }

  // getUserGroups() {
  //   const initialUserGroupList$ = this.userGroupService
  //     .listUserGroups({
  //       limit: this.limit,
  //       nextToken: this.next,
  //       searchKey: this.search,
  //       plantId: ''
  //     })
  //     .pipe(shareReplay(1))
  //     .pipe(
  //       map((data) => data.items),
  //       tap((userGroups) => {
  //         if (userGroups.length) {
  //         }
  //       })
  //     );
  //   initialUserGroupList$.subscribe((data) => {
  //     console.log('User group data :', data);
  //   });
  //   this.userGroupList$ = combineLatest([
  //     initialUserGroupList$,
  //     this.userGroupListUpdate$
  //   ]).pipe(
  //     map(([userGroup, update]) => {
  //       const { action, group } = update;
  //       switch (action) {
  //         case 'add':
  //           userGroup.unshift(group);
  //           break;
  //         case 'edit':
  //           const index = userGroup.findIndex((g) => g.id === group.id);
  //           userGroup[index] = group;
  //           break;
  //         case 'delete':
  //           const indexToDelete = userGroup.findIndex((g) => g.id === group.id);
  //           userGroup.splice(indexToDelete, 1);
  //           break;
  //         case 'copy':
  //           userGroup.push(group);
  //           break;
  //       }
  //       return userGroup;
  //     }),
  //     tap((userGroupList) => {
  //       this.userGroupList = userGroupList;
  //     })
  //   );
  //   this.userGroupList$.subscribe((data) => {
  //     console.log('user group list :', data);
  //   });
  //   this.searchUserGroup$.subscribe((data) => {
  //     console.log('search :', data);
  //   });
  //   this.filteredUserGroupsList$ = combineLatest([
  //     this.userGroupList$,
  //     this.searchUserGroup$
  //   ]).pipe(
  //     map(([userGroups, search]) => {
  //       const filteredUserGroups = userGroups.filter(
  //         (userGroup) =>
  //           userGroup.name?.toLowerCase().indexOf(search?.toLowerCase()) !== -1
  //       );
  //       return filteredUserGroups;
  //     }),
  //     tap((userGroups) => {
  //       if (userGroups.length) {
  //       }
  //     })
  //   );
  // }
}
