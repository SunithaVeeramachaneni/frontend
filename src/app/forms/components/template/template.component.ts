import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';
import { ImageUtils } from 'src/app/shared/utils/imageUtils';
import { ResponseTypeComponent } from '../response-type/response-type.component';
import { fieldTypesMock } from '../response-type/response-types.mock';
@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export class TemplateComponent implements OnInit {
  questionForm: FormGroup;
  fieldType = { type: 'TF', description: 'Text Answer' };
  fieldTypes: any = [this.fieldType];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private imageUtils: ImageUtils
  ) {}

  ngOnInit(): void {
    this.questionForm = this.fb.group({
      questions: this.fb.array([this.initQuestions(1)])
    });

    this.fieldTypes = fieldTypesMock.fieldTypes;
  }

  initQuestions = (qc: number, question = {} as any) => {
    const {
      name = '',
      fieldType = this.fieldType.type,
      position = '',
      required = false,
      multi = false,
      value = 'TF',
      table = []
    } = question;

    return this.fb.group({
      id: [`Q${qc}`],
      name,
      fieldType,
      position,
      required,
      multi,
      value,
      isPublished: [false],
      isPublishedTillSave: [false]
    });
  };

  getQuestions(form) {
    return form.controls.questions.controls;
  }

  addQuestion(index) {
    const control = this.questionForm.get('questions') as FormArray;
    control.insert(index + 1, this.initQuestions(control.length + 1));
  }

  deleteQuestion(index) {
    const control = this.questionForm.get('questions') as FormArray;
    control.removeAt(index);
  }

  getFieldTypeImage(type) {
    return type ? `assets/rdf-forms-icons/fieldType-icons/${type}.svg` : null;
  }

  getFieldTypeDescription(type) {
    console.log(type);
    console.log(this.fieldTypes);
    return type
      ? this.fieldTypes.find((field) => field.type === type)?.description
      : null;
  }

  openResponseTypeModal(question) {
    const dialogRef = this.dialog.open(ResponseTypeComponent, {
      data: {
        question,
        fieldTypes: this.fieldTypes
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  insertImageHandler(event, question) {
    let base64: string;
    const { files } = event.target as HTMLInputElement;
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onloadend = () => {
      base64 = reader.result as string;
      const image = base64.split(',')[1];
      const value = {
        name: files[0].name,
        size: (files[0].size / 1024).toFixed(2),
        base64: image
      };
      question.get('value').setValue(value);
    };
  }

  getImageSrc(base64) {
    return this.imageUtils.getImageSrc(base64);
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
}
