import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-task-level-task-components',
  templateUrl: './task-level-task-components.component.html',
  styleUrls: ['./task-level-task-components.component.scss']
})
export class TaskLevelTaskComponentsComponent implements OnInit {
  @Input() selectedPage: any;
  @Input() set checkboxStatus(checkboxStatus: any) {
    console.log('inside task-levelTask:', checkboxStatus);
    this._checkboxStatus = checkboxStatus;
  }
  get checkboxStatus() {
    return this._checkboxStatus;
  }

  private _checkboxStatus: any;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}
}

// import { Component, OnInit, Input } from '@angular/core';
// import { FormGroup, FormBuilder } from '@angular/forms';
// import { isEqual } from 'lodash-es';

// @Component({
//   selector: 'app-task-level-mid-panel-pages',
//   templateUrl: './task-level-mid-panel-pages.component.html',
//   styleUrls: ['./task-level-mid-panel-pages.component.scss']
// })
// export class TaskLevelMidPanelPagesComponent implements OnInit {
//   questionToSectionId: Map<number, any[]> = new Map();
//   constructor(private fb: FormBuilder) {}
//   @Input() set checkboxStatus(checkboxStatus: any) {
//     console.log('checkboxStatusinside pages:', checkboxStatus);
//     this._checkboxStatus = checkboxStatus;
//   }
//   get checkboxStatus() {
//     return this._checkboxStatus;
//   }
//   @Input() set page(page: any) {
//     if (page) {
//       if (!isEqual(this.page, page)) {
//         this._page = page;
//         this.pageForm.patchValue(page, {
//           emitEvent: false
//         });
//       }
//       this.questionToSectionId = this.mapQuestionToSection(page.questions);
//     }
//   }
//   get page() {
//     return this._page;
//   }

//   private _page: any;
//   private _checkboxStatus: any;
//   pageForm: FormGroup = this.fb.group({
//     name: {
//       value: '',
//       disabled: true
//     },
//     position: '',
//     isOpen: true
//   });

//   ngOnInit(): void {}

//   toggleIsOpenState = () => {
//     this.pageForm.get('isOpen').setValue(!this.pageForm.get('isOpen').value);
//   };

//   mapQuestionToSection(questions: any[]) {
//     const questionMap = new Map<number, any[]>();
//     questions.forEach((question) => {
//       if (!questionMap.has(question.sectionId)) {
//         questionMap.set(question.sectionId, []);
//       }
//       questionMap.get(question.sectionId)!.push(question);
//     });
//     return questionMap;
//   }
// }

//////////////////

// import { Component, OnInit, Input } from '@angular/core';
// import { FormGroup, FormBuilder } from '@angular/forms';
// import { isEqual } from 'lodash-es';

// @Component({
//   selector: 'app-task-level-mid-panel-section',
//   templateUrl: './task-level-mid-panel-section.component.html',
//   styleUrls: ['./task-level-mid-panel-section.component.scss']
// })
// export class TaskLevelMidPanelSectionComponent implements OnInit {
//   @Input() set question(question: any) {
//     this._question = question;
//   }
//   get question() {
//     return this._question;
//   }

//   @Input() set section(section: any) {
//     if (section) {
//       if (!isEqual(this.section, section)) {
//         this._section = section;
//         this.sectionForm.patchValue(section, {
//           emitEvent: false
//         });
//       }
//     }
//   }
//   get section() {
//     return this._section;
//   }
//   private _section: any;
//   private _question: any;
//   sectionForm: FormGroup = this.fb.group({
//     id: '',
//     name: {
//       value: '',
//       disabled: true
//     },
//     position: '',
//     isOpen: true,
//     isImported: false,
//     templateId: '',
//     templateName: '',
//     externalSectionId: ''
//   });

//   constructor(private fb: FormBuilder) {}

//   ngOnInit(): void {}

//   toggleIsOpenState = () => {
//     this.sectionForm
//       .get('isOpen')
//       .setValue(!this.sectionForm.get('isOpen').value);
//   };
// }

////

// import { Component, OnInit, Input } from '@angular/core';
// import { FormGroup, FormBuilder } from '@angular/forms';
// import { isEqual } from 'lodash-es';
// import { NumberRangeMetadata } from 'src/app/interfaces';
// @Component({
//   selector: 'app-task-leve-mid-panel-question-components',
//   templateUrl: './task-leve-mid-panel-question-components.component.html',
//   styleUrls: ['./task-leve-mid-panel-question-components.component.scss']
// })
// export class TaskLeveMidPanelQuestionComponentsComponent implements OnInit {
//   questionForm: FormGroup = this.fb.group({
//     id: '',
//     sectionId: '',
//     name: '',
//     fieldType: 'TF',
//     position: '',
//     required: false,
//     enableHistory: false,
//     multi: false,
//     value: 'TF',
//     isPublished: false,
//     isPublishedTillSave: false,
//     isOpen: false,
//     isResponseTypeModalOpen: false,
//     unitOfMeasurement: 'None',
//     rangeMetadata: {} as NumberRangeMetadata
//   });
//   @Input() set question(question: any) {
//     if (question) {
//       if (!isEqual(this.question, question)) {
//         this._question = question;
//         this.questionForm.patchValue(question, {
//           emitEvent: false
//         });
//       }
//     }
//   }

//   get question() {
//     return this._question;
//   }
//   private _question: any;
//   constructor(private fb: FormBuilder) {}

//   ngOnInit(): void {}
// }
