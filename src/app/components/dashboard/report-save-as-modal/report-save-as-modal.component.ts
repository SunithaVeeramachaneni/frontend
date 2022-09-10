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
import { permissions } from 'src/app/app.constants';
import { ValidationError } from 'src/app/interfaces';
import { WhiteSpaceValidator } from 'src/app/shared/validators/white-space-validator';

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
  readonly permissions = permissions;
  errors: ValidationError = {};

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
        Validators.maxLength(48),
        WhiteSpaceValidator.whiteSpace,
        WhiteSpaceValidator.trimWhiteSpace
      ])
    });

    this.reportName.patchValue(this.data.name);
  }

  saveAs = () => {
    this.dialogRef.close(this.reportName.value);
  };

  processValidationErrors(controlName: string): boolean {
    const touched = this.reportNameAndDescForm.get(controlName).touched;
    const errors = this.reportNameAndDescForm.get(controlName).errors;
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
