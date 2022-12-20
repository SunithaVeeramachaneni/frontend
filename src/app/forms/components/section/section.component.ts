import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss']
})
export class SectionComponent implements OnInit {
  isSectionOpenState = true;
  sectionForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.sectionForm = this.fb.group({
      id: [''],
      name: [''],
      position: ['']
    });
  }

  togglePageOpenState() {
    this.isSectionOpenState = !this.isSectionOpenState;
  }

  getSize(value) {
    if (value && value === value.toUpperCase()) {
      return value.length;
    }
    return value ? value.length - 3 : -1;
  }
}
