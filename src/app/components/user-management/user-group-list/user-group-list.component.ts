import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddEditUserGroupModalComponent } from '../add-edit-user-group-modal/add-edit-user-group-modal.component';
import { Plant } from 'src/app/interfaces/plant';
import { PlantService } from '../../master-configurations/plants/services/plant.service';
import { UserGroupService } from '../services/user-group.service';
import { Observable } from 'rxjs';
import { defaultLimit } from 'src/app/app.constants';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-user-group-list',
  templateUrl: './user-group-list.component.html',
  styleUrls: ['./user-group-list.component.scss']
})
export class UserGroupListComponent implements OnInit {
  usergrp = 0;
  next = '';
  limit = defaultLimit;
  search: '';

  isOpenAddEditUserGroupModal = false;

  constructor(
    public dialog: MatDialog,
    private plantService: PlantService,
    private userGroupService: UserGroupService
  ) {}

  ngOnInit(): void {
    this.getListUser();
  }

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

  getListUser = () =>
    this.userGroupService
      .listUserGroups({
        limit: this.limit,
        nextToken: this.next,
        searchKey: this.search,
        plantId: ''
      })
      .subscribe((data) => {
        console.log(data.items);
      });
}
