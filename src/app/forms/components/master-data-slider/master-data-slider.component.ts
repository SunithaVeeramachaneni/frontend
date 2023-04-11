import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/compiler/src/core';

@Component({
  selector: 'app-master-data-slider',
  templateUrl: './master-data-slider.component.html',
  styleUrls: ['./master-data-slider.component.scss']
})
export class MasterDataSliderComponent implements OnInit {
  @Output() slideInOut: EventEmitter<any> = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}

  cancel(): void {
    this.slideInOut.emit('out');
  }
}
