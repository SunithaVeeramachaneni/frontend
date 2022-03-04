import { Component, OnInit } from '@angular/core';
import { MyOverlayRef } from '../../myoverlay-ref';

@Component({
  selector: 'app-del-category',
  templateUrl: './delete-category.component.html'
})
export class DeleteCategoryComponent implements OnInit {
  constructor(public ref: MyOverlayRef) {}

  ngOnInit() {
    // do nothing
  }

  close(value: string) {
    this.ref.data.selectedButton = value;
    this.ref.close(this.ref);
  }
}
