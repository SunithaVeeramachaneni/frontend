import {
  Component,
  EventEmitter,
  HostListener,
  OnInit,
  Output
} from '@angular/core';

@Component({
  selector: 'app-form-detail',
  templateUrl: './form-detail.component.html',
  styleUrls: ['./form-detail.component.scss']
})
export class FormDetailComponent implements OnInit {
  @HostListener('click', ['$event.target'])
  @Output()
  slideInOut: EventEmitter<any> = new EventEmitter();
  setnamevaribale = 'Mid Range Switchgear (Page 1/3)';
  ngOnInit(): void {}

  cancelForm() {
    this.slideInOut.emit('in');
  }

  openMenu(type) {
    this.setnamevaribale = type;
  }
}
