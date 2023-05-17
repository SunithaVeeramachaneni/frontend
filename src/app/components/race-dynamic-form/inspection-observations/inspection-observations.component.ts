import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-inspection-observations',
  templateUrl: './inspection-observations.component.html',
  styleUrls: ['./inspection-observations.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InspectionObservationsComponent implements OnInit {
  moduleName = 'inspection-observations';
  constructor() {}

  ngOnInit(): void {}
}
