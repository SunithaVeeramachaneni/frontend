/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HierarchyEntity } from 'src/app/interfaces';
import {
  RangeSelectorState,
  ResponseTypeOpenState,
  SliderSelectorState
} from 'src/app/interfaces/response-type';
import { AppService } from 'src/app/shared/services/app.services';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  private sliderOpenStateSubject = new BehaviorSubject<SliderSelectorState>({
    isOpen: false,
    questionId: '',
    value: 'TF'
  });
  private multiChoiceOpenStateSubject =
    new BehaviorSubject<ResponseTypeOpenState>({
      isOpen: false,
      response: {}
    });
  private rangeSelectorOpenStateSubject = new BehaviorSubject<any>({
    isOpen: false,
    rangeMetadata: {}
  });

  private masterHierarchyData: HierarchyEntity[] = [];
  private selectedHierarchyList: HierarchyEntity[] = [];
  private instanceIdMappings: any;

  sliderOpenState$ = this.sliderOpenStateSubject.asObservable();
  multiChoiceOpenState$ = this.multiChoiceOpenStateSubject.asObservable();
  rangeSelectorOpenState$ = this.rangeSelectorOpenStateSubject.asObservable();

  constructor(private _appService: AppService) {}

  setsliderOpenState(sliderResponse: SliderSelectorState) {
    this.sliderOpenStateSubject.next(sliderResponse);
  }

  setMultiChoiceOpenState(responseType: ResponseTypeOpenState) {
    this.multiChoiceOpenStateSubject.next(responseType);
  }

  setRangeSelectorOpenState(rangeMetadata: RangeSelectorState) {
    this.rangeSelectorOpenStateSubject.next(rangeMetadata);
  }

  setMasterHierarchyList = (hierarchyData: HierarchyEntity[]) => {
    this.masterHierarchyData = hierarchyData;
  };

  getMasterHierarchyList = () => this.masterHierarchyData;

  setInstanceIdMappings = (mapping: any) => {
    this.instanceIdMappings = mapping;
  };
  getInstanceIdMappings = () => this.instanceIdMappings;
  getInstanceIdMappingsByUid = (uid) => this.instanceIdMappings[uid];

  setSelectedHierarchyList = (hierarchyData: HierarchyEntity[]) => {
    this.selectedHierarchyList = [
      ...this.selectedHierarchyList,
      ...hierarchyData
    ];
  };

  getSelectedHierarchyList = () => this.selectedHierarchyList;

  uploadToS3$(mediaSubfolder: string, file: Blob): Observable<any> {
    const formData = new FormData();
    formData.append('mediaSubfolder', mediaSubfolder);
    formData.append('file', file);

    return this._appService._postData(
      environment.rdfApiUrl,
      'forms/instructions_upload',
      formData
    );
  }

  deleteFromS3(objectKey: string): void {
    const params = new URLSearchParams();
    params.append('objectKey', encodeURIComponent(objectKey));

    this._appService
      ._removeData(
        environment.rdfApiUrl,
        `forms/instructions_delete?${params.toString()}`
      )
      .subscribe();
  }
}
