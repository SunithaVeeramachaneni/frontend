import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { LoadEvent, SearchEvent, TableEvent } from 'src/app/interfaces';
import { AppService } from 'src/app/shared/services/app.services';
import { ToastService } from 'src/app/shared/toast';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  constructor(
    private toastService: ToastService,
    private appService: AppService
  ) {}

  getTemplateUsedList$(input) {
    const params: URLSearchParams = new URLSearchParams(input);
    return this.appService._getResp(
      environment.rdfApiUrl,
      'template-reference/get-forms?' + params.toString()
    );
  }
}
