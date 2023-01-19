/* eslint-disable no-underscore-dangle */
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
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
import { format } from 'date-fns';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { State } from 'src/app/forms/state';
import { isJson } from '../utils/utils';
import { RaceDynamicFormService } from '../services/rdf.service';
import { FormConfigurationActions } from 'src/app/forms/state/actions';
import { GetFormListQuery } from 'src/app/API.service';
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
  selectedFormDetail$: Observable<any> = null;
  defaultFormName = null;
  pagesCount = 0;
  questionsCount = 0;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  ghostLoading = new Array(19).fill(0).map((_, i) => i);
  constructor(
    private readonly raceDynamicFormService: RaceDynamicFormService,
    private readonly router: Router,
    private readonly store: Store<State>
  ) {}

  ngOnChanges(_: SimpleChanges) {
    if (this.selectedForm) {
      this.toggleLoader(true);
      this.selectedFormDetail$ = this.raceDynamicFormService
        .getAuthoredFormDetailByFormId$(this.selectedForm.id)
        .pipe(
          map((items) => {
            const updatedItems = items.map((item) => ({
              ...item,
              pages: isJson(item?.pages) ? JSON.parse(item.pages) : []
            }));
            if (updatedItems?.length > 0) {
              let latestVersion = null;
              this.questionsCount = 0;
              this.pagesCount = 0;
              let version = 0;

              updatedItems.forEach((element, idx) => {
                if (element._version > version) version = element._version;
                const latestFormVersionData = updatedItems.find(
                  (item) => item._version === version
                );
                latestVersion = latestFormVersionData;
              });
              if (
                Array.isArray(latestVersion?.pages) &&
                latestVersion?.pages?.length > 0
              ) {
                latestVersion?.pages.forEach((page, pIdx) => {
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

              return latestVersion;
            }
            return updatedItems;
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
    this.store.dispatch(FormConfigurationActions.resetPages());
    this.router.navigate([`/forms/edit/${this.selectedForm.id}`]);
  }

  ngOnDestroy(): void {
    this.selectedForm = null;
    this.toggleLoader(false);
  }

  private toggleLoader(action: boolean): void {
    this.isLoading$.next(action);
  }
}
