import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/compiler/src/core';
import { FormService } from '../../services/form.service';

@Component({
  selector: 'app-master-data-slider',
  templateUrl: './master-data-slider.component.html',
  styleUrls: ['./master-data-slider.component.scss']
})
export class MasterDataSliderComponent implements OnInit {
  @Output() slideInOut: EventEmitter<any> = new EventEmitter();

  labels = [];
  primaryResponses = [];
  secondaryResponses = [];

  constructor(private formService: FormService) {}

  ngOnInit(): void {
    // this.getLabels();
    //this.service.fetchAllPlants().subscribe(data=>console.log(data));
  }

  getLabels() {
    this.formService.getTable().subscribe((data) => {
      Object.keys(data[0]).forEach((key) => {
        this.labels.push(data[0][key]);
      });
      console.log(this.labels);
    });
  }

  getLabelsResponses(label) {
    console.log(label);
    const data = this.labels.find(
      (l) =>
        l.name.toLowerCase().trim() === label.toString().toLowerCase().trim()
    );
    console.log(data);
    this.primaryResponses = data['columns'].filter((r) => r.isKeyField);
    this.secondaryResponses = data['columns'].filter((r) => !r.isKeyField);
  }

  cancel(): void {
    this.slideInOut.emit('out');
  }
}
