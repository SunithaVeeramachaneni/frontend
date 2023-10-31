import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PositionsComponent } from '../positions/positions.component';
import { DialogData } from 'src/app/shared/components/collaboration/CollabDialog';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { WhiteSpaceValidator } from 'src/app/shared/validators/white-space-validator';
import { ValidationError } from 'src/app/interfaces';
import { PlantService } from '../../master-configurations/plants/services/plant.service';
import { PositionsService } from '../services/positions.service';
import { ToastService } from 'src/app/shared/toast';

@Component({
  selector: 'app-create-positions',
  templateUrl: './create-positions.component.html',
  styleUrls: ['./create-positions.component.scss']
})
export class CreatePositionsComponent implements OnInit {
  positionsFormData: any;
  errors: ValidationError = {};
  plantsList: any[];
  searchPlantsList: any[];
  isCreating: boolean;
  constructor(
    private toast: ToastService,
    private plantService: PlantService,
    private positionService: PositionsService,
    public dialogRef: MatDialogRef<PositionsComponent>,
    private form: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {
    this.positionsFormData = this.form.group({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(40),
        WhiteSpaceValidator.whiteSpace,
        WhiteSpaceValidator.trimWhiteSpace
      ]),
      description: new FormControl(''),
      plantId: new FormControl('', [
        Validators.required,
        WhiteSpaceValidator.whiteSpace,
        WhiteSpaceValidator.trimWhiteSpace
      ])
    });
    this.plantService.fetchAllPlants$().subscribe((plant) => {
      this.plantsList = plant?.items || [];
      this.searchPlantsList = plant?.items || [];
    });
    this.isCreating = false;
  }

  processValidationErrors(controlName: string): boolean {
    const touched = this.positionsFormData.get(controlName).touched;
    const errors = this.positionsFormData.get(controlName).errors;
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

  onKeyPlant(event) {
    const value = event.target.value || '';
    if (!value) {
      this.searchPlantsList = this.plantsList;
    } else {
      this.searchPlantsList = this.searchPlant(value);
    }
  }

  searchPlant(value: string) {
    const searchValue = value.toLowerCase();
    return this.searchPlantsList?.filter(
      (plant: any) =>
        (plant.name && plant.name.toLowerCase().indexOf(searchValue) !== -1) ||
        (plant.plantId &&
          plant.plantId.toLowerCase().indexOf(searchValue) !== -1)
    );
  }

  onClose(result?:string): void {
    this.dialogRef.close(result);
  }

  createPositions() {
    this.isCreating = true;
    const payload = this.positionsFormData.value;
    this.positionService.createPositions$(payload).subscribe(
      (res) => {
        this.toast.show({
          text: 'Postion created successfully',
          type: 'success'
        });
        this.isCreating = false;
        this.onClose('success');
      },
      (err) => {
        this.toast.show({
          text: 'Something went wrong !',
          type: 'warning'
        });
        this.isCreating = false;
      }
    );
  }
}
