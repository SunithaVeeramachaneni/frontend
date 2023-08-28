import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WhiteSpaceValidator } from 'src/app/shared/validators/white-space-validator';
import { Dashboard, ValidationError } from 'src/app/interfaces';
import { DashboardService } from '../services/dashboard.service';

export interface DashboardCreateUpdateDialogData {
  dialogMode: string;
  data: Dashboard;
}

@Component({
  selector: 'app-create-dashboard-dialog',
  templateUrl: 'dashboard-create-update-dialog.html',
  styleUrls: ['./dashboard-create-update-dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateUpdateDashboardDialogComponent implements OnInit {
  isDefault: boolean | false;
  dashboardForm: FormGroup;
  errors: ValidationError = {};
  modules = [
    {
      name: 'Operator Rounds',
      id: 'operator_rounds'
    }
  ];

  constructor(
    public dialogRef: MatDialogRef<CreateUpdateDashboardDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public dialogData: DashboardCreateUpdateDialogData,
    private fb: FormBuilder,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.dashboardForm = this.fb.group({
      dashboardName: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        WhiteSpaceValidator.whiteSpace,
        WhiteSpaceValidator.trimWhiteSpace,
        this.checkIfDashboardTitleExists()
      ]),
      moduleName: new FormControl('')
    });
    if (this.dialogData.dialogMode === 'EDIT') {
      this.f.dashboardName.setValue(this.dialogData.data.name);
      this.isDefault = this.dialogData.data.isDefault;
    }
  }

  get f() {
    return this.dashboardForm.controls;
  }

  checkIfDashboardTitleExists(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      let existingDashboard: any = null;
      existingDashboard = this.dashboardService
        .getDashboards()
        .find(
          (db: any) => db.name.toLowerCase() === control.value.toLowerCase()
        );
      if (
        this.dialogData.dialogMode === 'EDIT' &&
        this.dialogData.data.name === control.value
      ) {
        existingDashboard = null;
      }
      return existingDashboard ? { exists: true } : null;
    };
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  createDashboard(event: any) {
    event.stopPropagation();
    this.dialogRef.close({
      name: this.dashboardForm.value.dashboardName,
      moduleName: this.dashboardForm.value.moduleName,
      isDefault: this.isDefault
    });
  }

  processValidationErrors(controlName: string): boolean {
    const touched = this.dashboardForm.get(controlName).touched;
    const errors = this.dashboardForm.get(controlName).errors;
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
