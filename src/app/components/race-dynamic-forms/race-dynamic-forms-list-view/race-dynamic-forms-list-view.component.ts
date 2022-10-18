import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';
import { ToastService } from 'src/app/shared/toast';
import { RdfService } from '../services/rdf.service';

@Component({
  selector: 'app-race-dynamic-forms-list-view',
  templateUrl: './race-dynamic-forms-list-view.component.html',
  styleUrls: ['./race-dynamic-forms-list-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RaceDynamicFormsListViewComponent implements OnInit {
  forms$: Observable<any>;
  formsData$: Observable<any>;
  deleteForm$ = new BehaviorSubject<any>({} as any);
  duplicateForm$ = new BehaviorSubject<any>({} as any);
  constructor(
    private rdfService: RdfService,
    private toaster: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const initial = { data: [] };

    this.formsData$ = combineLatest([
      this.rdfService
        .getForms$()
        .pipe(
          map((forms) =>
            forms.sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
          )
        ),
      this.deleteForm$,
      this.duplicateForm$
    ]).pipe(
      map(([formsList, deleteForm, duplicateForm]) => {
        if (Object.keys(deleteForm).length) {
          initial.data = initial.data.filter(
            (form) => form.id !== deleteForm.id
          );
          return initial;
        }

        if (Object.keys(duplicateForm).length) {
          initial.data.splice(0, 0, duplicateForm);
        }
        initial.data = formsList;
        return initial;
      })
    );

    this.forms$ = this.rdfService
      .getForms$()
      .pipe(
        map((forms) =>
          forms.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        )
      );
  }

  deleteForm(form: any) {
    of(form)
      .pipe(
        mergeMap(({ isPublished }) => {
          if (isPublished) {
            return this.rdfService.deactivateAbapForm$(form).pipe(
              mergeMap((resp) => {
                if (resp === null) {
                  return this.deleteFromFromMongo(form);
                }
                return of({});
              })
            );
          } else {
            return this.deleteFromFromMongo(form);
          }
        })
      )
      .subscribe();
  }

  deleteFromFromMongo(form) {
    return this.rdfService.deleteForm$(form).pipe(
      tap((deleteFrom) => {
        if (Object.keys(deleteFrom).length) {
          this.toaster.show({
            text: `Form ${form.name} deleted successfully`,
            type: 'success'
          });
          this.deleteForm$.next(deleteFrom);
        }
      })
    );
  }

  editForm(form) {
    this.router.navigate(['rdf-forms/edit', form.id], {
      state: { data: form }
    });
  }

  duplicateForm(form) {
    return this.rdfService
      .duplicateForm$(form)
      .pipe(
        tap((newForm) => {
          if (Object.keys(newForm).length) {
            this.toaster.show({
              text: `Form ${newForm.name} copied successfully`,
              type: 'success'
            });
            this.duplicateForm$.next(newForm);
          }
        })
      )
      .subscribe();
  }
}
