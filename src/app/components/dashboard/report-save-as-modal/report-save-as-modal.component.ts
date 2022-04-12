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
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface ReportData {
  name: string;
  //description: string;
}

@Component({
  selector: 'app-widget-delete-modal',
  templateUrl: './report-save-as-modal.component.html',
  styleUrls: ['./report-save-as-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportSaveAsModalComponent implements OnInit {
  reportNameAndDescForm: FormGroup;
  constructor(
    private dialogRef: MatDialogRef<ReportSaveAsModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: ReportData,
    private fb: FormBuilder
  ) {}

  get reportName() {
    return this.reportNameAndDescForm.get('name');
  }

  get reportDescription() {
    return this.reportNameAndDescForm.get('description');
  }

  ngOnInit(): void {
    this.reportNameAndDescForm = this.fb.group({
      // reportDescription: new FormControl(''),[
      //   Validators.required,
      //   Validators.minLength(3),
      //   Validators.maxLength(48)
      // ],
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(48)
      ])
    });

    this.reportName.patchValue(this.data.name);
  }

  saveAs = () => {
    this.dialogRef.close(this.reportName.value);
  };
}
