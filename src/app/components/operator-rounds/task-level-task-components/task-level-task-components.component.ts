/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-underscore-dangle */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { OperatorRoundsService } from '../services/operator-rounds.service';

@Component({
  selector: 'app-task-level-task-components',
  templateUrl: './task-level-task-components.component.html',
  styleUrls: ['./task-level-task-components.component.scss']
})
export class TaskLevelTaskComponentsComponent implements OnInit {
  @Input() selectedNodeId: any;
  @Input() selectedNode: any;
  @Input() displayTaskLevelConfig: any;
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
  @Output() isOpenThirdPanel: EventEmitter<any> = new EventEmitter();
  @Output() pageDataToThirdPanel: EventEmitter<any> = new EventEmitter();
  questionToSection = new Map<number, any[]>();
  questionToSectionId: Map<number, any[]> = new Map();
  allCheckedSection = false;
  partiallyFilledSection = false;
  private _checkboxStatus: any;
  private _selectedPage: any;
  constructor(private operatorRoundService: OperatorRoundsService) {}

  ngOnInit() {}

  toggleIsOpenStatePage = (page) => {
    page.isOpen = !page.isOpen;
    page.sections.forEach((section) => {
      section.isOpen = !section.isOpen;
    });
  };

  toggleIsOpenStateSection = (section) => {
    section.isOpen = !section.isOpen;
  };

  mapQuestionToSection(pages: any[]) {
    const questionMap = new Map<number, any[]>();
    pages.forEach((page) => {
      page.questions.forEach((question) => {
        if (!questionMap.has(question.sectionId)) {
          questionMap.set(question.sectionId, []);
        }
        questionMap.get(question.sectionId)!.push(question);
      });
    });
    return questionMap;
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
    if (checkedstatus) this.isOpenThirdPanel.emit(true);
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
    if (checkboxStatus) this.isOpenThirdPanel.emit(true);
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

    if (checkboxStatus) this.isOpenThirdPanel.emit(true);
  }
}
