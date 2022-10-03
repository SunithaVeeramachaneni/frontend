import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-create-form',
  templateUrl: './create-form.component.html',
  styleUrls: ['./create-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateFormComponent implements OnInit {
  public createForm: FormGroup;
  isOpenState = true;
  isSectionNameEditMode = false;
  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.createForm = this.fb.group({
      formTitle: [''],
      formDescription: [''],
      sections: this.fb.group({
        sectionName: [''],
        questions: this.fb.group({
          questionName: [''],
          responseType: ['']
        })
      })
    });
  }

  titleChange(value) {
    console.log(value);
  }

  sectionChange(sectionname) {
    console.log(sectionname);
  }

  publishInstruction() {
    console.log('published');
  }
}
