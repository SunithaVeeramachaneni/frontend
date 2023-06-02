import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-round-observations',
  templateUrl: './round-observations.component.html',
  styleUrls: ['./round-observations.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoundObservationsComponent implements OnInit {
  moduleName = 'round-observations';
  constructor() {}

  ngOnInit(): void {}
}
