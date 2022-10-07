import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { map } from 'rxjs/operators';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-mcq-response',
  templateUrl: './mcq-response.component.html',
  styleUrls: ['./mcq-response.component.scss']
})
export class McqResponseComponent implements OnInit {
  public responseForm: FormGroup;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.responseForm = this.fb.group({
      responses: this.fb.array([])
    });
  }

  get responses(): FormArray {
    return this.responseForm.get('responses') as FormArray;
  }

  initResponse = () => {
    this.responses.push(
      this.fb.group({
        id: this.responses.value.length + 1,
        title: '',
        color: '',
        score: 0
      })
    );
  };
}
