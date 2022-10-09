import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
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
  constructor(private rdfService: RdfService, private toaster: ToastService) {}

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
      this.deleteForm$
    ]).pipe(
      map(([formsList, deleteForm]) => {
        if (Object.keys(deleteForm).length) {
          initial.data = initial.data.filter(
            (form) => form.id !== deleteForm.id
          );
          return initial;
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
    const observables = [this.rdfService.deleteForm$(form)];

    if (form.isPublished) {
      observables.push(this.rdfService.deactivateAbapForm$(form));
    }

    combineLatest(observables).subscribe(([resp]) => {
      if (Object.keys(resp).length) {
        this.toaster.show({
          text: `Form ${form.name} deleted successfully`,
          type: 'success'
        });
        this.deleteForm$.next(resp);
      }
    });
  }
}
