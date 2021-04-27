import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { from, of } from 'rxjs';
import { map, mergeMap, toArray } from 'rxjs/operators';
// import { InstructionService } from '../views/home/categories/workinstructions/instruction.service';

@Injectable({
  providedIn: 'root'
})
export class Base64HelperService {

  private base64ImageDetails = {};

  constructor(
              private sanitizer: DomSanitizer) { }

  getExtention(fileName: string) {
    const i = fileName.lastIndexOf('.');
    if (i === -1) {
      return '';
    }
    return fileName.slice(i);
  }

  getBase64ImageFromSourceUrl = (url: string) => fetch(url)
    .then(response => response.blob())
    .then(blob => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve({ base64Response: reader.result });
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    }))

  getBase64Image = (file: string) => {
    // this.instructionService.getImage({ file }).subscribe(
    //   ({ base64Response }) =>
    //     this.base64ImageDetails = { ...this.base64ImageDetails, [file]: this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/${this.getExtention(file).substring(1)};base64, ${base64Response}`) }
    // );
  }

  getImageContents = (files: any[]) => {
    return from(files)
      .pipe(
        map((file: string, index: number) => [file, index]),
        mergeMap(([file, index]: [string, number]) => {
          if (this.base64ImageDetails[file]) {
            const { changingThisBreaksApplicationSecurity } = this.base64ImageDetails[file];
            return of({
              "fileContent": changingThisBreaksApplicationSecurity.split(', ')[1],
              "fileName": files[index],
              "fileType": this.getExtention(files[index])
            });
          } else {
            // return this.instructionService.getImage({ file })
            //   .pipe(
            //     map(({ base64Response }) => {
            //       this.base64ImageDetails = { ...this.base64ImageDetails, [files[index]]: this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/${this.getExtention(files[index]).substring(1)};base64, ${base64Response}`) };
            //       return {
            //         "fileContent": base64Response,
            //         "fileName": files[index],
            //         "fileType": this.getExtention(files[index])
            //       };
            //     })
            //   );
          }
        }),
        toArray()
      );
  }

  getBase64ImageDetails = () => this.base64ImageDetails;

  getBase64ImageData = (file: string): string => this.base64ImageDetails[file];

  setBase64ImageDetails = (file: string, base64ImageData: string) => {
    this.base64ImageDetails = { ...this.base64ImageDetails, [file]: this.sanitizer.bypassSecurityTrustResourceUrl(base64ImageData) };
  }

  deleteBase64ImageDetails = (file: string) => delete this.base64ImageDetails[file];

  resetBase64ImageDetails = () => this.base64ImageDetails = {};
}
