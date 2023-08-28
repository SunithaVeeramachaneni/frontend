import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-task-level-task-components',
  templateUrl: './task-level-task-components.component.html',
  styleUrls: ['./task-level-task-components.component.scss']
})
export class TaskLevelTaskComponentsComponent implements OnInit {
  @Input() selectedPage: any;
  @Input() set checkboxStatus(checkboxStatus: any) {
    console.log('inside task-levelTask:', checkboxStatus);
    this._checkboxStatus = checkboxStatus;
  }
  get checkboxStatus() {
    return this._checkboxStatus;
  }

  private _checkboxStatus: any;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}
}
