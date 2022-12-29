import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form-configuration',
  templateUrl: './form-configuration.component.html',
  styleUrls: ['./form-configuration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormConfigurationComponent implements OnInit {
  createForm: FormGroup;
  form = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.createForm = this.fb.group({
      id: [''],
      name: [''],
      description: [''],
      counter: [1],
      isPublished: [false],
      isPublishedTillSave: [false]
    });

    this.form = [...this.form, this.getDefaultFormObject()];
  }

  getDefaultFormObject() {
    return {
      name: '',
      position: this.form.length + 1,
      sections: [
        {
          id: 1,
          name: 'Section 1',
          position: 1
        }
      ],
      questions: [
        {
          sectionId: 1,
          id: 1,
          name: '',
          fieldType: 'RT',
          position: '',
          required: false,
          multi: false,
          value: '',
          isPublished: false,
          isPublishedTillSave: false
        }
      ]
    };
  }

  getPages() {
    return this.form;
  }

  getSections(pageId) {
    return this.form[pageId].sections;
  }

  getSectionQuestions(pageId, sectionId) {
    return this.form[pageId].questions.filter(
      (question) => question.sectionId === sectionId
    );
  }

  getPageData(pageIndex) {
    const { name } = this.form[pageIndex];
    return { name, index: pageIndex };
  }

  getSectionData(pageIndex, sectionIndex) {
    const { id, name, position } = this.form[pageIndex].sections[sectionIndex];
    return { id, name, position, index: sectionIndex };
  }

  getQuestionData(pageIndex, questionIndex, sectionId) {
    const {
      id,
      name,
      fieldType,
      position,
      required,
      multi,
      value,
      isPublished,
      isPublishedTillSave
    } = this.form[pageIndex].questions[questionIndex];
    return {
      sectionId,
      index: questionIndex,
      id,
      name,
      fieldType,
      position,
      required,
      multi,
      value,
      isPublished,
      isPublishedTillSave
    };
  }

  addPageEventHandler(pageIndex) {
    this.form.splice(pageIndex + 1, 0, this.getDefaultFormObject());
  }

  addSectionEventHandler(sectionIndex, pageIndex) {
    this.form[pageIndex].sections.splice(sectionIndex + 1, 0, {
      id: this.form[pageIndex].sections.length + 1,
      name: `Section ${this.form[pageIndex].sections.length + 1}`,
      position: this.form[pageIndex].sections.length + 1
    });
  }

  addQuestionEventHandler(questionIndex, pageIndex, sectionId) {
    this.form[pageIndex].questions.splice(questionIndex + 1, 0, {
      id: this.form[pageIndex].questions.length + 1,
      sectionId,
      name: '',
      position: this.form[pageIndex].questions.length + 1,
      fieldType: 'TF',
      required: false,
      multi: false,
      value: '',
      isPublished: false,
      isPublishedTillSave: false
    });
  }

  uploadFormImageFile(e) {
    // uploaded image  file code
  }
}
