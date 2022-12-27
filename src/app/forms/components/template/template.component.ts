import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export class TemplateComponent implements OnInit {
  constructor() {}

  setmethods = false;

  ngOnInit(): void {}

  openDrawer(): void {
    this.setmethods = true;
  }
}
