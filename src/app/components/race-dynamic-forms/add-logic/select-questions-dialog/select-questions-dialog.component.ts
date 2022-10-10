import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RdfService } from '../../services/rdf.service';

@Component({
  selector: 'app-select-questions-dialog',
  templateUrl: 'select-questions-dialog.component.html',
  styleUrls: ['./select-questions-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectQuestionsDialogComponent implements OnInit {
  sections = [];
  selectedQuestions = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private rdfService: RdfService,
    private dialogRef: MatDialogRef<any>
  ) {}

  ngOnInit() {
    this.sections = [];
    const tempSections = this.rdfService.getCurrentFormValue().sections;
    this.sections = [...tempSections];
    if (this.data.viewMode === 'MANDATE') {
      const mandatedQuestions = this.data.logic.mandateQuestions || [];
      this.selectedQuestions = this.selectedQuestions.concat(mandatedQuestions);
    } else if (this.data.viewMode === 'HIDE') {
      const hideQuestions = this.data.logic.hideQuestions || [];
      this.selectedQuestions = this.selectedQuestions.concat(hideQuestions);
    }
  }

  selectQuestion(checked: boolean, questionId: string) {
    if (checked) {
      this.selectedQuestions.push(questionId);
    } else {
      const index = this.selectedQuestions.indexOf(questionId);
      if (index > -1) {
        this.selectedQuestions.splice(index, 1);
      }
    }
  }

  close() {
    this.dialogRef.close();
  }
  submit() {
    this.dialogRef.close({
      selectedQuestions: this.selectedQuestions,
      type: this.data.viewMode
    });
  }
}
