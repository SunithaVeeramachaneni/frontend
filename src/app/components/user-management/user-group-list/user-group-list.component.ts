import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddEditUserGroupModalComponent } from '../add-edit-user-group-modal/add-edit-user-group-modal.component';
import { Plant } from 'src/app/interfaces/plant';
import { PlantService } from '../../master-configurations/plants/services/plant.service';
import { UserGroupService } from '../services/user-group.service';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-user-group-list',
  templateUrl: './user-group-list.component.html',
  styleUrls: ['./user-group-list.component.scss']
})
export class UserGroupListComponent implements OnInit {
  usergrp = 0;

  isOpenAddEditUserGroupModal = false;
  name;
  description;
  plantList: Plant[];
  plantsObject = {};
  constructor(
    public dialog: MatDialog,
    private plantService: PlantService,
    private userGroupService: UserGroupService
  ) {}

  ngOnInit(): void {}

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

  getPlantsObject(plants) {
    return plants.reduce((acc, cur) => {
      acc[cur.id] = cur.plantId;
      return acc;
    }, {});
  }
}
