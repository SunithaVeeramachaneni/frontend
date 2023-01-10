import {
  Component,
  EventEmitter,
  HostListener,
  OnInit,
  Output
} from '@angular/core';

@Component({
  selector: 'app-submission-slider',
  templateUrl: './submission-slider.component.html',
  styleUrls: ['./submission-slider.component.scss']
})
export class SubmissionSliderComponent implements OnInit {
  @HostListener('click', ['$event.target'])
  @Output()
  slideInOut: EventEmitter<any> = new EventEmitter();
  ngOnInit(): void {}

  cancelForm() {
    this.slideInOut.emit('in');
  }
}
