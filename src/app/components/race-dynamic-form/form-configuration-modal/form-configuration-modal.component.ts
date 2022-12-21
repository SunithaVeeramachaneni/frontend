import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatDialogRef } from '@angular/material/dialog';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent
} from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

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
  allTags: string[] = ['Tag 1', 'Tag 2', 'Tag 3'];
  headerDataForm: FormGroup;

  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<FormConfigurationModalComponent>
  ) {
    this.filteredTags = this.tagsCtrl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) =>
        tag ? this.filter(tag) : this.allTags.slice()
      )
    );
  }

  ngOnInit(): void {
    this.headerDataForm = this.fb.group({
      name: [''],
      description: [''],
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

  remove(fruit: string): void {
    const index = this.tags.indexOf(fruit);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.tags.push(event.option.viewValue);
    this.tagsInput.nativeElement.value = '';
    this.tagsCtrl.setValue(null);
  }

  filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.tags.filter(
      (fruit) => fruit.toLowerCase().indexOf(filterValue) === 0
    );
  }

  next() {
    console.log(this.headerDataForm.value);
    this.dialogRef.close(this.headerDataForm.value);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
