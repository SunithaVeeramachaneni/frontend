import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PlantService } from '../../master-configurations/plants/services/plant.service';
import {
  debounceTime,
  delay,
  distinctUntilChanged,
  first,
  map,
  switchMap,
  tap
} from 'rxjs/operators';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Inject,
  ChangeDetectorRef
} from '@angular/core';
import {
  FormControl,
  FormBuilder,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
  AsyncValidatorFn
} from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WhiteSpaceValidator } from 'src/app/shared/validators/white-space-validator';
import { ValidationError } from 'src/app/interfaces';
@Component({
  selector: 'app-add-edit-user-group-modal',
  templateUrl: './add-edit-user-group-modal.component.html',
  styleUrls: ['./add-edit-user-group-modal.component.scss']
})
export class AddEditUserGroupModalComponent implements OnInit {
  dialogText: string;
  userGroupForm: any;
  errors: ValidationError = {};

  constructor(
    private dailogRef: MatDialogRef<AddEditUserGroupModalComponent>,
    private plantService: PlantService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA)
    public data: any
  ) {}

  ngOnInit(): void {
    this.userGroupForm = this.fb.group({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(40),
        Validators.pattern('^[a-zA-Z0-9 ]+$'),
        WhiteSpaceValidator.whiteSpace,
        WhiteSpaceValidator.trimWhiteSpace
      ]),
      plantId: new FormControl('', [this.matSelectValidator()])
    });

    const { name, description, plantList, dialogText } = this.data;
    this.dialogText = dialogText;
  }

  matSelectValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null =>
      !control.value?.length ? { selectOne: { value: control.value } } : null;
  }

  close() {
    this.dailogRef.close();
  }

  save() {}

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
