/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const emptyObject = {
  priority: [],
  kitStatus: [],
  assign: [],
  search: '',
  showOverdue: ''
};

@Injectable({
  providedIn: 'root'
})
export class CommonFilterService {
  private commonFilterSubject = new BehaviorSubject<any>(emptyObject);

  commonFilterAction$ = this.commonFilterSubject.asObservable();

  constructor() {}

  searchFilter(filterObj) {
    this.commonFilterSubject.next(filterObj);
  }

  clearFilter() {
    this.commonFilterSubject.next(emptyObject);
  }
}
