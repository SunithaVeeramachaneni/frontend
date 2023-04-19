import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-image-preview',
  templateUrl: './image-preview.component.html',
  styleUrls: ['./image-preview.component.scss']
})
export class ImagePreviewComponent implements OnInit {
  //@Input() imageUrl: string;

  imageUrl =
    'https://images.unsplash.com/photo-1550948537-130a1ce83314?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2552&q=80';

  constructor() {}

  ngOnInit(): void {}

  showPreview(imageUrl: string) {
    const previewImage = document.getElementById(
      'preview-image'
    ) as HTMLImageElement;
    previewImage.src = imageUrl;
    previewImage.style.display = 'block';
  }

  closePreview() {
    const previewImage = document.getElementById(
      'preview-image'
    ) as HTMLImageElement;
    previewImage.style.display = 'none';
  }
}
