/* eslint-disable no-underscore-dangle */
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Input,
  Output,
  EventEmitter,
  ViewChildren,
  QueryList,
  ElementRef,
  OnDestroy
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators
} from '@angular/forms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  pairwise,
  debounceTime,
  distinctUntilChanged,
  tap,
  takeUntil
} from 'rxjs/operators';

import { isEqual } from 'lodash-es';

import { ResponseSetService } from 'src/app/components/master-configurations/response-set/services/response-set.service';
import { ToastService } from 'src/app/shared/toast';

import { WhiteSpaceValidator } from 'src/app/shared/validators/white-space-validator';
import { Subject, Subscription, timer } from 'rxjs';
import { ValidationError } from 'src/app/interfaces';
import { FormValidationUtil } from 'src/app/shared/utils/formValidationUtil';

@Component({
  selector: 'app-global-response-type-side-drawer',
  templateUrl: './global-response-type-side-drawer.component.html',
  styleUrls: ['./global-response-type-side-drawer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GlobalResponseTypeSideDrawerComponent
  implements OnInit, OnDestroy
{
  @Output() slideInOut: EventEmitter<any> = new EventEmitter();
  @Output() globalResponseHandler: EventEmitter<any> = new EventEmitter<any>();

  @ViewChildren('globalResponses')
  private globalResponses: QueryList<ElementRef>;
  isCreate = false;
  public isViewMode: boolean;
  public responseForm: FormGroup;
  errors: ValidationError = {};
  public isResponseFormUpdated = false;
  public globalResponse: any;
  private globalResponseSubscription: Subscription;
  private onDestroy$ = new Subject();

  @Input() set globalResponseToBeEdited(response: any) {
    this.globalResponse = response ? response : null;
    this.isCreate = this.globalResponse ? false : true;
  }

  @Input() set isControlInViewMode(mode) {
    this.isViewMode = mode;
  }

  constructor(
    private fb: FormBuilder,
    private responseSetService: ResponseSetService,
    private cdrf: ChangeDetectorRef,
    private toast: ToastService,
    private formValidationUtil: FormValidationUtil
  ) {}

  ngOnInit(): void {
    this.responseForm = this.fb.group({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        WhiteSpaceValidator.trimWhiteSpace
      ]),
      description: new FormControl('', [WhiteSpaceValidator.trimWhiteSpace]),
      responses: this.fb.array([])
    });
    this.responseForm.valueChanges
      .pipe(
        pairwise(),
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.onDestroy$),
        tap(([prev, curr]) => {
          if (isEqual(prev, curr) || !curr.name || curr.responses.length < 1)
            this.isResponseFormUpdated = false;
          else if (curr.responses.find((item) => !item.title))
            this.isResponseFormUpdated = false;
          else if (
            this.globalResponse &&
            this.globalResponse.name === curr.name.value &&
            isEqual(JSON.parse(this.globalResponse.values), curr.responses)
          )
            this.isResponseFormUpdated = false;
          else this.isResponseFormUpdated = true;
          this.cdrf.markForCheck();
        })
      )
      .subscribe();

    if (this.globalResponse) {
      this.name.patchValue(this.globalResponse.name);
      this.description.patchValue(this.globalResponse.description);
      const globalresponseValues = JSON.parse(this.globalResponse.values);
      const reponseTimer = timer(0, 1000);
      let responseCount = 0;
      this.globalResponseSubscription = reponseTimer.subscribe(() => {
        const items = globalresponseValues.slice(
          responseCount * 100,
          (responseCount + 1) * 100
        );
        items.forEach((item) => {
          this.responses.push(
            this.fb.group({
              title: [
                item.title,
                [Validators.required, WhiteSpaceValidator.trimWhiteSpace]
              ],
              color: ''
            })
          );
        });
        responseCount++;
        if (items.length === 0) {
          this.globalResponseSubscription.unsubscribe();
        }
      });
    } else if (!this.globalResponse && !this.isViewMode) this.addResponse(1);
  }

  toggleViewMode = () => {
    this.isViewMode = !this.isViewMode;
  };

  addResponse(index: number) {
    this.responses.push(
      this.fb.group({
        title: ['', [Validators.required, WhiteSpaceValidator.trimWhiteSpace]],
        color: ''
      })
    );

    timer(0).subscribe(() =>
      this.globalResponses.toArray()[index]?.nativeElement.focus()
    );
  }

  getResponseCount() {
    return this.globalResponses.toArray().length;
  }

  get responses(): FormArray {
    return this.responseForm.get('responses') as FormArray;
  }

  get name(): FormControl {
    return this.responseForm.get('name') as FormControl;
  }

  get description(): FormControl {
    return this.responseForm.get('description') as FormControl;
  }

  getResponseList() {
    return (this.responseForm.get('responses') as FormArray).controls;
  }

  trackByFn(index: any, item: any) {
    return index;
  }

  dropResponse = (event: CdkDragDrop<any>) => {
    moveItemInArray(
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
    this.responses.patchValue(event.container.data);
  };

  deleteResponse = (idx: number) => {
    this.responses.removeAt(idx);
    this.responseForm.markAsDirty();
  };

  getDescription = () => {
    if (this.globalResponse) {
      return this.globalResponse?.description || 'Untitled Description';
    }
  };

  processValidationErrors(controlName: string): boolean {
    return this.formValidationUtil.processValidationErrors(
      controlName,
      this.responseForm,
      this.errors
    );
  }

  processValidationErrorsFormArrays(controlName: string, index) {
    return this.formValidationUtil.processValidationErrorsFormArrays(
      controlName,
      index,
      this.responseForm,
      this.errors
    );
  }

  submitResponseSet = () => {
    const responseSetPayload = {
      name: this.name.value ? this.name.value : 'Untitled Response Set',
      responseType: 'globalResponse',
      isMultiColumn: false,
      values: JSON.stringify(this.responses.value),
      description: this.description.value,
      refCount: 0
    };
    if (this.globalResponse !== null) {
      this.responseSetService
        .updateResponseSet$({
          ...responseSetPayload,
          id: this.globalResponse.id,
          version: this.globalResponse._version,
          refCount: this.globalResponse.refCount,
          createdBy: this.globalResponse.createdBy
        })
        .subscribe((response) => {
          if (Object.keys(response).length)
            this.handleResponseSetSuccess(response, 'update');
        });
    } else
      this.responseSetService
        .createResponseSet$(responseSetPayload)
        .subscribe((response) => {
          if (Object.keys(response).length)
            this.handleResponseSetSuccess(response, 'create');
        });
  };

  closeGlobalResponse = () => {
    this.globalResponseHandler.emit({
      isGlobalResponseOpen: false,
      responseToBeEdited: null,
      responseSet: null,
      actionType: 'cancel'
    });
    this.slideInOut.next('out');
    this.cdrf.markForCheck();
  };

  handleResponseSetSuccess = (response, messageType) => {
    this.toast.show({
      text: `Response Set ${messageType}d successfully`,
      type: 'success'
    });
    this.globalResponseHandler.emit({
      responseSet: response,
      isGlobalResponseOpen: false,
      responseToBeEdited: null,
      actionType: messageType
    });
    this.slideInOut.next('out');
    this.cdrf.markForCheck();
  };

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
