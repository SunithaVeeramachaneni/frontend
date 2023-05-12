import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { routingUrls } from 'src/app/app.constants';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-template-container',
  templateUrl: './template-container.component.html',
  styleUrls: ['./template-container.component.scss']
})
export class TemplateContainerComponent implements OnInit {
  readonly routingUrls = routingUrls;
  currentRouteUrl$: Observable<string>;
  constructor(private commonService: CommonService) {}

  ngOnInit(): void {
    this.currentRouteUrl$ = this.commonService.currentRouteUrlAction$;
  }
}
