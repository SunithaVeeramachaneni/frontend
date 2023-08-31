import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { OperatorRoundsService } from '../services/operator-rounds.service';

@Component({
  selector: 'app-task-level-task-components',
  templateUrl: './task-level-task-components.component.html',
  styleUrls: ['./task-level-task-components.component.scss']
})
export class TaskLevelTaskComponentsComponent implements OnInit {
  @Input() selectedNodeId: any;
  @Input() set selectedPage(selectedPage: any) {
    if (selectedPage) {
      this._selectedPage = selectedPage;
      this.questionToSection = this.mapQuestionToSection(this.selectedPage);
    }
  }
  get selectedPage() {
    return this._selectedPage;
  }

  @Input() set checkboxStatus(checkboxStatus: any) {
    this._checkboxStatus = checkboxStatus;
  }
  get checkboxStatus() {
    return this._checkboxStatus;
  }
  questionToSection = new Map<number, any[]>();
  allCheckedSection: boolean = false;
  partiallyFilledSection: boolean = false;
  private _checkboxStatus: any;
  private _selectedPage: any;
  constructor(
    private fb: FormBuilder,
    private operatorRoundService: OperatorRoundsService
  ) {}
  ngOnInit() {}
  questionToSectionId: Map<number, any[]> = new Map();
  pageForm: FormGroup = this.fb.group({
    name: {
      value: '',
      disabled: true
    },
    isOpen: true
  });

  sectionForm: FormGroup = this.fb.group({
    id: '',
    name: {
      value: '',
      disabled: true
    },
    isOpen: true
  });

  toggleIsOpenState = () => {
    this.pageForm.get('isOpen').setValue(!this.pageForm.get('isOpen').value);
  };

  mapQuestionToSection(pages: any[]) {
    const questionMap = new Map<number, any[]>();
    pages.forEach((pages) => {
      pages.questions.forEach((question) => {
        if (!questionMap.has(question.sectionId)) {
          questionMap.set(question.sectionId, []);
        }
        questionMap.get(question.sectionId)!.push(question);
      });
    });
    return questionMap;
  }
  someCompleteSection(page) {
    if (!page.sections) return false;

    return page.sections.filter((t) => t.complete).length > 0 && !page.complete;
  }

  toggleAllSectionCheckbox(checkedstatus, page) {
    page.complete = checkedstatus;
    page.partiallyChecked = false;
    page.sections.forEach((section) => {
      section.complete = checkedstatus;
      section.partiallyChecked = false;
    });
    page.questions.forEach((question) => {
      question.complete = checkedstatus;
    });
    this.operatorRoundService.setCheckBoxStatus({
      selectedPage: this.selectedPage,
      nodeId: this.selectedNodeId
    });
  }
  toggleAllSectionQuestion(checkboxStatus, section, page) {
    section.complete = checkboxStatus;
    this.questionToSection.get(section.id).forEach((question) => {
      question.complete = checkboxStatus;
    });
    page.complete =
      page.sections != null && page.sections.every((t) => t.complete);

    page.partiallyChecked =
      page.sections.filter((t) => t.complete).length > 0 && !page.complete;
    this.operatorRoundService.setCheckBoxStatus({
      selectedPage: this.selectedPage,
      nodeId: this.selectedNodeId
    });
  }
  toggleAllQuestion(checkboxStatus, question, section, page) {
    this.questionToSection.get(question.sectionId).forEach((ques) => {
      if (ques.id === question.id) {
        ques.complete = checkboxStatus;
      }
    });

    section.complete =
      this.questionToSection.get(question.sectionId) !== null &&
      this.questionToSection.get(question.sectionId).every((t) => t.complete);
    section.partiallyChecked =
      this.questionToSection.get(question.sectionId).filter((t) => t.complete)
        .length > 0 && !section.complete;

    page.complete =
      page.sections != null && page.sections.every((t) => t.complete);

    page.partiallyChecked =
      (page.sections.filter((t) => t.complete).length > 0 ||
        page.sections.filter((t) => t.partiallyChecked).length > 0) &&
      !page.complete;
    this.operatorRoundService.setCheckBoxStatus({
      selectedPage: this.selectedPage,
      nodeId: this.selectedNodeId
    });
  }
}
