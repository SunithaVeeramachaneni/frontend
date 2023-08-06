/* eslint-disable no-underscore-dangle */
import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { RaceDynamicFormService } from 'src/app/components/race-dynamic-form/services/rdf.service';
import {
  progressStatus,
  formConfigurationStatus,
  routingUrls
} from '../../../app.constants';
import { ToastService } from 'src/app/shared/toast';
import { FormUpdateProgressService } from '../../services/form-update-progress.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { Store } from '@ngrx/store';
import { State, getFormMetadata } from 'src/app/forms/state';
import { getRequestCounter } from '../../state/builder/builder-state.selectors';
@Component({
  selector: 'app-ai-form-update-delete-progress',
  templateUrl: './ai-form-update-delete-progress.component.html',
  styleUrls: ['./ai-form-update-delete-progress.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AiFormUpdateDeleteProgressComponent implements OnInit, OnDestroy {
  _isOpen: boolean;
  _isExpanded: boolean;
  formMetadata: any[] = [];
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
    private toastService: ToastService,
    private store: Store<State>
  ) {}

  ngOnInit(): void {
    this.isOpen();
    this.isExpanded();
    this.currentRouteUrl$ = this.commonService.currentRouteUrlAction$;
    this.formUpdateDeletePayload$().subscribe((payload) => {
      console.log(payload);
      if (payload?.forms.length > 0) {
        this.resetCounters();
        payload.forms.map((form) => {
          form.preTextImage = {
            image: 'assets/rdf-forms-icons/formlogo.svg'
          };
          form.progressStatus = progressStatus.inprogress;
          if (this.checkIfFormIdExists(form.uid) === -1) {
            this.formMetadata.unshift(form);
          } else {
            const idx = this.formMetadata.findIndex(
              (data) => data.id === form.uid
            );
            this.formMetadata[idx].progressStatus = progressStatus.inprogress;
          }
        });
        this.calculateProgress();
        this.formProgressService.aiFormProgressIsOpen$.next(true);
        delete payload.affectedForms;
        this.updateProgress$(payload).subscribe((event) => {
          console.log(event);
          if (event?.isCompletedForm) {
            const idx = this.formMetadata.findIndex(
              (form) => form.uid === event.uid
            );

            this.formMetadata[idx].progressStatus = progressStatus.success;
            this.calculateProgress();
            // this.showToast();
            this.cdr.detectChanges();
          }
        });
        this.cdr.detectChanges();
      }
    });
  }
  getSectionsArrayFromHTML(inputString: String) {
    const regex = /<li>(.*?)<\/li>/g;
    const matches = inputString.match(regex);

    const sectionsArray = matches.map((match) => {
      const sectionName = match.replace(/<\/?li>/g, '');
      return { sectionName };
    });

    console.log(sectionsArray);
    return sectionsArray;
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
      this.totalCompletedCount = 0;
    }, 500);
  }

  checkIfFormIdExists(formId) {
    return this.formMetadata.findIndex((form) => form.id === formId);
  }
  formUpdateDeletePayload$() {
    return this.formProgressService.aiFormGeneratePayload$;
  }
  updateProgress$(data: any) {
    return this.rdfService.createFormsFromPrompt$(
      { forms: data.forms },
      data.plantId,
      data.requestCounter
    );
  }
  isOpen() {
    this.formProgressService.aiFormProgressIsOpen$.subscribe((isOpen) => {
      this._isOpen = isOpen;
      console.log(this._isOpen);
    });
  }
  isOpenToggle(isOpen?: boolean) {
    this.formProgressService.aiFormProgressIsOpen$.next(
      isOpen ?? !this._isOpen
    );
  }
  isExpanded() {
    this.formProgressService.aiFormProgressisExpanded$.subscribe(
      (isExpanded) => {
        this._isExpanded = isExpanded;
        console.log(this._isExpanded);
      }
    );
  }
  isExpandedToggle(isExpanded?: boolean) {
    this.formProgressService.aiFormProgressisExpanded$.next(
      isExpanded ?? !this._isExpanded
    );
  }
  resetCounters() {
    if (
      this.formMetadata.length === this.totalCompletedCount &&
      this.totalCompletedCount !== 0
    ) {
      this.formMetadata = [];
      this.totalCompletedCount = 0;
    }
  }

  ngOnDestroy(): void {
    this.formMetadata = [];
    this.totalCompletedCount = 0;
    this.formUpdateDeletePayload$().unsubscribe();
    this.formProgressService.aiFormProgressIsOpen$.unsubscribe();
    this.formProgressService.aiFormProgressisExpanded$.unsubscribe();
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
