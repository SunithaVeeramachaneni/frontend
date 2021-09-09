import { Component, OnDestroy, OnInit } from '@angular/core';
import { MyOverlayRef } from '../../myoverlay-ref';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { InstructionService } from '../../../services/instruction.service';
import { Router } from '@angular/router';
import { concatMap, map, mergeMap, toArray } from 'rxjs/operators';
import { AlertService } from '../../alert/alert.service';
import { from, of, Subscription } from 'rxjs';
import { ErrorInfo, ImportFileEventData } from '../../../../../interfaces';
import { InstructionWithSteps } from '../../state/bulkupload.reducer';
import { State } from '../../../../../state/app.state';
import { Store } from '@ngrx/store';
import * as BulkUploadActions from '../../state/bulkupload.actions';
import { ErrorHandlerService } from '../../../../../shared/error-handler/error-handler.service';
import { WiCommonService } from '../../../services/wi-common.services';


@Component({
  selector: 'app-bulk-upload',
  templateUrl: './bulk-upload.component.html',
  styleUrls: ['./bulk-upload.component.css']
})
export class BulkUploadComponent implements OnInit, OnDestroy {

  public steps = [];
  public ins = [];
  public assignedObjectsList;
  loadResults = false;
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  isAudioOrVideoFile: boolean;
  redirectUrl: string;
  uploadInfo: ImportFileEventData;
  private uploadInfoSubscription: Subscription;

  constructor(public ref: MyOverlayRef,
              private alertService: AlertService,
              private _instructionSvc: InstructionService,
              private router: Router,
              private store: Store<State>,
              private errorHandlerService: ErrorHandlerService,
              private wiCommonService: WiCommonService) {}

  instructionObject = (obj, type) => {
    let instructionObject: object = {
      Title: type,
      Active: 'true',
      FieldValue: this.convertStrToList(obj)
    };
    switch (type) {
      case 'Attachment': {
        instructionObject = {
          ...instructionObject,
          Position: 0,
          FieldType: 'ATT',
          FieldCategory: 'ATT'
        };
        break;
      }
      case 'Instruction': {
        instructionObject = {
          ...instructionObject,
          Position: 1,
          FieldType: 'RTF',
          FieldCategory: 'INS'
        };
        break;
      }
      case 'Warning': {
        instructionObject = {
          ...instructionObject,
          Position: 2,
          FieldType: 'RTF',
          FieldCategory: 'WARN'
        };
        break;
      }
      case 'Hint': {
        instructionObject = {
          ...instructionObject,
          Position: 3,
          FieldType: 'RTF',
          FieldCategory: 'HINT',
        };
        break;
      }
      case 'ReactionPlan': {
        instructionObject = {
          ...instructionObject,
          Position: 4,
          FieldType: 'RTF',
          FieldCategory: 'REACTION PLAN',
        };
        break;
      }
    }
    return JSON.stringify(instructionObject);
  }

  convertStrToList(obj) {
    if (obj) {
      if (/1\./.test(obj)) {
        const numberedList = obj.split(/^\d+\.+\s+|\s\d\.\s/);
        const listInfo = numberedList.shift();
        const numberedListResult = '<ol><li>' + numberedList.join('</li><li>') + '</li></ol>';
        return listInfo.trim() ? `<p>${listInfo}</p>${numberedListResult}` : numberedListResult;
      } else if (/●/.test(obj)) {
        const bulletedList = obj.split('●');
        const listInfo = bulletedList.shift();
        const bulletedListResult = '<ul><li>' + bulletedList.join('</li><li>') + '</li></ul>';
        return listInfo.trim() ? `<p>${listInfo}</p>${bulletedListResult}` : bulletedListResult;
      } else {
        const para = '<p>' + obj + '</p>';
        return para;
      }
    }
  }

  fieldsObject = (ins, warn, hint, reactionplan, attachments) => {
    const instruction = ins ? this.convertStrToList(ins) : '';
    const warning = warn ? this.convertStrToList(warn) : '';
    const hints = hint ? this.convertStrToList(hint) : '';
    const reaction = reactionplan ? this.convertStrToList(reactionplan) : '';
    const attachment = attachments ? JSON.parse(attachments) : '';
    const fieldsObject: object = [
      {
        Title: 'Attachment',
        Position: 0,
        Active: 'true',
        FieldCategory: 'ATT',
        FieldType: 'ATT',
        FieldValue: attachment
      },
      {
        Title: 'Instruction',
        Position: 1,
        Active: 'true',
        FieldCategory: 'INS',
        FieldType: 'RTF',
        FieldValue: instruction
      },
      {
        Title: 'Warning',
        Position: 2,
        Active: 'true',
        FieldCategory: 'WARN',
        FieldType: 'RTF',
        FieldValue: warning
      },
      {
        Title: 'Hint',
        Position: 3,
        Active: 'true',
        FieldCategory: 'HINT',
        FieldType: 'RTF',
        FieldValue: hints
      },
      {
        Title: 'Reaction Plan',
        Position: 4,
        Active: 'true',
        FieldCategory: 'REACTION PLAN',
        FieldType: 'RTF',
        FieldValue: reaction
      }
    ];
    return JSON.stringify(fieldsObject);
  }

  addCategory = (cat, info: ErrorInfo = {} as ErrorInfo) => {
    const newCategory = {
      Category_Name: cat,
      CId: null,
      Cover_Image: 'assets/work-instructions-icons/img/brand/category-placeholder.png'
    };
    return this._instructionSvc.addCategory({
        CId: newCategory.CId,
        Category_Name: newCategory.Category_Name,
        Cover_Image: newCategory.Cover_Image
      },
      info
    );
  }

  setStepAttachments = (stepData) => {
    const keys = Object.keys(stepData);
    const attachments = keys.map(key => {
      if (/Attachment_(\d+)_Name/.test(key)) {
        return key;
      }
    }).filter(val => val);
    let att = [];
    attachments.forEach(value => {
      if (stepData[value].trim()) {
        att = [...att, stepData[value]];
      }
    });
    if (att.length) {
      return JSON.stringify(att);
    } else {
      return null;
    }
  }

  close() {
    this.ref.close();
    if (this.loadResults === true) {
      if (this.getDraftedInstructionsCount() && this.isUploadSuccess()) {
        if (this.isAudioOrVideoFile) {
          this.router.navigate([this.redirectUrl]);
        } else {
          this.router.navigate(['/work-instructions/drafts']);
        }
      } else {
        this.router.navigate(['/work-instructions']);
      }
    } else if (this.loadResults === false) {
      this.router.navigate(['/work-instructions']);
    }
  }

  getBusinessObjects() {
    this._instructionSvc.getAllBusinessObjects().subscribe((resp) => {
      if (resp && resp.length > 0) {
        this.assignedObjectsList = resp;
      }
    });
  }

  businessObject = (obj) => {
    let businessObject: object;
    let fieldName;
    const finalObject = [];
    const Fields = obj.split(',');
    if (this.assignedObjectsList && this.assignedObjectsList.length !== 0) {
      for (let i = 0; i < Fields.length; i++) {
        const splitData = Fields[i].split(':');
        for (let objCnt = 0; objCnt < this.assignedObjectsList.length; objCnt++) {
          if (this.assignedObjectsList[objCnt].FIELDDESCRIPTION === splitData[0]) {
            fieldName = this.assignedObjectsList[objCnt].FILEDNAME;
          }
        }
        businessObject = {
          OBJECTCATEGORY: 'WORKORDER',
          FILEDNAME: fieldName,
          FIELDDESCRIPTION: splitData[0],
          Value: splitData[1],
        };
        finalObject.push({...businessObject});
      }
      businessObject = finalObject;
      return JSON.stringify(businessObject);
    }
  }

  addIns(payload, steps, allKeys, currentInsCnt, currentIns) {
    this.store.dispatch(BulkUploadActions.resetInstructionWithSteps());
    const info: ErrorInfo = { displayToast: false, failureResponse: 'throwError' };
    this._instructionSvc.addInstructionFromImportedData(payload, info).subscribe(
      (headerDataResp) => {
        let instructionWithSteps: InstructionWithSteps;
        currentIns.id = headerDataResp.Id;
        currentIns.WI_Id = headerDataResp.WI_Id;
        instructionWithSteps = { ...instructionWithSteps, instruction: headerDataResp, steps: [] };
        let allSteps = [];
        const filteredSteps = steps.filter(step => step.StepTitle && step.StepTitle !== '');
        let stepPayloads = [];
        if (filteredSteps && filteredSteps.length > 0) {
          for (let cnt = 0; cnt < filteredSteps.length; cnt++) {
            const instruction = headerDataResp;
            if (filteredSteps[cnt].StepTitle && filteredSteps[cnt].StepTitle !== '') {
              const attachments = this.setStepAttachments(filteredSteps[cnt]);
              const stepPayload = {
                Attachment: attachments,
                Description: null,
                Hints: filteredSteps[cnt].Hint ? this.instructionObject(filteredSteps[cnt].Hint, 'Hint') : null,
                Instructions:
                  filteredSteps[cnt].Instruction ? this.instructionObject(filteredSteps[cnt].Instruction, 'Instruction') : null,
                Published: false,
                Reaction_Plan: filteredSteps[cnt].ReactionPlan ?
                  this.instructionObject(filteredSteps[cnt].ReactionPlan, 'Reaction Plan') : null,
                Status: null,
                StepId: '',
                Title: filteredSteps[cnt].StepTitle,
                WI_Id: instruction ? instruction.Id : '',
                Warnings: filteredSteps[cnt].Warning ? this.instructionObject(filteredSteps[cnt].Warning, 'Warning') : null,
                Fields: this.fieldsObject(
                  filteredSteps[cnt].Instruction,
                  filteredSteps[cnt].Warning,
                  filteredSteps[cnt].Hint,
                  filteredSteps[cnt].ReactionPlan,
                  attachments
                ),
                isCloned: null
              };
              stepPayloads = [...stepPayloads, stepPayload];
            }

            if (stepPayloads && stepPayloads.length - 1 === filteredSteps.length - 1) {
              from(stepPayloads)
                .pipe(concatMap(el => this._instructionSvc.addStepFromImportedData(el, info)))
                .subscribe(
                  stepData => {
                    allSteps = [...allSteps, stepData];
                    if (allSteps.length === stepPayloads.length) {
                      instructionWithSteps = { ...instructionWithSteps, steps: allSteps };
                      currentIns.insPostedSuccessfully = true;
                      this.store.dispatch(BulkUploadActions.addInstructionWithSteps(instructionWithSteps));
                      if (currentInsCnt + 1 === allKeys.length) {
                        this.loadResults = true;
                      }
                    }
                  },
                  error => {
                    this.errorHandlerService.handleError(error);
                    currentIns.insPostingFailed = true;
                    const index = this.ins.findIndex(ins => ins.id === currentIns.id);
                    this.deleteIns(currentIns, index, false);
                    if (currentInsCnt + 1 === allKeys.length) {
                      this.loadResults = true;
                    }
                  }
                );
            }
          }
        } else {
          if (allKeys.length > 0) {
            currentIns.insPostedSuccessfully = true;
            this.loadResults = true;
            this.store.dispatch(BulkUploadActions.addInstructionWithSteps(instructionWithSteps));
          }
        }
      },
      error => {
        this.errorHandlerService.handleError(error);
        currentIns.insPostingFailed = true;
        if (currentInsCnt + 1 === allKeys.length) {
          this.loadResults = true;
        }
      }
    );
  }

  deleteIns(ins, i, displayAlert = true) {
    const info: ErrorInfo = { displayToast: false, failureResponse: 'throwError' };
    this._instructionSvc.deleteWorkInstruction$(ins.id, info)
      .subscribe(
        data => {
          if (displayAlert) {
            this.alertService.success('Instruction has be deleted');
            this.ins[i].insDeletedSuccessfully = true;
          }
        },
        err => {
          if (displayAlert) {
            this.alertService.error(this.errorHandlerService.getErrorMessage(err));
          }
        }
      );
  }

  prequisiteObject = (prerequisite, type) => {
    const prereq = prerequisite.split(',');
    let prerequisiteObject: object = {
      Active: 'true',
      FieldCategory: 'HEADER',
      FieldType: 'RTF',
    };
    switch (type) {
      case 'Tools': {
        prerequisiteObject = {...prerequisiteObject, Title: 'Tools', Position: 0, FieldValue: prereq};
        break;
      }
      case 'SafetyKit': {
        prerequisiteObject = {...prerequisiteObject, Title: 'SafetyKit', Position: 1, FieldValue: prereq};
        break;
      }
      case 'Spareparts': {
        prerequisiteObject = {...prerequisiteObject, Title: 'Spareparts', Position: 2, FieldValue: prereq};
        break;
      }
    }
    return JSON.stringify(prerequisiteObject);
  }

  ngOnInit(): void {
    this.uploadInfoSubscription = this.wiCommonService.uploadInfoAction$
      .subscribe(
        info => {
          const { message, progress, wiName, id, isError } = info;
          if (progress === 100) {
            this.loadResults = true;
            this.redirectUrl += `/${id}`;
            let insPostedSuccessfully = true;
            let insPostingFailed = false;
            let instructionName = wiName;

            if (isError) {
              insPostedSuccessfully = false;
              insPostingFailed = true;
              instructionName = message;
            }

            this.ins = [ ...this.ins, { id, instructionName, insPostedSuccessfully, insPostingFailed }];
          }
          this.uploadInfo = info;
        }
      );

    let data = this.ref.data;
    const { isAudioOrVideoFile, redirectUrl } = data;
    this.isAudioOrVideoFile = isAudioOrVideoFile;
    this.redirectUrl = redirectUrl;
    delete data.isAudioOrVideoFile;
    delete data.redirectUrl;

    if (isAudioOrVideoFile) {
      this.uploadInfo = data;
    } else {
      this.getBusinessObjects();
      const allKeys = data ? Object.keys(data) : [];
      for (let fieldKey = 0; fieldKey < allKeys.length; fieldKey++) {
        let steps = this.steps;
        steps = data[allKeys[fieldKey]];
        if (steps && steps.length !== 0) {
          const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
          const insResultedObject = {
            instructionName: steps[0].WorkInstruction,
            insPostedSuccessfully: false,
            insPostingFailed: false,
          };
          this.ins = [...this.ins, insResultedObject];
          const instructionHeaderPayload = {
            AssignedObjects: this.businessObject(steps[0].AssignedObjects),
            Categories: null,
            CreatedBy: loggedInUser.first_name + ' ' + loggedInUser.last_name,
            created_at: '',
            EditedBy: loggedInUser.first_name + ' ' + loggedInUser.last_name,
            IsFavorite: false,
            IsPublishedTillSave: false,
            Published: false,
            SafetyKit: this.prequisiteObject(steps[0].SafetyKit, 'SafetyKit'),
            SpareParts: this.prequisiteObject(steps[0].SpareParts, 'Spareparts'),
            Tools: this.prequisiteObject(steps[0].Tools, 'Tools'),
            Cover_Image: steps[0].Cover_Image_Name,
            WI_Desc: null,
            WI_Id: null,
            WI_Name: steps[0].WorkInstruction.trim(),
            updated_at: ''
          };
          const info: ErrorInfo = { displayToast: false, failureResponse: 'throwError' };
          const catgrs = steps[0].Category?.trim().length ? steps[0].Category.split(',') : [];
  
          from(catgrs)
            .pipe(
              concatMap((category: string) => {
                category = category.trim();
                return this._instructionSvc.getCategoriesByName(category, info)
                  .pipe(
                    mergeMap(data => {
                      if (data.length === 0) {
                        return this.addCategory(category, info);
                      } else {
                        return of(data[0]);
                      }
                    })
                  );
              }),
              toArray()
            ).subscribe(
              categories => {
                categories = categories.filter(category => category.Category_Name?.toLowerCase() !== 'unassigned');
                instructionHeaderPayload.Categories = JSON.stringify(categories);
                if (steps.length === 1) {
                  this.addIns(instructionHeaderPayload, [], allKeys, fieldKey, insResultedObject);
                } else {
                  this.addIns(instructionHeaderPayload, steps, allKeys, fieldKey, insResultedObject);
                }
              },
              error => {
                this.errorHandlerService.handleError(error);
                insResultedObject.insPostingFailed = true;
                if (fieldKey + 1 === allKeys.length) {
                  this.loadResults = true;
                }
              }
            );
        }
      }
    }
  }

  /**
   * Returns no of successful drafted instrcutions
   *
   * @return number drafted instructions count
   */
  getDraftedInstructionsCount = (): number => {
    const draftedIns = this.ins.filter(ins => ins.insPostedSuccessfully === true && ins.insDeletedSuccessfully !== true);
    return draftedIns.length;
  }

  /**
   * Returns no of successful deleted instrcutions
   *
   * @return number deleted instructions count
   */
   getDeletedInstructionsCount = (): number => {
    const deletedIns = this.ins.filter(ins => ins.insDeletedSuccessfully === true);
    return deletedIns.length;
  }

  /**
   * Returns WI's upload is success or not based on success >= failure
   *
   * @returns boolean
   */
  isUploadSuccess = (): boolean => {
    const successIns = this.ins.filter(ins => ins.insPostedSuccessfully === true);
    const failedIns = this.ins.length - successIns.length;
    if (successIns.length >= failedIns) {
      return true;
    } else {
      return false;
    }
  }

  getBorderStyle = (hide: boolean = false) => {
    let border;
    if (this.isAudioOrVideoFile && this.uploadInfo.progress !== 100) {
      border = 0;
    } else if (hide && this.getDeletedInstructionsCount() === this.ins.length) {
      border = 0;
    } else {
      border = '1px solid #c8ced3';
    }
    return { 'border-top': border };
  }

  ngOnDestroy(): void {
    if (this.uploadInfoSubscription) {
      this.uploadInfoSubscription.unsubscribe();
    }
  }
}
