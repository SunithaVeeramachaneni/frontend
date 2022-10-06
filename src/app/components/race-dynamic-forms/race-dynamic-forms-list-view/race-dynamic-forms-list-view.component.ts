import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { RdfService } from '../services/rdf.service';

@Component({
  selector: 'app-race-dynamic-forms-list-view',
  templateUrl: './race-dynamic-forms-list-view.component.html',
  styleUrls: ['./race-dynamic-forms-list-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RaceDynamicFormsListViewComponent implements OnInit {
  forms$: Observable<any>;
  constructor(private rdfService: RdfService) {}
  ngOnInit(): void {
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
}
