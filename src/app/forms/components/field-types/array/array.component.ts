import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-array',
  templateUrl: './array.component.html',
  styleUrls: ['./array.component.scss']
})
export class ArrayComponent implements OnInit {
  @Input() questionForm;
  @Input() fieldTypes;

  arrayFields = [];

  constructor() {}

  ngOnInit(): void {}

  addSubField() {
    this.arrayFields.push({
      question: '',
      fieldTye: 'LF'
    });
  }

  delete(index) {
    this.arrayFields.splice(index, 1);
  }
}
