import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-submission-slider',
  templateUrl: './submission-slider.component.html',
  styleUrls: ['./submission-slider.component.scss']
})
export class SubmissionSliderComponent implements OnInit, OnChanges {
  @Input()
  submission: any;
  @Output()
  slideInOut: EventEmitter<any> = new EventEmitter();

  constructor(private router: Router) {}

  ngOnInit(): void {}

  cancelForm() {
    this.slideInOut.emit('in');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.submission && changes.submission.currentValue) {
      this.submission = changes.submission.currentValue;
    }
  }

  navigateView() {
    this.cancelForm();
    // this.router.navigate(['/forms/submissions/view/'+this.submission.id]);
  }
}
