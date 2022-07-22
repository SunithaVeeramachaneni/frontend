import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit
} from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators
} from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, map } from 'rxjs/operators';
import { Dashboard } from 'src/app/interfaces';
import { WhiteSpaceValidator } from 'src/app/shared/validators/white-space-validator';
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
  existingDashboards: Array<any> = [];

  constructor(
    public dialogRef: MatDialogRef<CreateUpdateDashboardDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public dialogData: DashboardCreateUpdateDialogData,
    private fb: FormBuilder,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.dashboardForm = this.fb.group({
      dashboardName: new FormControl(
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
          WhiteSpaceValidator.noWhiteSpace
        ],
        this.checkIfDashboardNameExists()
      )
    });
    if (this.dialogData.dialogMode === 'EDIT') {
      this.f.dashboardName.setValue(this.dialogData.data.name);
      this.isDefault = this.dialogData.data.isDefault;
    }
  }

  get f() {
    return this.dashboardForm.controls;
  }

  checkIfDashboardNameExists(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> =>
      this.dashboardService.getDashboards$().pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        map((dashboards) => {
          let existingDashboard: any = null;
          existingDashboard = dashboards.find(
            (db: any) => db.name === control.value.trim()
          );
          if (
            this.dialogData.dialogMode === 'EDIT' &&
            this.dialogData.data.name === control.value.trim()
          )
            existingDashboard = null;
          return existingDashboard ? { exists: true } : null;
        })
      );
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
