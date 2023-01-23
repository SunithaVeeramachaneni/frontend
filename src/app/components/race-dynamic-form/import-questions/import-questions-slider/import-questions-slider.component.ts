import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddPageOrSelectExistingPageModalComponent } from '../add-page-or-select-existing-page-modal/add-page-or-select-existing-page-modal.component';

@Component({
  selector: 'app-import-questions-slider',
  templateUrl: './import-questions-slider.component.html',
  styleUrls: ['./import-questions-slider.component.scss']
})
export class ImportQuestionsSliderComponent implements OnInit {
  @Input() selectedFormName;
  @Input() selectedFormData;
  @Input() currentFormData;
  @Output() cancelSliderEvent: EventEmitter<boolean> = new EventEmitter();

  constructor(private modal: MatDialog) {}

  ngOnInit(): void {}

  useForm() {
    const listOfPages = [];
    const newArray = [];
    this.selectedFormData.forEach((page) => {
      page.sections.forEach((section) => {
        if (section.checked === true) {
          newArray.push(section);
        }
        if (section.checked === false) {
          const newQuestion = [];
          section.questions.forEach((question) => {
            if (question.checked === true) {
              newQuestion.push(question);
            }
          });
          if (newQuestion.length) {
            const filteredSection = {
              name: section.name,
              questions: newQuestion
            };
            newArray.push(filteredSection);
          }
        }
      });
    });

    console.log(newArray);

    const dialogRef = this.modal.open(
      AddPageOrSelectExistingPageModalComponent,
      {
        data: this.currentFormData
      }
    );

    dialogRef.afterClosed().subscribe((data) => {
      if (data.selectedPageOption === 'new') {
        // push data to new pages
      } else if (data.selectedPageOption === 'existing') {
        // push data to the selectedPage
      }
      this.cancelSliderEvent.emit(false);
    });
  }

  cancel() {
    this.cancelSliderEvent.emit(false);
  }

  updateAllChecked(checked, question, section) {
    question.checked = checked;
    const countOfChecked = section.questions.filter(
      (per) => per.checked
    ).length;
    if (countOfChecked === 0 || countOfChecked !== section.questions.length)
      section.checked = false;
    if (countOfChecked === section.questions.length) section.checked = true;
  }

  setAllChecked(checked, section) {
    section.checked = checked;
    if (section.questions == null) {
      return;
    }
    section.questions.forEach((t) => (t.checked = checked));
  }

  fewComplete(section) {
    if (section.questions === null) {
      return false;
    }
    const checkedCount = section.questions.filter((p) => p.checked).length;

    return checkedCount > 0 && checkedCount !== section.questions.length;
  }
}
