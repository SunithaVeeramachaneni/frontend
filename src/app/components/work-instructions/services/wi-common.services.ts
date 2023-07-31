/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ImportFileEventData, Step } from '../../../interfaces';

export interface IUploadedImageDetails {
  image: string;
  index?: number;
}

@Injectable({ providedIn: 'root' })
export class WiCommonService {
  private imgSourceFromUploadedSection = new Subject<IUploadedImageDetails>();
  private stepTitle = new Subject<string>();
  private allSteps = new Subject<{ steps: Step[]; removedStep: Step }>();
  private stepDetails = new Subject<any>();
  private imgArray = new Subject<[]>();
  private stepDetailsSaveSubject = new Subject<string>();
  private previewStatus = new Subject<boolean>();
  private uploadInfoSubject = new Subject<ImportFileEventData>();
  private fetchWISubject = new BehaviorSubject<boolean>(true);
  private fetchCategoriesSubject = new BehaviorSubject<boolean>(true);

  currentImgFromPreviewSection =
    this.imgSourceFromUploadedSection.asObservable();
  currentStepTitle = this.stepTitle.asObservable();
  unLoadedImages = this.imgArray.asObservable();
  currentStepDetails = this.stepDetails.asObservable();
  currentTabs = this.allSteps.asObservable();
  stepDetailsSaveAction$ = this.stepDetailsSaveSubject.asObservable();
  currentPreviewStatus = this.previewStatus.asObservable();
  uploadInfoAction$ = this.uploadInfoSubject.asObservable();
  fetchWIAction$ = this.fetchWISubject.asObservable();
  fetchCategoriesAction$ = this.fetchCategoriesSubject.asObservable();

  constructor() {}

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

  setUpdatedSteps(steps: Step[], removedStep: Step = {} as Step) {
    this.allSteps.next({ steps, removedStep });
  }

  stepDetailsSave(value: string) {
    this.stepDetailsSaveSubject.next(value);
  }

  updateUploadInfo(info: ImportFileEventData) {
    this.uploadInfoSubject.next(info);
  }

  fetchWorkInstructions() {
    this.fetchWISubject.next(true);
  }

  fetchCategories() {
    this.fetchCategoriesSubject.next(true);
  }
}
