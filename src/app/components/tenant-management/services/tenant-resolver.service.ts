import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Tenant } from 'src/app/interfaces';
import { TenantService } from './tenant.service';

@Injectable({
  providedIn: 'root'
})
export class TenantResolverService implements Resolve<Tenant> {
  constructor(private tenantService: TenantService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Tenant> {
    const id = +route.params.id;
    return this.tenantService.getTenantById$(id).pipe(
      tap((tenant) => {
        if (tenant === null || Object.keys(tenant).length === 0) {
          this.router.navigate(['/tenant-management']);
          return of({} as Tenant);
        }
      })
    );
  }
}
