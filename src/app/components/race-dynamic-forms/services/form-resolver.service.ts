import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RdfService } from './rdf.service';

@Injectable({
  providedIn: 'root'
})
export class FormResolverService implements Resolve<any> {
  constructor(private rdfService: RdfService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const id = route.params.id;
    return this.rdfService.appSyncGetFormById$(id).pipe(
      tap((form) => {
        if (form === null || Object.keys(form).length === 0) {
          this.router.navigate(['/rdf-forms']);
          return of({});
        }
      })
    );
  }
}
