/* eslint-disable @angular-eslint/no-input-rename */
import { Component, Input } from '@angular/core';
import {
  PaginationControlsComponent,
  PaginationControlsDirective
} from 'ngx-pagination';

@Component({
  selector: 'app-custom-pagination-controls',
  templateUrl: './custom-pagination-controls.component.html',
  styleUrls: ['./custom-pagination-controls.component.css']
})
export class CustomPaginationControlsComponent extends PaginationControlsComponent {
  // tslint:disable-next-line: no-input-rename
  @Input('paginationData') p: PaginationControlsDirective;

  constructor() {
    super();
  }
}
