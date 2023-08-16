import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject
} from '@angular/core';
import { FormControl, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WhiteSpaceValidator } from 'src/app/shared/validators/white-space-validator';
import { ValidationError } from 'src/app/interfaces';
import { SelectUserUsergroupModalComponent } from '../select-user-usergroup-modal/select-user-usergroup-modal.component';
import { PlantService } from '../../master-configurations/plants/services/plant.service';
import { UserGroupService } from '../services/user-group.service';
@Component({
  selector: 'app-add-edit-user-group-modal',
  templateUrl: './add-edit-user-group-modal.component.html',
  styleUrls: ['./add-edit-user-group-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddEditUserGroupModalComponent implements OnInit {
  name: string;
  description: string;
  plantId: string;
  title;
  dialogText: string;
  plants: any[];
  plantInformation: any[];
  userGroupForm: any;
  groupStatus: string;
  groupTitle: string;
  groupBtn: string;
  groupData: any;
  errors: ValidationError = {};

  constructor(
    public dialog: MatDialog,
    private dailogRef: MatDialogRef<AddEditUserGroupModalComponent>,
    private fb: FormBuilder,
    private plantService: PlantService,
    private userGroupService: UserGroupService,
    @Inject(MAT_DIALOG_DATA)
    public data: any
  ) {}

  ngOnInit(): void {
    this.userGroupForm = this.fb.group({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(40),
        WhiteSpaceValidator.whiteSpace,
        WhiteSpaceValidator.trimWhiteSpace
      ]),
      description: new FormControl(''),
      plantId: new FormControl('', [Validators.required])
    });
    if (this.data.type === 'create') {
      this.groupData = null;
      this.groupStatus = 'create';
      this.groupTitle = 'Create User Group';
      this.groupBtn = 'Next';
      this.userGroupForm?.reset();
      this.userGroupForm?.get('plantId').enable();
    } else {
      this.groupData = this.data?.userGroupData;
      this.groupStatus = 'update';
      this.groupTitle = 'Update User Group';
      this.groupBtn = 'Save';
      const groupEditData = {
        name: this.groupData?.name,
        description: this.groupData?.description,
        plantId: this.groupData?.plantId
      };
      this.userGroupForm.patchValue(groupEditData);
      this.userGroupForm.get('plantId').disable();
    }
    this.getAllPlants();
    const { dialogText } = this.data;
    this.dialogText = dialogText;
  }

  getAllPlants() {
    this.plantService.fetchAllPlants$().subscribe((data) => {
      if (data && Object.keys(data).length > 0) {
        this.plants = data.items;
        this.plantInformation = this.plants;
      }
    });
  }

  close() {
    this.dailogRef.close();
  }

  openSelectUser(): void {
    const openSelectUserRef = this.dialog.open(
      SelectUserUsergroupModalComponent,
      {
        data: {
          type: 'create',
          ...this.userGroupForm.value
        }
      }
    );
    openSelectUserRef.afterClosed().subscribe((data) => {
      if (!data.isBack) {
        this.dailogRef.close();
      }
    });
  }

  next() {
    this.dailogRef.close({
      data: this.userGroupForm.value
    });
  }
  updateUserGroup() {
    const updatedName = this.userGroupForm.get('name').value;
    const updatedDesc = this.userGroupForm.get('description').value;
    const updatedData = {
      ...this.groupData,
      name: updatedName ?? '',
      description: updatedDesc ?? '',
      searchTerm: `${updatedName?.toLowerCase() ?? ''} ${
        updatedDesc?.toLowerCase() ?? ''
      }`
    };
    const payload = {
      name: updatedName,
      description: updatedDesc,
      searchTerm: `${updatedName?.toLowerCase()} ${updatedDesc?.toLowerCase()}`
    };
    this.userGroupService
      .updateUserGroup$(this.groupData?.id, payload, {
        displayToast: true,
        failureResponse: {}
      })
      .subscribe(() => {
        this.userGroupService.addUpdateDeleteCopyUserGroup = true;
        this.userGroupService.userGroupActions$.next({
          action: 'edit',
          group: { ...updatedData }
        });
        this.dailogRef.close();
      });
  }

  onKeyPlant(event) {
    const value = event.target.value || '';
    if (!value) {
      this.plantInformation = this.plants;
    } else {
      this.plantInformation = this.searchPlant(value);
    }
  }

  searchPlant(value: string) {
    const searchValue = value.toLowerCase();
    return this.plants?.filter(
      (plant) =>
        (plant.name && plant.name.toLowerCase().indexOf(searchValue) !== -1) ||
        (plant.plantId &&
          plant.plantId.toLowerCase().indexOf(searchValue) !== -1)
    );
  }

  processValidationErrors(controlName: string): boolean {
    const touched = this.userGroupForm.get(controlName).touched;
    const errors = this.userGroupForm.get(controlName).errors;
    this.errors[controlName] = null;
    if (touched && errors) {
      Object.keys(errors).forEach((messageKey) => {
        this.errors[controlName] = {
          name: messageKey,
          length: errors[messageKey]?.requiredLength
        };
      });
    }
    return !touched || this.errors[controlName] === null ? false : true;
  }
}
