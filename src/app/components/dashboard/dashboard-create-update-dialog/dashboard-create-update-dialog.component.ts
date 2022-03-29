import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { Dashboard } from 'src/app/interfaces';

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
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.dashboardForm = this.fb.group({
      dashboardName: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20)
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

  onNoClick(): void {
    this.dialogRef.close();
  }
  createDashboard(event: any) {
    event.stopPropagation();
    this.dialogRef.close({
      name: this.dashboardForm.value.dashboardName,
      isDefault: this.isDefault
    });
  }
}
