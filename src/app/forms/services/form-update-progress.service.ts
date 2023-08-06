import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormUpdateProgressService {
  formProgressIsOpen$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  formProgressisExpanded$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(true);
  formUpdateDeletePayload$: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );
  isTemplateCreated$: BehaviorSubject<boolean> = new BehaviorSubject<any>(
    false
  );
  aiFormProgressIsOpen$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  aiFormProgressisExpanded$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(true);
  aiFormGeneratePayload$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor() {}
}
