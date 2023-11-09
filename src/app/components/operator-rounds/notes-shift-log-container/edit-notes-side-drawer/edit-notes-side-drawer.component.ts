import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationError } from 'src/app/interfaces';
import { FormValidationUtil } from 'src/app/shared/utils/formValidationUtil';
import { WhiteSpaceValidator } from 'src/app/shared/validators/white-space-validator';
import { ShrService } from '../../services/shr.service';

@Component({
  selector: 'app-edit-notes-side-drawer',
  templateUrl: './edit-notes-side-drawer.component.html',
  styleUrls: ['./edit-notes-side-drawer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditNotesSideDrawerComponent implements OnInit {
  @Input() isLog: boolean;
  @Input() shrId: string;
  @Input() set noteEditData(data: any) {
    if (data) {
      this._noteEditData = data;
      this.notesForm.patchValue({
        title: data.title,
        description: data?.description || ''
      });
    }
  }

  get noteEditData() {
    return this._noteEditData;
  }

  @Output() slideInOut: EventEmitter<any> = new EventEmitter();
  @Output() updateNote: EventEmitter<any> = new EventEmitter();

  errors: ValidationError = {};
  notesForm: FormGroup;

  private _noteEditData: any;

  constructor(
    private fb: FormBuilder,
    private formValidationUtil: FormValidationUtil,
    private shrService: ShrService
  ) {}

  ngOnInit(): void {
    this.notesForm = this.fb.group({
      title: [
        '',
        [
          Validators.required,
          WhiteSpaceValidator.trimWhiteSpace,
          WhiteSpaceValidator.whiteSpace
        ]
      ],
      description: [
        '',
        [WhiteSpaceValidator.trimWhiteSpace, WhiteSpaceValidator.whiteSpace]
      ]
    });
  }

  update() {
    if (this.isLog) {
      this.shrService
        .updateSupervisorLogs$(
          this.noteEditData.id,
          {
            title: this.notesForm.get('title').value,
            description: this.notesForm.get('description').value,
            shrId: this.shrId
          },
          { displayToast: true, failureResponse: {} }
        )
        .subscribe(() => {
          this.updateNote.emit({
            title: this.notesForm.get('title').value,
            description: this.notesForm.get('description').value,
            id: this.noteEditData.id
          });
          this.notesForm.reset();
          this.slideInOut.emit('out');
        });
    } else {
      this.shrService
        .updateNotes$(
          this.noteEditData.id,
          {
            title: this.notesForm.get('title').value,
            shrId: this.shrId,
            questionId: this.noteEditData.questionId
          },
          { displayToast: true, failureResponse: {} }
        )
        .subscribe(() => {
          this.updateNote.emit({
            title: this.notesForm.get('title').value,
            id: this.noteEditData.id
          });
          this.notesForm.reset();
          this.slideInOut.emit('out');
        });
    }
  }

  cancel() {
    this.notesForm.reset();
    this.slideInOut.emit('out');
  }

  processValidationErrors(controlName: string): boolean {
    return this.formValidationUtil.processValidationErrors(
      controlName,
      this.notesForm,
      this.errors
    );
  }
}
