import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { routingUrls } from 'src/app/app.constants';
import { CommonService } from 'src/app/shared/services/common.service';
import { TemplateModalComponent } from '../template-modal/template-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-template-container',
  templateUrl: './template-container.component.html',
  styleUrls: ['./template-container.component.scss']
})
export class TemplateContainerComponent implements OnInit {
  @ViewChild('triggerModalOnRefresh')
  triggerModalOnRefresh: ElementRef<HTMLElement>;
  readonly routingUrls = routingUrls;
  currentRouteUrl$: Observable<string>;

  constructor(
    private commonService: CommonService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.currentRouteUrl$ = this.commonService.currentRouteUrlAction$;
    if (
      performance.navigation.type === performance.navigation.TYPE_RELOAD &&
      this.router.url.indexOf('/forms/templates/edit') > -1
    ) {
      setTimeout(() => {
        const el: HTMLElement = this.triggerModalOnRefresh?.nativeElement;
        el?.click();
      }, 100);
    }
  }

  openDialog() {
    this.dialog.open(TemplateModalComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
      panelClass: 'full-screen-modal',
      disableClose: true
    });
  }
}
