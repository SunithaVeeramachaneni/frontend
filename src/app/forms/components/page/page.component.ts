import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit {
  isPageOpenState = true;
  pageForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.pageForm = this.fb.group({
      id: [''],
      name: ['']
    });
  }

  togglePageOpenState() {
    this.isPageOpenState = !this.isPageOpenState;
  }

  getSize(value) {
    if (value && value === value.toUpperCase()) {
      return value.length;
    }
    return value ? value.length - 3 : -1;
  }
}
