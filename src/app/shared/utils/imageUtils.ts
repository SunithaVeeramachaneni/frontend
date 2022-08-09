import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class ImageUtils {
  constructor(private sanitizer: DomSanitizer) {}

  getImageSrc(source: string) {
    if (source) {
      const base64Image = 'data:image/jpeg;base64,' + source;
      return this.sanitizer.bypassSecurityTrustResourceUrl(base64Image);
    }
  }
  safeObjURL(objURL: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(objURL);
  }
}
