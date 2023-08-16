/* eslint-disable no-underscore-dangle */
import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { RaceDynamicFormService } from 'src/app/components/race-dynamic-form/services/rdf.service';
import {
  progressStatus,
  formConfigurationStatus,
  routingUrls
} from '../../../app.constants';
import { ToastService } from 'src/app/shared/toast';
import { FormUpdateProgressService } from '../../services/form-update-progress.service';
import { CommonService } from 'src/app/shared/services/common.service';
const { v4: uuid } = require('uuid');

@Component({
  selector: 'app-form-update-delete-progress',
  templateUrl: './form-update-delete-progress.component.html',
  styleUrls: ['./form-update-delete-progress.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormUpdateDeleteProgressComponent implements OnInit, OnDestroy {
  _isOpen: boolean;
  _isExpanded: boolean;
  formMetadata: any[] = [];
  totalProgressCount = 0;
  totalCompletedCount = 0;
  isTemplateCreated: boolean;
  currentRouteUrl$: Observable<string>;
  readonly routingUrls = routingUrls;
  private onDestroy$ = new Subject();

  constructor(
    private commonService: CommonService,
    private rdfService: RaceDynamicFormService,
    private cdr: ChangeDetectorRef,
    private formProgressService: FormUpdateProgressService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.isOpen();
    this.isExpanded();
    this.templateCreated();
    this.currentRouteUrl$ = this.commonService.currentRouteUrlAction$;
    this.formUpdateDeletePayload$()
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((payload) => {
        this.cdr.detectChanges();
        if (payload?.formIds.length > 0) {
          this.resetCounters();
          const requestId = uuid();
          payload.affectedForms.map((form) => {
            form.requestId = requestId; // RequestId is used to identify the request which got failed in case of multiple requests
            form.progressStatus = progressStatus.inprogress;
            if (this.checkIfFormIdExists(form.id) === -1) {
              this.formMetadata.unshift(form);
            } else {
              const idx = this.formMetadata.findIndex(
                (data) => data.id === form.id
              );
              this.formMetadata[idx].progressStatus = progressStatus.inprogress;
              this.formMetadata[idx].requestId = requestId;
            }
          });
          this.calculateProgress();
          this.formProgressService.formUpdateDeletePayloadBuffer$.next(null);
          this.formProgressService.formUpdateDeletePayload$.next(null);
          delete payload.affectedForms;
          this.updateProgress$(payload, requestId).subscribe(
            (event) => {
              const idx = this.formMetadata.findIndex(
                (form) => form.id === event.id
              );
              this.formMetadata[idx].progressStatus = event.progressStatus;
              if (event.progressStatus === progressStatus.failed) {
                this.showErrorToast(this.formMetadata[idx].name, event.error);
              } else {
                this.calculateProgress();
                this.showToast();
              }
              this.cdr.detectChanges();
            },
            (err) => {
              this.onError(requestId, err?.error);
            }
          );
        } else if (payload?.templateId && !this.isTemplateCreated) {
          this.toastService.show({
            type: 'success',
            text: `Template is updated successfully.`
          });
        } else if (payload?.templateId) {
          this.toastService.show({
            type: 'success',
            text: `Template is created successfully.`
          });
        }
      });
  }

  calculateProgress() {
    if (this.formMetadata.length === 0) {
      this.isOpenToggle(false);
    } else {
      this.isOpenToggle(true);
    }
    this.totalProgressCount = this.formMetadata.filter(
      (form) => form.progressStatus !== progressStatus.inprogress
    ).length;
    this.totalCompletedCount = this.formMetadata.filter(
      (form) => form.progressStatus === progressStatus.success
    ).length;
  }
  showErrorToast(formName, msg) {
    if (!msg) {
      msg = `Unable to publish form - ${formName}`;
    } else if (msg && !formName) {
      msg = `Unable to publish forms - ${msg}`;
    } else {
      msg = `Unable to publish form - ${formName} - ${msg}`;
    }
    this.toastService.show({
      type: 'warning',
      text: msg
    });
  }
  showToast() {
    if (
      this.totalProgressCount === this.formMetadata.length &&
      this.formMetadata.length > 0
    ) {
      this.toastService.show({
        type: 'success',
        text: `${this.totalCompletedCount} ${
          this.totalCompletedCount === 1 ? 'Form is' : 'Forms are'
        } updated successfully.`
      });
    }
  }
  closeFormProgressComponent() {
    this.isOpenToggle(false);
    setTimeout(() => {
      this.formMetadata = [];
      this.totalProgressCount = 0;
    }, 500);
  }

  checkIfFormIdExists(formId) {
    return this.formMetadata.findIndex((form) => form.id === formId);
  }
  formUpdateDeletePayload$() {
    return this.formProgressService.formUpdateDeletePayload$;
  }
  onError(requestId: string, error: any) {
    this.formMetadata.map((form) => {
      if (form.requestId === requestId) {
        form.progressStatus = progressStatus.failed;
      }
    });
    this.cdr.detectChanges();
    this.showErrorToast('', error);
  }
  updateProgress$(data: any, requestId: string) {
    if (data.templateType === formConfigurationStatus.standalone) {
      return this.rdfService.updateAdhocFormOnTemplateChange$(
        data.templateId,
        data.formIds,
        requestId
      );
    } else if (data.templateType === formConfigurationStatus.embedded) {
      return this.rdfService.updateEmbeddedFormOnTemplateChange$(
        data.templateId,
        data.formIds,
        requestId
      );
    }
  }
  isOpen() {
    this.formProgressService.formProgressIsOpen$.subscribe((isOpen) => {
      this._isOpen = isOpen;
    });
  }
  isOpenToggle(isOpen?: boolean) {
    this.formProgressService.formProgressIsOpen$.next(isOpen ?? !this._isOpen);
  }
  isExpanded() {
    this.formProgressService.formProgressisExpanded$.subscribe((isExpanded) => {
      this._isExpanded = isExpanded;
    });
  }
  isExpandedToggle(isExpanded?: boolean) {
    this.formProgressService.formProgressisExpanded$.next(
      isExpanded ?? !this._isExpanded
    );
  }
  resetCounters() {
    if (
      this.formMetadata.length === this.totalProgressCount &&
      this.totalProgressCount !== 0
    ) {
      this.formMetadata = [];
      this.totalProgressCount = 0;
    }
  }
  templateCreated() {
    this.formProgressService.isTemplateCreated$.subscribe((data) => {
      this.isTemplateCreated = data;
    });
  }

  ngOnDestroy(): void {
    this.formMetadata = [];
    this.totalProgressCount = 0;
    this.formUpdateDeletePayload$().unsubscribe();
    this.formProgressService.formUpdateDeletePayloadBuffer$.unsubscribe();
    this.formProgressService.formProgressIsOpen$.unsubscribe();
    this.formProgressService.formProgressisExpanded$.unsubscribe();
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
