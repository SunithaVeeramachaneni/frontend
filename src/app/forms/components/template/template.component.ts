import {
  Component,
  ElementRef,
  Input,
  OnInit,
  QueryList,
  ViewChildren,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { tap } from 'rxjs/operators';
import { Observable, timer } from 'rxjs';
import { ImageUtils } from 'src/app/shared/utils/imageUtils';
import { fieldTypesMock } from '../response-type/response-types.mock';
import { FormService } from '../../services/form.service';
@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplateComponent implements OnInit {
  @Output() addQuestionEvent: EventEmitter<number> = new EventEmitter();
  @ViewChildren('insertImages') private insertImages: QueryList<ElementRef>;

  @Input() set questionData(data) {
    this.questionInfo = data;
    this.questionForm.setValue(this.questionInfo);
  }
  get questionData() {
    return this.questionInfo;
  }

  questionInfo;
  fieldType = { type: 'TF', description: 'Text Answer' };
  fieldTypes: any = [this.fieldType];
  fieldContentOpenState = false;
  currentQuestion: any;
  openResponseTypeModal$: Observable<boolean>;

  questionForm: FormGroup = this.fb.group({
    sectionId: '',
    index: '',
    id: '',
    name: '',
    fieldType: 'TF',
    position: 1,
    required: false,
    multi: false,
    value: '',
    isPublished: false,
    isPublishedTillSave: false
  });

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private imageUtils: ImageUtils,
    private formService: FormService
  ) {}

  ngOnInit(): void {
    this.fieldTypes = fieldTypesMock.fieldTypes;
    this.openResponseTypeModal$ = this.formService.openResponseType$;
  }

  addQuestion(index) {
    this.addQuestionEvent.emit(index);
  }

  deleteQuestion() {}

  selectFieldTypeEventHandler(fieldType) {
    if (fieldType.type === this.questionForm.get('fieldType').value) {
      return;
    }

    this.currentQuestion = this.questionInfo;
    this.questionForm.get('fieldType').setValue(fieldType.type);
    this.questionForm.get('required').setValue(false);
    this.questionForm.get('value').setValue('');
    this.openResponseTypeModal$ = this.formService.openResponseType$;

    switch (fieldType.type) {
      case 'TF':
        this.questionForm.get('value').setValue('TF');
        break;
      case 'VI':
        //this.isCustomizerOpen = true;
        this.questionForm.get('value').setValue([]);
        break;
      case 'RT':
        //this.isCustomizerOpen = true;
        const sliderValue = {
          value: 0,
          min: 0,
          max: 100,
          increment: 1
        };
        this.questionForm.get('value').setValue(sliderValue);
        //this.sliderOptions = sliderValue;
        break;
      case 'IMG':
        let index = 0;
        let found = false;
        if (
          this.questionForm.get('id').value === this.currentQuestion.value.id
        ) {
          found = true;
        }
        if (!found && this.questionForm.get('fieldType').value === 'IMG') {
          index++;
        }

        timer(0)
          .pipe(
            tap(() => {
              this.insertImages.toArray()[index]?.nativeElement.click();
            })
          )
          .subscribe();
        break;
      default:
      // do nothing
    }
  }

  sliderOpen() {
    this.formService.setsliderOpenState(true);
  }

  insertImageHandler(event) {
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
      this.currentQuestion.get('value').setValue(value);
    };
  }

  getImageSrc(base64) {
    return this.imageUtils.getImageSrc(base64);
  }

  toggleFieldContentOpenState() {
    this.fieldContentOpenState = true;
  }
}
