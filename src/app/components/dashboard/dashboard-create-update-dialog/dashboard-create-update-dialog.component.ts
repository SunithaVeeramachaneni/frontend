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
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { WhiteSpaceValidator } from 'src/app/shared/validators/white-space-validator';
import { Dashboard } from 'src/app/interfaces';
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
        Validators.maxLength(20),
        WhiteSpaceValidator.noWhiteSpace,
        this.checkIfDashboardTitleExists()
      ])
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
          (db: any) =>
            db.name.toLowerCase() === control.value.trim().toLowerCase()
        );
      if (
        this.dialogData.dialogMode === 'EDIT' &&
        this.dialogData.data.name === control.value.trim()
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
      name: this.dashboardForm.value.dashboardName.trim(),
      isDefault: this.isDefault
    });
  }
}
