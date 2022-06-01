import { DomSanitizer } from '@angular/platform-browser';

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function getImageSrc(source: string, sanitizer: DomSanitizer) {
  if (source) {
    const base64Image = 'data:image/jpeg;base64,' + source;
    return sanitizer.bypassSecurityTrustResourceUrl(base64Image);
  }
}
