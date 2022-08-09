import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonFilterService {
  constructor() {}
  private commonFilterSubject = new BehaviorSubject<any>({
    priority: [],
    kitStatus: [],
    workCenter: [],
    assign: [],
    search: '',
    showOverdue: ''
  });

  commonFilterAction$ = this.commonFilterSubject.asObservable();

  searchFilter(filterObj) {
    this.commonFilterSubject.next(filterObj);
  }

  clearFilter() {
    let emptyObject = {
      priority: [],
      kitStatus: [],
      workCenter: [],
      assign: [],
      search: '',
      showOverdue: ''
    };

    this.commonFilterSubject.next(emptyObject);
  }
}
