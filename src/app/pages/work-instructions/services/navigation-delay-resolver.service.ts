import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NavigationDelayResolverService implements Resolve<Observable<any>> {

  constructor() { }

  resolve(): any {
    return of('0ms delayed navigation').pipe(delay(0));
  }
}
