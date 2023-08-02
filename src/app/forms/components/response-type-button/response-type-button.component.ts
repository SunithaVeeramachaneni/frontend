import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy
} from '@angular/core';
import { FormService } from '../../services/form.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-response-type-button',
  templateUrl: './response-type-button.component.html',
  styleUrls: ['./response-type-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResponseTypeButtonComponent implements OnInit, OnDestroy {
  @Input() questionForm;
  @Input() fieldTypes;
  @Input() title;
  @Input() isImported: boolean;
  @Output() responseTypeOpenEvent: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  private onDestroy$ = new Subject();

  constructor(
    private formService: FormService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.questionForm.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.changeDetectorRef.detectChanges();
      });
  }

  getFieldTypeImage(type) {
    return type ? `icon-${type}` : null;
  }

  getFieldTypeDescription(type) {
    return type
      ? this.fieldTypes.find((field) => field.type === type)?.description
      : null;
  }

  openResponseTypeModal() {
    this.responseTypeOpenEvent.emit(true);
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
