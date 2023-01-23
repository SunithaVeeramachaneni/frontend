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
    let tempObj = JSON.parse(JSON.stringify(this.selectedFormData));
    tempObj.forEach((page) => {
      page.sections = page.sections.filter((section) => {
        section.questions = section.questions.filter(
          (question) => question.checked === true
        );
        if (section.questions.length) return true;
        return false;
      });
    });

    tempObj = tempObj.filter((page) => page.sections.length);

    console.log(tempObj);

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

  updateAllChecked(checked, question, section, page) {
    question.checked = checked;
    const countOfSectionChecked = section.questions.filter(
      (per) => per.checked
    ).length;

    const countOfPageChecked = page.sections.filter((p) => p.checked).length;

    if (
      countOfSectionChecked === 0 ||
      countOfSectionChecked !== section.questions.length
    )
      section.checked = false;
    if (countOfSectionChecked === section.questions.length)
      section.checked = true;

    if (countOfPageChecked === 0 || countOfPageChecked !== page.sections.length)
      page.checked = false;
    if (countOfPageChecked === page.sections.length) page.checked = true;
  }

  setAllChecked(checked, page) {
    page.checked = checked;
    page.sections.forEach((section) => {
      section.checked = checked;
      section.questions.forEach((t) => (t.checked = checked));
    });
  }

  setAllSectionChecked(checked, section) {
    section.checked = checked;
    section.questions.forEach((t) => (t.checked = checked));
  }

  fewSectionComplete(section, page) {
    const checkedCount = section.questions.filter((p) => p.checked).length;
    const countOfPageChecked = page.sections.filter((p) => p.checked).length;

    if (countOfPageChecked === 0 || countOfPageChecked !== page.sections.length)
      page.checked = false;
    if (countOfPageChecked === page.sections.length) page.checked = true;

    return checkedCount > 0 && checkedCount !== section.questions.length;
  }

  fewComplete(page) {
    const checkedCount = page.sections.filter((p) => p.checked).length;

    return checkedCount > 0 && checkedCount !== page.sections.length;
  }
}
