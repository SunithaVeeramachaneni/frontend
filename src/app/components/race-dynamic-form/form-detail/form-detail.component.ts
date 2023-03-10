/* eslint-disable no-underscore-dangle */
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { format } from 'date-fns';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { State } from 'src/app/forms/state';
import { RaceDynamicFormService } from '../services/rdf.service';
import { FormConfigurationActions } from 'src/app/forms/state/actions';
import { GetFormListQuery } from 'src/app/API.service';
import { OperatorRoundsService } from '../../operator-rounds/services/operator-rounds.service';
@Component({
  selector: 'app-form-detail',
  templateUrl: './form-detail.component.html',
  styleUrls: ['./form-detail.component.scss']
})
export class FormDetailComponent implements OnInit, OnChanges, OnDestroy {
  @Output() slideInOut: EventEmitter<any> = new EventEmitter();
  @Output() formDetailAction: EventEmitter<any> = new EventEmitter();
  @Input() selectedForm: GetFormListQuery = null;
  @Input() moduleName = 'RDF';

  selectedFormDetail$: Observable<any> = null;
  defaultFormName = null;
  pagesCount = 0;
  questionsCount = 0;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  ghostLoading = new Array(19).fill(0).map((_, i) => i);
  constructor(
    private readonly raceDynamicFormService: RaceDynamicFormService,
    private readonly operatorRoundsService: OperatorRoundsService,
    private readonly router: Router,
    private readonly store: Store<State>
  ) {}

  ngOnChanges(_: SimpleChanges) {
    if (this.selectedForm) {
      this.toggleLoader(true);

      let formDetail$: any =
        this.raceDynamicFormService.getAuthoredFormDetailByFormId$(
          this.selectedForm.id
        );
      if (this.moduleName === 'OPERATOR_ROUNDS') {
        formDetail$ = this.operatorRoundsService.getAuthoredFormDetailByFormId$(
          this.selectedForm.id
        );
      }
      this.selectedFormDetail$ = formDetail$.pipe(
        map((formDetail: any) => {
          this.pagesCount = 0;
          this.questionsCount = 0;
          let data: any;
          if (formDetail) {
            const pages = JSON.parse(formDetail.pages);
            data = { ...formDetail, pages };
            data.pages.forEach((page, pIdx) => {
              if (pIdx === 0) {
                this.defaultFormName = `${page.name} ${page.position}`;
                this.store.dispatch(
                  FormConfigurationActions.initPages({
                    pages: [page]
                  })
                );
              }
              this.questionsCount += page?.questions?.length || 0;
              this.pagesCount += 1;
            });
          }
          return data;
        })
      );
      this.selectedFormDetail$?.subscribe(
        () => {
          this.toggleLoader(false);
        },
        () => {
          this.toggleLoader(false);
        }
      );
    }
  }

  ngOnInit(): void {}

  cancelForm() {
    this.slideInOut.emit('in');
    this.selectedFormDetail$ = null;
    this.store.dispatch(FormConfigurationActions.resetPages());
  }

  openMenu(page): void {
    this.selectedFormDetail$.subscribe((form) => {
      const foundPage = form?.pages?.find(
        (p) => p?.position === page?.position
      );
      this.defaultFormName = `${foundPage?.name} ${foundPage?.position}`;
      this.store.dispatch(
        FormConfigurationActions.initPages({
          pages: [foundPage]
        })
      );
    });
  }

  formateDate(date: string) {
    if (!date) {
      return '';
    }
    return format(new Date(date), 'dd MMM yyyy - HH:mm a');
  }

  onNavigateToDetailPage() {
    this.formDetailAction.emit({ type: 'edit' });
  }

  ngOnDestroy(): void {
    this.selectedForm = null;
    this.toggleLoader(false);
  }

  private toggleLoader(action: boolean): void {
    this.isLoading$.next(action);
  }
}
