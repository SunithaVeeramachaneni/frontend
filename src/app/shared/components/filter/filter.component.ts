import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit, OnChanges {

  @Input()
  json: any[] = [];

  @Output()
  close: EventEmitter<any> = new EventEmitter();

  @Output()
  apply: EventEmitter<any> = new EventEmitter();

  @Output()
  reset: EventEmitter<any> = new EventEmitter();

  constructor() {}
  ngOnChanges(changes: SimpleChanges): void { 
    if (changes.json && changes.json.currentValue) {
      this.json = changes.json.currentValue;
    }
  }

  ngOnInit(): void {}

  closeFilter() {
    this.close.emit();
  }

  applyFilter() {
    this.apply.emit(this.json);
  }
  resetFilter() {
    for (const item of this.json) {
      item.value = '';
    }
    this.reset.emit(this.json);
  }
}
