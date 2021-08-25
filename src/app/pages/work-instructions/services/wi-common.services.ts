import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Step } from '../../../interfaces/step';

export interface IUploadedImageDetails {
  image: string;
  index?: number;
}

@Injectable({ providedIn: "root" })
export class WiCommonService {

    constructor() { }

    private imgSourceFromUploadedSection = new Subject<IUploadedImageDetails>();
    private stepTitle = new Subject<string>();
    private allSteps = new Subject<any>();
    private stepDetails = new Subject<any>();
    private imgArray = new Subject<[]>();
    private stepDetailsSaveSubject = new Subject<string>();
    private previewStatus = new Subject<boolean>();

    currentImgFromPreviewSection = this.imgSourceFromUploadedSection.asObservable();

    currentStepTitle = this.stepTitle.asObservable();

    unLoadedImages = this.imgArray.asObservable();

    currentStepDetails = this.stepDetails.asObservable();

    currentTabs = this.allSteps.asObservable();
    stepDetailsSaveAction$ = this.stepDetailsSaveSubject.asObservable();
    currentPreviewStatus = this.previewStatus.asObservable();

    uploadImgToPreview(imageDetails: IUploadedImageDetails) {
      this.imgSourceFromUploadedSection.next(imageDetails);
    }

  updateStepTitle(source: any) {
    this.stepTitle.next(source);
  }

  unloadImages(source: any) {
      this.imgArray.next(source);
    }

  setPreviewStatus(source: any) {
    this.previewStatus.next(source);
  }


  updateStepDetails(source: any) {
    this.stepDetails.next(source);
  }

    setUpdatedSteps(source: Step[]) {
      this.allSteps.next(source);
    }

  stepDetailsSave(value: string) {
    this.stepDetailsSaveSubject.next(value);
  }
}
