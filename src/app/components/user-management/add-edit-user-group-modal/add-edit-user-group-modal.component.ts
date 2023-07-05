import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Inject,
  Output,
  ChangeDetectorRef,
  EventEmitter
} from '@angular/core';
import {
  FormControl,
  FormBuilder,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WhiteSpaceValidator } from 'src/app/shared/validators/white-space-validator';
import { UserGroupEvent, ValidationError } from 'src/app/interfaces';
import { SelectUserUsergroupModalComponent } from '../select-user-usergroup-modal/select-user-usergroup-modal.component';
import { PlantService } from '../../master-configurations/plants/services/plant.service';
@Component({
  selector: 'app-add-edit-user-group-modal',
  templateUrl: './add-edit-user-group-modal.component.html',
  styleUrls: ['./add-edit-user-group-modal.component.scss']
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
  errors: ValidationError = {};

  constructor(
    public dialog: MatDialog,
    private dailogRef: MatDialogRef<AddEditUserGroupModalComponent>,
    private fb: FormBuilder,
    private plantService: PlantService,
    private cdrf: ChangeDetectorRef,
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
      plantId: new FormControl('', [this.matSelectValidator()])
    });
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
  matSelectValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null =>
      !control.value?.length ? { selectOne: { value: control.value } } : null;
  }

  close() {
    this.dailogRef.close();
  }

  openSelectUser(): void {
    const openSelectUserRef = this.dialog.open(
      SelectUserUsergroupModalComponent,
      {
        data: {
          dialogText: 'createUserGroup',
          ...this.userGroupForm.value
        }
      }
    );
    openSelectUserRef.afterClosed().subscribe();
  }

  next() {
    console.log(this.userGroupForm.value);
    this.dailogRef.close({
      data: this.userGroupForm.value
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
