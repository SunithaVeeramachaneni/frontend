import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  private protectedResources: [string[], string][] = [];

  private minimizeSidebarSubject = new BehaviorSubject<boolean>(true);
  private currentRouteUrlSubject = new BehaviorSubject<string>('');
  private headerTitleSubject = new BehaviorSubject<string>('');

  minimizeSidebarAction$ = this.minimizeSidebarSubject.asObservable();
  currentRouteUrlAction$ = this.currentRouteUrlSubject.asObservable();
  headerTitleAction$ = this.headerTitleSubject.asObservable();

  constructor() { }

  minimizeSidebar(minimize: boolean) {
    this.minimizeSidebarSubject.next(minimize);
  }

  setCurrentRouteUrl(value: string) {
    this.currentRouteUrlSubject.next(value);
  }

  setHeaderTitle(value: string) {
    this.headerTitleSubject.next(value);
  }

  setProtectedResources(protectedResources: [string[], string][]) {
    this.protectedResources = protectedResources ? protectedResources : [];
  }

  getProtectedResources() {
    return this.protectedResources;
  }
}
