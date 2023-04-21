import { Component, OnInit } from '@angular/core';
interface Response {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-create-table',
  templateUrl: './create-table.component.html',
  styleUrls: ['./create-table.component.scss']
})
export class CreateTableComponent implements OnInit {
  responses: Response[] = [
    { value: 'text-0', viewValue: 'Text' },
    { value: 'number-1', viewValue: 'Number' },
    { value: 'checkbox-3', viewValue: 'Checkbox' }
  ];
  constructor() {}

  ngOnInit(): void {}
}
