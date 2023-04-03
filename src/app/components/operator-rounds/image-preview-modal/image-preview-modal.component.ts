/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-image-preview-modal',
  templateUrl: './image-preview-modal.component.html',
  styleUrls: ['./image-preview-modal.component.scss']
})
export class ImagePreviewModalComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<ImagePreviewModalComponent>
  ) {}
  slideIndex = 1;

  assets() {}

  ngOnInit(): void {
    this.showSlides(this.slideIndex);
  }

  openModal() {
    document.getElementById('myModal').style.display = 'block';
  }

  closeModal() {
    this.dialogRef.close();
  }

  plusSlides(n) {
    this.showSlides((this.slideIndex += n));
  }

  currentSlide(n: any) {
    this.showSlides((this.slideIndex = n));
  }

  showSlides(n: any) {
    let i;
    const slides: any = document.getElementsByClassName('mySlides');
    const dots: any = document.getElementsByClassName('demo');
    const captionText: any = document.getElementById('caption');
    if (n > slides.length) {
      this.slideIndex = 1;
    }
    if (n < 1) {
      this.slideIndex = slides.length;
    }
    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = 'none';
    }
    for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(' active', '');
    }
    slides[this.slideIndex - 1].style.display = 'block';
    dots[this.slideIndex - 1].className += ' active';
    captionText.innerHTML = dots[this.slideIndex - 1].alt;
  }
}
