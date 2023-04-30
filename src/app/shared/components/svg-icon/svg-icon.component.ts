import { Component, Input } from '@angular/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'svg-icon',
  styleUrls: ['./svg-icon.component.scss'],
  templateUrl: './svg-icon.component.html'
})
export class SvgIconComponent {
  @Input() icon: string;
}
