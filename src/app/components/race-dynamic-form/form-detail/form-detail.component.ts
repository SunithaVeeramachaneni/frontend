import { Observable } from 'rxjs';
import { GetFormListQuery } from 'src/app/API.service';
import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { RaceDynamicFormService } from '../services/rdf.service';

@Component({
  selector: 'app-form-detail',
  templateUrl: './form-detail.component.html',
  styleUrls: ['./form-detail.component.scss']
})
export class FormDetailComponent implements OnInit, OnChanges, OnDestroy {
  @HostListener('click', ['$event.target'])
  @Output()
  slideInOut: EventEmitter<any> = new EventEmitter();
  @Input() selectedForm: GetFormListQuery = null;
  setnamevaribale = 'Mid Range Switchgear (Page 1/3)';
  selectedFormDetail$: Observable<any> = null;
  constructor(
    private readonly raceDynamicFormService: RaceDynamicFormService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (this.selectedForm) {
      this.selectedFormDetail$ = this.raceDynamicFormService.getFormDetail$(
        this.selectedForm.id
      );
    }
  }

  ngOnInit(): void {}

  cancelForm() {
    this.slideInOut.emit('in');
  }

  openMenu(type) {
    this.setnamevaribale = type;
  }

  ngOnDestroy(): void {
    this.selectedForm = null;
  }
}
