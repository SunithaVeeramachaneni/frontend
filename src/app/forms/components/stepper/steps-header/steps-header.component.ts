import {
  Component,
  OnInit,
  Inject,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Step } from 'src/app/interfaces/stepper';

@Component({
  selector: 'app-steps-header',
  templateUrl: './steps-header.component.html',
  styleUrls: ['./steps-header.component.scss']
})
export class StepsHeaderComponent implements OnInit {
  @Input() steps: Step[];
  @Input() currentStep = 0;
  @Input() showGoBack?: boolean;
  @Output() gotoStep = new EventEmitter<number>();
  @Output() goBack = new EventEmitter<void>();
  constructor(
    public dialogRef: MatDialogRef<StepsHeaderComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  ngOnInit(): void {}
  onCancel(): void {
    this.dialogRef.close();
  }

  onGotoStep(step): void {
    this.gotoStep.emit(step);
  }
}
