import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageComponent implements OnInit {
  @Input() set pageData(data) {
    this.pageInfo = data;
    this.pageForm.setValue(data);
  }
  get pageData() {
    return this.pageInfo;
  }

  @Output() addPageEvent: EventEmitter<number> = new EventEmitter();

  isPageOpenState = true;
  pageForm: FormGroup = this.fb.group({
    name: '',
    index: ''
  });
  pageInfo;

  constructor(private fb: FormBuilder, private route: ActivatedRoute) {}

  ngOnInit() {}

  addPage(index) {
    this.addPageEvent.emit(index);
  }

  togglePageOpenState = (idx: number) => {
    this.isPageOpenState = !this.isPageOpenState;
  };

  deletePage() {
    //delete
  }
}
