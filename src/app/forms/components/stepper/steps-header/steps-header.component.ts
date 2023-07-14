import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { Step } from 'src/app/interfaces/stepper';

@Component({
  selector: 'app-steps-header',
  templateUrl: './steps-header.component.html',
  styleUrls: ['./steps-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StepsHeaderComponent implements OnInit {
  @Input() steps: Step[];
  @Input() currentStep = 0;
  @Input() showGoBack?: boolean;
  @Output() gotoStep = new EventEmitter<number>();
  @Output() goBack = new EventEmitter<void>();
  constructor() {}

  ngOnInit(): void {}

  onGotoStep(step): void {
    this.gotoStep.emit(step);
  }

  onGoBack(step): void {
    this.goBack.emit(step);
  }
}
