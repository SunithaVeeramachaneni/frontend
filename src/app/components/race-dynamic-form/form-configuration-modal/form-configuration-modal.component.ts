/* eslint-disable @typescript-eslint/naming-convention */
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatDialogRef } from '@angular/material/dialog';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent
} from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { ValidationError } from 'src/app/interfaces';
import { Router } from '@angular/router';
import { RaceDynamicFormService } from '../services/rdf.service';
import { LoginService } from '../../login/services/login.service';
import { Store } from '@ngrx/store';
import { State } from 'src/app/forms/state';
import { FormConfigurationActions } from 'src/app/forms/state/actions';

@Component({
  selector: 'app-form-configuration-modal',
  templateUrl: './form-configuration-modal.component.html',
  styleUrls: ['./form-configuration-modal.component.scss']
})
export class FormConfigurationModalComponent implements OnInit {
  @ViewChild('tagsInput', { static: false })
  tagsInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagsCtrl = new FormControl();
  filteredTags: Observable<string[]>;
  tags: string[] = [];

  allTags: string[] = [];
  originalTags: string[] = [];

  headerDataForm: FormGroup;
  errors: ValidationError = {};
  constructor(
    private fb: FormBuilder,
    private router: Router,
    public dialogRef: MatDialogRef<FormConfigurationModalComponent>,
    private readonly loginService: LoginService,
    private store: Store<State>,
    private rdfService: RaceDynamicFormService
  ) {
    this.rdfService.getAllTags$().subscribe((tags) => {
      if (tags && tags.length) {
        this.allTags = tags[0].values;
        this.originalTags = JSON.parse(JSON.stringify(tags[0].values));
      }
    });
    this.filteredTags = this.tagsCtrl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) =>
        tag ? this.filter(tag) : this.allTags.slice()
      )
    );
  }

  ngOnInit(): void {
    this.headerDataForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100)
        ]
      ],
      description: [''],
      isPublic: [false],
      isArchived: [false],
      formStatus: ['Draft'],
      formType: ['Standalone'],
      tags: [this.tags]
    });
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.tags.push(value.trim());
    }

    if (input) {
      input.value = '';
    }

    this.tagsCtrl.setValue(null);
  }

  remove(tag: string): void {
    this.allTags.push(tag);
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const index = this.allTags.indexOf(event.option.viewValue);

    if (index >= 0) {
      this.allTags.splice(index, 1);
    }

    this.tags.push(event.option.viewValue);
    this.tagsInput.nativeElement.value = '';
    this.tagsCtrl.setValue(null);
  }

  filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allTags.filter((tag) =>
      tag.toLowerCase().includes(filterValue)
    );
  }

  next() {
    const newTags = [];
    this.tags.forEach((selectedTag) => {
      if (this.originalTags.indexOf(selectedTag) < 0) {
        newTags.push(selectedTag);
      }
    });
    const dataSet = {
      type: 'tags',
      values: newTags
    };
    this.rdfService.createTags$(dataSet).subscribe((response) => {
      // do nothing
    });

    if (this.headerDataForm.valid) {
      const userName = this.loginService.getLoggedInUserName();
      this.store.dispatch(
        FormConfigurationActions.addFormMetadata({
          formMetadata: this.headerDataForm.value
        })
      );
      this.store.dispatch(
        FormConfigurationActions.updateCreateOrEditForm({
          createOrEditForm: true
        })
      );
      this.store.dispatch(
        FormConfigurationActions.createForm({
          formMetadata: {
            ...this.headerDataForm.value,
            author: userName,
            formLogo: ''
          }
        })
      );
      this.router.navigate(['/forms/create']);
      this.dialogRef.close();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  processValidationErrors(controlName: string): boolean {
    const touched = this.headerDataForm.get(controlName).touched;
    const errors = this.headerDataForm.get(controlName).errors;
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
