import { Component, Input, OnInit } from '@angular/core';
import { Instruction } from '../../../interfaces';

@Component({
  selector: 'app-dummy',
  template: '',
  styleUrls: []
})
export class DummyComponent implements OnInit {

  @Input() value: Instruction[];

  constructor() { }

  ngOnInit(): void {
  }

}
