import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form-configuration',
  templateUrl: './form-configuration.component.html',
  styleUrls: ['./form-configuration.component.scss']
})
export class FormConfigurationComponent implements OnInit {
  createForm: FormGroup;
  indexes = [
    {
      pageIndex: 1,
      sectionIndex: [1],
      questionIndex: [1]
    }
  ];
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
  }

  uploadFormImageFile(e) {
    // uploaded image  file code
  }
}
