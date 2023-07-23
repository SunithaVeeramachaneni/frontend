import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { RaceDynamicFormService } from 'src/app/components/race-dynamic-form/services/rdf.service';
import { progressStatus } from '../../../app.constants';
import { ToastService } from 'src/app/shared/toast';
import { FormUpdateProgressService } from '../../services/form-update-progress.service';

@Component({
  selector: 'app-form-update-delete-progress',
  templateUrl: './form-update-delete-progress.component.html',
  styleUrls: ['./form-update-delete-progress.component.scss']
})
export class FormUpdateDeleteProgressComponent implements OnInit, OnDestroy {
  _isOpen: boolean;
  _isExpanded: boolean;
  formMetadata: any[] = [];
  totalCompletedCount: number = 0;
  private onDestroy$ = new Subject();
  constructor(
    private rdfService: RaceDynamicFormService,
    private cdr: ChangeDetectorRef,
    private formProgressService: FormUpdateProgressService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.isOpen();
    this.isExpanded();
    this.formUpdateDeletePayload$().subscribe((payload) => {
      if (payload?.formIds.length > 0) {
        payload.affectedForms.map((form) => {
          form.progressStatus = progressStatus.inprogress;
          if (this.checkIfFormIdExists(form.id) === -1) {
            this.formMetadata.unshift(form);
          } else {
            const idx = this.formMetadata.findIndex(
              (data) => data.id === form.id
            );
            this.formMetadata[idx].progressStatus = progressStatus.inprogress;
          }
        });
        this.calculateProgress();
        this.formProgressService.formUpdateDeletePayload$.next(null);
        delete payload.affectedForms;
        this.updateProgress$(payload).subscribe((event) => {
          console.log(event);
          const idx = this.formMetadata.findIndex(
            (form) => form.id === event.id
          );
          this.formMetadata[idx].progressStatus = event.progressStatus;
          this.calculateProgress();
          this.showToast();
          this.cdr.detectChanges();
        });
      } else {
        this.showToast();
      }
    });
  }

  calculateProgress() {
    if (this.formMetadata.length === 0) {
      this.isOpenToggle(false);
    } else {
      this.isOpenToggle(true);
    }
    this.totalCompletedCount = this.formMetadata.filter(
      (form) => form.progressStatus !== progressStatus.inprogress
    ).length;
  }

  showToast() {
    if (
      this.totalCompletedCount === this.formMetadata.length &&
      this.formMetadata.length > 0
    ) {
      this.toastService.show({
        type: 'success',
        text: `${this.totalCompletedCount} Forms are updated successfully.`
      });
    } else if (this.formMetadata.length === 0) {
      this.toastService.show({
        type: 'success',
        text: `Template is updated successfully.`
      });
    }
  }
  closeFormProgressComponent() {
    this.isOpenToggle(false);
    setTimeout(() => {
      this.formMetadata = [];
      this.totalCompletedCount = 0;
    }, 500);
  }

  checkIfFormIdExists(formId) {
    return this.formMetadata.findIndex((form) => form.id === formId);
  }
  formUpdateDeletePayload$() {
    return this.formProgressService.formUpdateDeletePayload$;
  }
  updateProgress$(data: any) {
    return this.rdfService.updateAdhocFormOnTemplateChange$(
      data.templateId,
      data.formIds
    );
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

  ngOnDestroy(): void {
    this.formMetadata = [];
    this.totalCompletedCount = 0;
    this.formUpdateDeletePayload$().unsubscribe();
    this.formProgressService.formProgressIsOpen$.unsubscribe();
    this.formProgressService.formProgressisExpanded$.unsubscribe();
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
