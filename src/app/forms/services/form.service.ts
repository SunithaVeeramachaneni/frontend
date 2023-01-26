/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  RangeSelectorState,
  ResponseTypeOpenState
} from 'src/app/interfaces/response-type';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  private sliderOpenStateSubject = new BehaviorSubject<boolean>(false);
  private multiChoiceOpenStateSubject =
    new BehaviorSubject<ResponseTypeOpenState>({
      isOpen: false,
      response: {}
    });
  private openResponseTypeSubject = new BehaviorSubject<boolean>(false);
  private rangeSelectorOpenStateSubject = new BehaviorSubject<any>({
    isOpen: false,
    rangeMetadata: {}
  });

  sliderOpenState$ = this.sliderOpenStateSubject.asObservable();
  multiChoiceOpenState$ = this.multiChoiceOpenStateSubject.asObservable();
  rangeSelectorOpenState$ = this.rangeSelectorOpenStateSubject.asObservable();

  constructor() {}

  setsliderOpenState(open: boolean) {
    this.sliderOpenStateSubject.next(open);
  }

  setMultiChoiceOpenState(responseType: ResponseTypeOpenState) {
    this.multiChoiceOpenStateSubject.next(responseType);
  }
  setRangeSelectorOpenState(rangeMetadata: RangeSelectorState) {
    this.rangeSelectorOpenStateSubject.next(rangeMetadata);
  }
}
