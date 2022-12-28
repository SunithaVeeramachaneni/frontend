import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-response-type',
  templateUrl: './response-type.component.html',
  styleUrls: ['./response-type.component.scss']
})
export class ResponseTypeComponent implements OnInit {
  allFieldTypes;
  isCustomizerOpen = false;
  public responseDrawer = false;
  public sliderdrawer = false;
  constructor(
    public dialogRef: MatDialogRef<ResponseTypeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.allFieldTypes = this.data.fieldTypes;
  }

  getFieldTypeImage(type) {
    return type ? `assets/rdf-forms-icons/fieldType-icons/${type}.svg` : null;
  }

  selectFieldType(fieldType) {
    if (fieldType.type === this.data.question.get('fieldType').value) {
      return;
    }

    this.data.question.get('fieldType').setValue(fieldType.type);
    this.data.question.get('required').setValue(false);
    this.data.question.get('value').setValue('');

    switch (fieldType.type) {
      case 'TF':
        this.data.question.get('value').setValue('TF');
        break;
      case 'VI':
        this.isCustomizerOpen = true;
        this.data.question.get('value').setValue([]);
        break;
      case 'RT':
        this.isCustomizerOpen = true;
        const sliderValue = {
          value: 0,
          min: 0,
          max: 100,
          increment: 1
        };
        this.data.question.get('value').setValue(sliderValue);
        //this.sliderOptions = sliderValue;
        break;
      default:
      // do nothing
    }
    this.dialogRef.close();
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
