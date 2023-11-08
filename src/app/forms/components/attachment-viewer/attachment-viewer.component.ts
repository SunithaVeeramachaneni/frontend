import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { routingUrls } from 'src/app/app.constants';
import { OperatorRoundsService } from 'src/app/components/operator-rounds/services/operator-rounds.service';
import { RaceDynamicFormService } from 'src/app/components/race-dynamic-form/services/rdf.service';
import { SlideshowComponent } from 'src/app/shared/components/slideshow/slideshow.component';

@Component({
  selector: 'app-attachment-viewer',
  templateUrl: './attachment-viewer.component.html',
  styleUrls: ['./attachment-viewer.component.scss']
})
export class AttachmentViewerComponent implements OnInit {
  slideshowAttachments: any[] = [];
  onCloseRoute: string;
  getAttachments$: Observable<any>;
  constructor(
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private operatorRoundsService: OperatorRoundsService,
    private rdfService: RaceDynamicFormService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (this.router.url.includes(routingUrls.oprRounds.url)) {
        this.onCloseRoute = routingUrls.oprRounds.url;
        this.getAttachments$ =
          this.operatorRoundsService.fetchAllRoundAttachments$(id);
      } else if (this.router.url.includes(routingUrls.myForms.url)) {
        this.onCloseRoute = routingUrls.myForms.url;
        this.getAttachments$ =
          this.rdfService.fetchAllInspectionAttachments$(id);
      }
      this.getAttachments$.subscribe((attachments) => {
        if (attachments.length) {
          const dialogRef = this.dialog.open(SlideshowComponent, {
            width: '100%',
            height: '100%',
            panelClass: 'slideshow-container',
            backdropClass: 'slideshow-backdrop',
            disableClose: true,
            data: { images: attachments, type: 'base64' }
          });
          dialogRef.afterClosed().subscribe((result) => {
            this.router.navigate([this.onCloseRoute]);
          });
        } else {
          this.router.navigate([this.onCloseRoute]);
        }
      });
    });
  }
}
