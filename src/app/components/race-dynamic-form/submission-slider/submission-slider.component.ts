import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SubmissionViewComponent } from '../submission-view/submission-view.component';

@Component({
  selector: 'app-submission-slider',
  templateUrl: './submission-slider.component.html',
  styleUrls: ['./submission-slider.component.scss']
})
export class SubmissionSliderComponent implements OnInit, OnChanges {
  @Input()
  submission: any;

  // @HostListener('click', ['$event.target'])
  @Output()
  slideInOut: EventEmitter<any> = new EventEmitter();

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  cancelForm() {
    this.slideInOut.emit('out');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.submission && changes.submission.currentValue) {
      this.submission = changes.submission.currentValue;
    }
  }

  navigateView() {
    this.slideInOut.emit('out');

    const dialogRef = this.dialog.open(SubmissionViewComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
      panelClass: 'full-screen-modal',
      data: this.submission
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.slideInOut.emit('out');
    });
  }
}
