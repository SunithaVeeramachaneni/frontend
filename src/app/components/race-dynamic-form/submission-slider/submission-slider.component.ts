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
import { Router } from '@angular/router';

@Component({
  selector: 'app-submission-slider',
  templateUrl: './submission-slider.component.html',
  styleUrls: ['./submission-slider.component.scss']
})
export class SubmissionSliderComponent implements OnInit, OnChanges {
  @Input()
  submission: any;

  @HostListener('click', ['$event.target'])
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
      console.log(this.submission);
    }
  }

  navigateView() {
    this.router.navigate(['/forms/submissions/view/'+this.submission.id]);
  }
}
