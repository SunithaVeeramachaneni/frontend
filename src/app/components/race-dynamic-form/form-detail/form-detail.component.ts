import { map } from 'rxjs/operators';
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
import { format } from 'date-fns';
import { isJson } from '../utils/utils';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { State } from 'src/app/forms/state';
import { FormConfigurationActions } from 'src/app/forms/state/actions';
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
  constructor(
    private readonly raceDynamicFormService: RaceDynamicFormService,
    private readonly router: Router,
    private readonly store: Store<State>
  ) {}

  ngOnChanges(_: SimpleChanges) {
    if (this.selectedForm) {
      this.selectedFormDetail$ = this.raceDynamicFormService
        .getAuthoredFormDetailByFormId$(this.selectedForm.id)
        .pipe(
          map((items) => {
            const updatedItems = items.map((item) => ({
              ...item,
              pages: isJson(item?.pages) ? JSON.parse(item.pages) : []
            }));
            if (updatedItems?.length > 0) {
              let firstItem = null;
              this.questionsCount = 0;
              this.pagesCount = 0;
              updatedItems.forEach((element, idx) => {
                if (idx === 0) {
                  firstItem = element;
                  if (
                    Array.isArray(element?.pages) &&
                    element?.pages?.length > 0
                  ) {
                    element?.pages.forEach((page, pIdx) => {
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
                }
              });
              return firstItem;
            }
            return updatedItems;
          })
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
  }
}
