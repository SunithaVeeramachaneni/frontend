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
  plants: Plant[];
  plantsObject = {};
  constructor(
    public dialog: MatDialog,
    private plantService: PlantService,
    private userGroupService: UserGroupService
  ) {}

  ngOnInit(): void {
    this.getAllPlants();
  }

  openAddEditUserGroupModal(): void {
    const addEditUserGroupRef = this.dialog.open(
      AddEditUserGroupModalComponent,
      {
        data: {
          dialogText: 'createUserGroup',
          name: this.name,
          description: this.description,
          plantList: this.plants
        }
      }
    );
    addEditUserGroupRef.afterClosed().subscribe((resp) => {
      if (!resp || Object.keys(resp).length === 0) return;

      this.userGroupService
        .createUserGroup$(resp.user)
        .subscribe((createdUserGroup) => {
          console.log(createdUserGroup);
        });
    });
  }

  getAllPlants() {
    this.plantService.fetchAllPlants$().subscribe((data) => {
      if (data && Object.keys(data).length > 0) {
        this.plants = data.items;
      }
    });
  }
}
