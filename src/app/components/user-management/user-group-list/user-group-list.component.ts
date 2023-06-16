import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddEditUserGroupModalComponent } from '../add-edit-user-group-modal/add-edit-user-group-modal.component';
import { Plant } from 'src/app/interfaces/plant';
import { PlantService } from '../../master-configurations/plants/services/plant.service';
import { UserGroupService } from '../services/user-group.service';
import {
  BehaviorSubject,
  Observable,
  ReplaySubject,
  combineLatest,
  from,
  of
} from 'rxjs';
import { FormControl } from '@angular/forms';
import {
  graphQLDefaultLimit,
  graphQLRoundsOrInspectionsLimit
} from 'src/app/app.constants';
import {
  LoadEvent,
  SearchEvent,
  TableEvent,
  UserGroupDetails,
  UserGroupQueryParam,
  UserGroupDetailResponse
} from 'src/app/interfaces';

import { filter, switchMap, tap } from 'rxjs/operators';
import { Column } from '@innovapptive.com/dynamictable/lib/interfaces';
@Component({
  selector: 'app-user-group-list',
  templateUrl: './user-group-list.component.html',
  styleUrls: ['./user-group-list.component.scss']
})
export class UserGroupListComponent implements OnInit {
  userGroupCount = 0;
  userGroupdata: any;
  nextToken = '';
  userGrp: any;
  searchForm: FormControl;
  plantId: string;
  fetchType = 'load';
  userGroup$: Observable<{
    columns: Column[];
    data: any[];
  }>;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  isOpenAddEditUserGroupModal = false;
  limit = graphQLRoundsOrInspectionsLimit;
  fetchUserGroup$: ReplaySubject<TableEvent | LoadEvent | SearchEvent> =
    new ReplaySubject<TableEvent | LoadEvent | SearchEvent>(2);
  name;
  skip = 0;
  data: any[];
  description;
  plantList: Plant[];
  plantsObject = {};
  initial: any;
  filterJson = [];
  filter = {
    status: '',
    schedule: '',
    assignedTo: '',
    dueDate: '',
    plant: ''
  };
  constructor(
    public dialog: MatDialog,
    private plantService: PlantService,
    private userGroupService: UserGroupService
  ) {}

  ngOnInit(): void {
    this.searchForm = new FormControl('');
    // this.fetchUserGroup$.next({} as TableEvent);
    // const roundsOnLoadSearch$ = this.fetchUserGroup$.pipe(
    //   filter(({ data }) => data === 'load' || data === 'search'),
    //   switchMap(({ data }) => {
    //     this.skip = 0;
    //     this.nextToken = '';
    //     this.fetchType = data;
    //     return this.getUserGroupList();
    //   })
    // );

    // const onScrollUserGroup$ = this.fetchUserGroup$.pipe(
    //   filter(({ data }) => data !== 'load' && data !== 'search'),
    //   switchMap(({ data }) => {
    //     if (data === 'infiniteScroll') {
    //       this.fetchType = 'infiniteScroll';
    //       return this.getUserGroupList();
    //     } else {
    //       return of({} as UserGroupDetailResponse);
    //     }
    //   })
    // );

    this.getUserGroupList();
  }

  openAddEditUserGroupModal(): void {
    const addEditUserGroupRef = this.dialog.open(
      AddEditUserGroupModalComponent,
      {
        data: {
          name: this.name,
          description: this.description,
          plantList: this.plantList
        }
      }
    );
    addEditUserGroupRef.afterClosed().subscribe((resp) => {
      if (!resp || Object.keys(resp).length === 0 || !resp.user) return;

      this.userGroupService
        .createUserGroup1$(resp.user)
        .subscribe((createdUserGroup) => {
          console.log(createdUserGroup);
        });
    });
  }

  getUserGroupList() {
    const obj = {
      next: this.nextToken,
      limit: this.limit,
      searchTerm: this.searchForm.value,
      fetchType: this.fetchType,
      plantId: this.plantId
    };
    this.userGroupService
      .getUserGroupList$(obj, this.filter)
      .pipe
      // tap(({ count, next }) => {
      //   this.nextToken = next !== undefined ? next : null;
      //   this.userGroupCount =
      //     count !== undefined ? count : this.userGroupCount;
      //   this.isLoading$.next(false);
      // })
      ()
      .subscribe((data) => {
        // console.log(data);
        this.userGrp = data;
        console.log(this.userGrp);
      });
  }

  getPlantsObject(plants) {
    return plants.reduce((acc, cur) => {
      acc[cur.id] = cur.plantId;
      return acc;
    }, {});
  }
}
