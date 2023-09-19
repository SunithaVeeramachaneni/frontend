import {
  ChangeDetectorRef,
  Component,
  ContentChild,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { Step } from 'src/app/interfaces/stepper';

@Component({
  selector: 'app-dynamic-stepper',
  templateUrl: './dynamic-stepper.component.html',
  styleUrls: ['./dynamic-stepper.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DynamicStepperComponent implements OnInit, OnChanges {
  @Input() steps: Step[];
  @Input() currentStep = 0;
  @Input() showGoBack?: boolean;
  @Input() moduleName: string;
  @Output() goBack = new EventEmitter<void>();
  @Output() gotoNextStep = new EventEmitter<void>();
  @Output() gotoPreviousStep = new EventEmitter<void>();
  @Output() gotoStep = new EventEmitter<number>();
  @Output() confirmLastStep = new EventEmitter<void>();

  @ContentChild('stepsHeader', { read: TemplateRef })
  stepsHeader: TemplateRef<any>;
  @ContentChild('stepsContent', { read: TemplateRef })
  stepsContent: TemplateRef<any>;
  totalSteps: number;

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  onGotoStep(step): void {
    this.gotoStep.emit(step);
  }

  onGotoNextStep(): void {
    this.gotoNextStep.emit();
  }

  onGotoPreviousStep(): void {
    if (this.currentStep === 0) {
      return;
    }
    this.gotoPreviousStep.emit();
  }

  ngOnInit(): void {
    this.totalSteps = this.steps ? this.steps.length : 0;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.currentStep && changes.currentStep.currentValue) {
      this.changeDetectorRef.detectChanges(); // Run change detection so the change in the animation direction registered
    }
  }
}
