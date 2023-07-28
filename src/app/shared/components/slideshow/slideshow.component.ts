/* eslint-disable no-underscore-dangle */
import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  ViewChild
} from '@angular/core';
import { fromEvent, merge } from 'rxjs';
import { map, scan, startWith } from 'rxjs/operators';
import { slideshowAnimation } from './slideshow.animations';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-slideshow',
  templateUrl: './slideshow.component.html',
  styleUrls: ['./slideshow.component.scss'],
  animations: [slideshowAnimation]
})
export class SlideshowComponent implements AfterViewInit, OnInit {
  @ViewChild('previous') previous;
  @ViewChild('next') next;
  currentIndex = 0;

  constructor(
    public dialogRef: MatDialogRef<SlideshowComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {}
  getImageSrc = (source) => {
    const base64Image = 'data:image/jpeg;base64,' + source;
    return this.sanitizer.bypassSecurityTrustResourceUrl(base64Image);
  };

  ngAfterViewInit() {
    const previous = fromEvent(
      this.getNativeElement(this.previous),
      'click'
    ).pipe(map((event) => ({ shift: -1, direction: 'right' })));

    const next = fromEvent(this.getNativeElement(this.next), 'click').pipe(
      map((event) => ({ shift: +1, direction: 'left' }))
    );

    merge(previous, next)
      .pipe(
        startWith({ index: 0 } as any),
        scan((acc, curr) => {
          const projectedIndex = acc.index + curr.shift;

          const adjustedIndex =
            projectedIndex < 0
              ? this.data.length - 1
              : projectedIndex >= this.data.length
              ? 0
              : projectedIndex;

          return { index: adjustedIndex, direction: curr.direction };
        })
      )
      .subscribe((event) => {
        this.currentIndex = event.index;
      });
  }

  getNativeElement(element) {
    return element._elementRef.nativeElement;
  }

  close() {
    this.dialogRef.close();
  }
}
