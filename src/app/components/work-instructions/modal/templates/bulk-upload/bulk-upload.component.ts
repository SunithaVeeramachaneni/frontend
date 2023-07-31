/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MyOverlayRef } from '../../myoverlay-ref';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { InstructionService } from '../../../services/instruction.service';
import { Router } from '@angular/router';
import { concatMap, map, mergeMap, toArray } from 'rxjs/operators';
import { AlertService } from '../../alert/alert.service';
import { from, of, Subscription } from 'rxjs';
import {
  ErrorInfo,
  ImportFileEventData,
  Instruction
} from '../../../../../interfaces';
import { InstructionWithSteps, State } from '../../state/bulkupload.reducer';
import { Store } from '@ngrx/store';
import * as BulkUploadActions from '../../state/bulkupload.actions';
import { ErrorHandlerService } from '../../../../../shared/error-handler/error-handler.service';
import { WiCommonService } from '../../../services/wi-common.services';
import { defaultCategoryName } from '../../../../../app.constants';

@Component({
  selector: 'app-bulk-upload',
  templateUrl: './bulk-upload.component.html',
  styleUrls: ['./bulk-upload.component.scss']
})
export class BulkUploadComponent implements OnInit, OnDestroy {
  public ins = [];
  loadResults = false;
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  isAudioOrVideoFile: boolean;
  successUrl: string;
  failureUrl: string;
  s3Folder: string;
  uploadInfo: ImportFileEventData;
  private uploadInfoSubscription: Subscription;

  constructor(
    public ref: MyOverlayRef,
    private alertService: AlertService,
    private _instructionSvc: InstructionService,
    private router: Router,
    private store: Store<State>,
    private errorHandlerService: ErrorHandlerService,
    private wiCommonService: WiCommonService
  ) {}

  getStepField = (value: string, field: string) => {
    value = value.trim();
    let stepFieldObject: object = {
      Title: field,
      Active: 'true',
      FieldValue: value ? this.convertStrToList(value) : ''
    };
    switch (field) {
      case 'Instruction': {
        stepFieldObject = {
          ...stepFieldObject,
          Position: 1,
          FieldType: 'RTF',
          FieldCategory: 'INS'
        };
        break;
      }
      case 'Warning': {
        stepFieldObject = {
          ...stepFieldObject,
          Position: 2,
          FieldType: 'RTF',
          FieldCategory: 'WARN'
        };
        break;
      }
      case 'Hint': {
        stepFieldObject = {
          ...stepFieldObject,
          Position: 3,
          FieldType: 'RTF',
          FieldCategory: 'HINT'
        };
        break;
      }
      case 'ReactionPlan': {
        stepFieldObject = {
          ...stepFieldObject,
          Position: 4,
          FieldType: 'RTF',
          FieldCategory: 'REACTION PLAN'
        };
        break;
      }
    }
    return JSON.stringify(stepFieldObject);
  };

  convertStrToList(value: string) {
    if (/1\./.test(value)) {
      const numberedList = value.split(/^\d+\.+\s+|\s\d\.\s/);
      const listInfo = numberedList.shift();
      const numberedListResult =
        '<ol><li>' + numberedList.join('</li><li>') + '</li></ol>';
      return listInfo.trim()
        ? `<p>${listInfo}</p>${numberedListResult}`
        : numberedListResult;
    } else if (/●/.test(value)) {
      const bulletedList = value.split('●');
      const listInfo = bulletedList.shift();
      const bulletedListResult =
        '<ul><li>' + bulletedList.join('</li><li>') + '</li></ul>';
      return listInfo.trim()
        ? `<p>${listInfo}</p>${bulletedListResult}`
        : bulletedListResult;
    } else {
      const para = '<p>' + value + '</p>';
      return para;
    }
  }

  getStepFields = (
    ins: string,
    warn: string,
    hint: string,
    reactionplan: string,
    attachments: string
  ) => {
    ins = ins.trim();
    warn = warn.trim();
    hint = hint.trim();
    reactionplan = reactionplan.trim();
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
  };

  addCategory = (cat: string, info: ErrorInfo = {} as ErrorInfo) => {
    const newCategory = {
      Category_Name: cat,
      CId: null,
      Cover_Image:
        'assets/work-instructions-icons/img/brand/category-placeholder.png'
    };
    return this._instructionSvc.addCategory(
      {
        CId: newCategory.CId,
        Category_Name: newCategory.Category_Name,
        Cover_Image: newCategory.Cover_Image
      },
      info
    );
  };

  getStepAttachments = (stepData: any): string | null => {
    const keys = Object.keys(stepData);
    const attachments = keys
      .map((key) => {
        if (/Attachment_(\d+)_Name/.test(key)) {
          return key;
        }
      })
      .filter((val) => val);
    let att = [];
    attachments.forEach((value) => {
      if (stepData[value].trim() && stepData[value.split('_Name')[0]]) {
        if (!att.includes(stepData[value])) {
          att = [...att, stepData[value]];
        }
      }
    });
    if (att.length) {
      return JSON.stringify(att);
    } else {
      return null;
    }
  };

  close() {
    this.ref.close();
    if (this.loadResults === true) {
      if (this.getDraftedInstructionsCount() && this.isUploadSuccess()) {
        this.router.navigate([this.successUrl]);
      } else {
        this.wiCommonService.fetchCategories();
        this.router.navigate([this.failureUrl]);
      }
    } else if (this.loadResults === false) {
      this.wiCommonService.fetchCategories();
      this.router.navigate([this.failureUrl]);
    }
  }

  getBusinessObjects = (
    assignedObjectsString: string,
    businessObjects: any
  ) => {
    const assignedObjects = assignedObjectsString
      ? assignedObjectsString.split(',')
      : [];
    let objectsValue = {};
    for (const assignedObject of assignedObjects) {
      const details = assignedObject.split(':');
      const [description, value] = details;
      if (
        description &&
        value &&
        description.trim() &&
        value.trim() &&
        value.trim().toLowerCase() !== '{value}'
      ) {
        objectsValue = { ...objectsValue, [description.trim()]: value.trim() };
      }
    }

    const filteredBusinessObjects = businessObjects
      .map(function (businessObject: any) {
        const { FIELDDESCRIPTION } = businessObject;
        const Value = this[FIELDDESCRIPTION];
        if (Value) {
          return { ...businessObject, Value };
        }
      }, objectsValue)
      .filter((object: any) => object);

    return filteredBusinessObjects.length
      ? JSON.stringify(filteredBusinessObjects)
      : null;
  };

  addIns(
    payload: Instruction,
    steps: any,
    allKeys: any,
    currentInsCnt: number,
    currentIns: any,
    s3Folder: string
  ) {
    this.store.dispatch(BulkUploadActions.resetInstructionWithSteps());
    const info: ErrorInfo = {
      displayToast: false,
      failureResponse: 'throwError'
    };
    this._instructionSvc
      .addInstructionFromImportedData(payload, s3Folder, info)
      .subscribe(
        (headerDataResp) => {
          let instructionWithSteps: InstructionWithSteps;
          currentIns.id = headerDataResp.Id;
          currentIns.WI_Id = headerDataResp.WI_Id;
          instructionWithSteps = {
            ...instructionWithSteps,
            instruction: headerDataResp,
            steps: []
          };
          let allSteps = [];
          const filteredSteps = steps.filter(
            (step) => step.StepTitle && step.StepTitle !== ''
          );
          let stepPayloads = [];
          if (filteredSteps && filteredSteps.length > 0) {
            for (let cnt = 0; cnt < filteredSteps.length; cnt++) {
              const instruction = headerDataResp;
              if (
                filteredSteps[cnt].StepTitle &&
                filteredSteps[cnt].StepTitle !== ''
              ) {
                const attachments = this.getStepAttachments(filteredSteps[cnt]);
                const stepPayload = {
                  Attachment: attachments,
                  Description: null,
                  Hints: filteredSteps[cnt].Hint
                    ? this.getStepField(filteredSteps[cnt].Hint, 'Hint')
                    : null,
                  Instructions: filteredSteps[cnt].Instruction
                    ? this.getStepField(
                        filteredSteps[cnt].Instruction,
                        'Instruction'
                      )
                    : null,
                  Published: false,
                  Reaction_Plan: filteredSteps[cnt].ReactionPlan
                    ? this.getStepField(
                        filteredSteps[cnt].ReactionPlan,
                        'Reaction Plan'
                      )
                    : null,
                  Status: null,
                  StepId: '',
                  Title: filteredSteps[cnt].StepTitle,
                  WI_Id: instruction ? instruction.Id : '',
                  Warnings: filteredSteps[cnt].Warning
                    ? this.getStepField(filteredSteps[cnt].Warning, 'Warning')
                    : null,
                  Fields: this.getStepFields(
                    filteredSteps[cnt].Instruction
                      ? filteredSteps[cnt].Instruction
                      : '',
                    filteredSteps[cnt].Warning
                      ? filteredSteps[cnt].Warning
                      : '',
                    filteredSteps[cnt].Hint ? filteredSteps[cnt].Hint : '',
                    filteredSteps[cnt].ReactionPlan
                      ? filteredSteps[cnt].ReactionPlan
                      : '',
                    attachments
                  ),
                  isCloned: null
                };
                stepPayloads = [...stepPayloads, stepPayload];
              }

              if (
                stepPayloads &&
                stepPayloads.length - 1 === filteredSteps.length - 1
              ) {
                from(stepPayloads)
                  .pipe(
                    concatMap((el) =>
                      this._instructionSvc.addStepFromImportedData(el, info)
                    )
                  )
                  .subscribe(
                    (stepData) => {
                      allSteps = [...allSteps, stepData];
                      if (allSteps.length === stepPayloads.length) {
                        from(allSteps)
                          .pipe(
                            mergeMap((step) => {
                              if (
                                Object.keys(step).length &&
                                step.Attachment &&
                                JSON.parse(step.Attachment).length
                              ) {
                                return this._instructionSvc
                                  .copyFiles(
                                    {
                                      folderPath: s3Folder,
                                      newFolderPath: `${step.WI_Id}/${step.StepId}`,
                                      copyFiles: JSON.parse(step.Attachment)
                                    },
                                    info
                                  )
                                  .pipe(map(() => step));
                              } else {
                                return of(step);
                              }
                            }),
                            toArray()
                          )
                          .subscribe(() => {
                            instructionWithSteps = {
                              ...instructionWithSteps,
                              steps: allSteps
                            };
                            currentIns.insPostedSuccessfully = true;
                            this.store.dispatch(
                              BulkUploadActions.addInstructionWithSteps(
                                instructionWithSteps
                              )
                            );
                            if (currentInsCnt + 1 === allKeys.length) {
                              this.loadResults = true;
                              this.deleteFiles(s3Folder);
                            }
                          });
                      }
                    },
                    (error) => {
                      this.errorHandlerService.handleError(error);
                      currentIns.insPostingFailed = true;
                      const index = this.ins.findIndex(
                        (ins) => ins.id === currentIns.id
                      );
                      this.deleteIns(currentIns, index, false);
                      if (currentInsCnt + 1 === allKeys.length) {
                        this.loadResults = true;
                        this.deleteFiles(s3Folder);
                      }
                    }
                  );
              }
            }
          } else {
            if (allKeys.length > 0) {
              currentIns.insPostedSuccessfully = true;
              this.loadResults = true;
              this.deleteFiles(s3Folder);
              this.store.dispatch(
                BulkUploadActions.addInstructionWithSteps(instructionWithSteps)
              );
            }
          }
        },
        (error) => {
          this.errorHandlerService.handleError(error);
          currentIns.insPostingFailed = true;
          if (currentInsCnt + 1 === allKeys.length) {
            this.loadResults = true;
            this.deleteFiles(s3Folder);
          }
        }
      );
  }

  deleteIns(ins, i, displayAlert = true) {
    const info: ErrorInfo = {
      displayToast: false,
      failureResponse: 'throwError'
    };
    this._instructionSvc.deleteWorkInstruction$(ins.id, info).subscribe(
      (data) => {
        if (displayAlert) {
          this.alertService.success('Instruction has be deleted');
          this.ins[i].insDeletedSuccessfully = true;
        }
      },
      (err) => {
        this.alertService.error(this.errorHandlerService.getErrorMessage(err));
      }
    );
  }

  getPrerequisite = (value: string, type: string) => {
    value = value.trim();
    if (value) {
      const prereq = value.split(',');
      let prerequisiteObject: object = {
        Active: 'true',
        FieldCategory: 'HEADER',
        FieldType: 'RTF'
      };
      switch (type) {
        case 'Tools': {
          prerequisiteObject = {
            ...prerequisiteObject,
            Title: 'Tools',
            Position: 0,
            FieldValue: prereq
          };
          break;
        }
        case 'SafetyKit': {
          prerequisiteObject = {
            ...prerequisiteObject,
            Title: 'SafetyKit',
            Position: 1,
            FieldValue: prereq
          };
          break;
        }
        case 'Spareparts': {
          prerequisiteObject = {
            ...prerequisiteObject,
            Title: 'Spareparts',
            Position: 2,
            FieldValue: prereq
          };
          break;
        }
      }
      return JSON.stringify(prerequisiteObject);
    } else {
      return null;
    }
  };

  ngOnInit(): void {
    this.uploadInfoSubscription =
      this.wiCommonService.uploadInfoAction$.subscribe((info) => {
        const { message, progress, wiName, id, isError } = info;
        if (progress === 100) {
          this.loadResults = true;
          this.successUrl += `/${id}`;
          let insPostedSuccessfully = true;
          let insPostingFailed = false;
          let instructionName = wiName;

          if (isError) {
            insPostedSuccessfully = false;
            insPostingFailed = true;
            instructionName = message;
          }

          this.ins = [
            ...this.ins,
            { id, instructionName, insPostedSuccessfully, insPostingFailed }
          ];
        }
        this.uploadInfo = info;
      });

    const data = this.ref.data;
    const { isAudioOrVideoFile, successUrl, failureUrl, s3Folder } = data;
    this.isAudioOrVideoFile = isAudioOrVideoFile;
    this.successUrl = successUrl;
    this.failureUrl = failureUrl;
    this.s3Folder = s3Folder;
    delete data.isAudioOrVideoFile;
    delete data.successUrl;
    delete data.failureUrl;
    delete data.s3Folder;
    this.ins = [];

    if (isAudioOrVideoFile) {
      this.uploadInfo = data;
    } else {
      const allKeys = data ? Object.keys(data) : [];
      if (allKeys.length) {
        this._instructionSvc
          .getAllBusinessObjects()
          .pipe(
            map((businessObjects) => {
              let objects = [];
              for (let businessObject of businessObjects) {
                delete businessObject.APPNAME;
                delete businessObject.__metadata;
                businessObject = { ...businessObject, Value: '' };
                objects = [...objects, businessObject];
              }
              return objects;
            })
          )
          .subscribe((businessObjects) => {
            for (let fieldKey = 0; fieldKey < allKeys.length; fieldKey++) {
              const steps = data[allKeys[fieldKey]];
              if (steps && steps.length !== 0) {
                const loggedInUser = JSON.parse(
                  localStorage.getItem('loggedInUser')
                );
                const insResultedObject = {
                  instructionName: steps[0].WorkInstruction,
                  insPostedSuccessfully: false,
                  insPostingFailed: false
                };
                this.ins = [...this.ins, insResultedObject];
                const instructionHeaderPayload = {
                  AssignedObjects: this.getBusinessObjects(
                    steps[0].AssignedObjects,
                    businessObjects
                  ),
                  Categories: null,
                  CreatedBy:
                    loggedInUser.first_name + ' ' + loggedInUser.last_name,
                  EditedBy:
                    loggedInUser.first_name + ' ' + loggedInUser.last_name,
                  IsFavorite: false,
                  IsPublishedTillSave: false,
                  Published: false,
                  SafetyKit: steps[0].SafetyKit
                    ? this.getPrerequisite(steps[0].SafetyKit, 'SafetyKit')
                    : null,
                  SpareParts: steps[0].SpareParts
                    ? this.getPrerequisite(steps[0].SpareParts, 'Spareparts')
                    : null,
                  Tools: steps[0].Tools
                    ? this.getPrerequisite(steps[0].Tools, 'Tools')
                    : null,
                  Cover_Image: steps[0].Cover_Image
                    ? steps[0].Cover_Image_Name
                    : 'assets/work-instructions-icons/img/brand/doc-placeholder.png',
                  WI_Desc: null,
                  WI_Id: null,
                  WI_Name: steps[0].WorkInstruction.trim(),
                  Equipements: null,
                  Locations: null,
                  IsAudioOrVideoFileDeleted: false,
                  IsFromAudioOrVideoFile: false,
                  FilePath: null,
                  FileType: null,
                  Id: null
                } as Instruction;
                const info: ErrorInfo = {
                  displayToast: false,
                  failureResponse: 'throwError'
                };
                const catgrs = steps[0].Category?.trim().length
                  ? steps[0].Category.split(',')
                  : [];

                from(catgrs)
                  .pipe(
                    concatMap((category: string) => {
                      category = category.trim();
                      return this._instructionSvc
                        .getCategoriesByName(category, info)
                        .pipe(
                          mergeMap((data) => {
                            if (data.length === 0) {
                              return this.addCategory(category, info);
                            } else {
                              return of(data[0]);
                            }
                          })
                        );
                    }),
                    toArray()
                  )
                  .subscribe(
                    (categories) => {
                      const catIds = categories
                        .map((category) => {
                          if (
                            category.Category_Name?.toLowerCase() !==
                            defaultCategoryName.toLowerCase()
                          ) {
                            return category.Category_Id;
                          }
                        })
                        .filter((categoryId) => categoryId);
                      instructionHeaderPayload.Categories =
                        JSON.stringify(catIds);
                      if (steps.length === 1) {
                        this.addIns(
                          instructionHeaderPayload,
                          [],
                          allKeys,
                          fieldKey,
                          insResultedObject,
                          this.s3Folder
                        );
                      } else {
                        this.addIns(
                          instructionHeaderPayload,
                          steps,
                          allKeys,
                          fieldKey,
                          insResultedObject,
                          this.s3Folder
                        );
                      }
                    },
                    (error) => {
                      this.errorHandlerService.handleError(error);
                      insResultedObject.insPostingFailed = true;
                      if (fieldKey + 1 === allKeys.length) {
                        this.loadResults = true;
                        this.deleteFiles(this.s3Folder);
                      }
                    }
                  );
              }
            }
          });
      }
    }
  }

  /**
   * Returns no of successful drafted instrcutions
   *
   * @return number drafted instructions count
   */
  getDraftedInstructionsCount = (): number => {
    const draftedIns = this.ins.filter(
      (ins) =>
        ins.insPostedSuccessfully === true &&
        ins.insDeletedSuccessfully !== true
    );
    return draftedIns.length;
  };

  /**
   * Returns no of successful deleted instrcutions
   *
   * @return number deleted instructions count
   */
  getDeletedInstructionsCount = (): number => {
    const deletedIns = this.ins.filter(
      (ins) => ins.insDeletedSuccessfully === true
    );
    return deletedIns.length;
  };

  /**
   * Returns WI's upload is success or not based on success >= failure
   *
   * @returns boolean
   */
  isUploadSuccess = (): boolean => {
    const successIns = this.ins.filter(
      (ins) => ins.insPostedSuccessfully === true
    );
    const failedIns = this.ins.length - successIns.length;
    if (successIns.length >= failedIns) {
      return true;
    } else {
      return false;
    }
  };

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
  };

  deleteFiles = (folderPath: string) => {
    this._instructionSvc.deleteFiles(folderPath).subscribe();
  };

  ngOnDestroy(): void {
    if (this.uploadInfoSubscription) {
      this.uploadInfoSubscription.unsubscribe();
    }
  }
}
