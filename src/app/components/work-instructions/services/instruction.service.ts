/* eslint-disable arrow-body-style */
/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/naming-convention */
import { concatMap, map, mergeMap, switchMap, toArray } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AppService } from '../../../shared/services/app.services';
import {
  combineLatest,
  forkJoin,
  from,
  Observable,
  of,
  throwError,
  BehaviorSubject
} from 'rxjs';
import {
  Category,
  CategoryOptional,
  ErrorInfo,
  Instruction,
  InstructionOptional,
  PublishInstruction,
  User,
  Step,
  StepOptional,
  DeleteFileResponse,
  UploadS3FileResponse,
  Files,
  RenameFileInfo,
  CopyFilesPathInfo,
  CategoryObject
} from '../../../interfaces';
import { HttpErrorResponse } from '@angular/common/http';
import { Store } from '@ngrx/store';
import * as InstructionActions from '../state/intruction.actions';
import { environment } from '../../../../environments/environment';
import { defaultCategoryId } from '../../../app.constants';
import { State } from '../state/instruction.reducer';

export interface InstructionQuery {
  search: string;
}

@Injectable({ providedIn: 'root' })
export class InstructionService {
  stepsData$: BehaviorSubject<any> = new BehaviorSubject({});
  constructor(private _appService: AppService, private store: Store<State>) {}

  getCategoriesObject = (categories: Category[]): CategoryObject =>
    categories.reduce((acc, val) => {
      const { Category_Id, Category_Name, Cover_Image } = val;
      acc = {
        ...acc,
        [Category_Id]: { Category_Id, Category_Name, Cover_Image }
      };
      return acc;
    }, {});

  getUsers(info: ErrorInfo = {} as ErrorInfo): Observable<User[]> {
    return of([]); // TODO - Need to call actual users endpoint from UserService
  }

  getAllCategories(info: ErrorInfo = {} as ErrorInfo): Observable<Category[]> {
    return this._appService._getResp(environment.wiApiUrl, 'categories', info);
  }

  getFiles(
    folderPath: string,
    recursive: boolean = false,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<Files[]> {
    return this._appService._getRespByName(
      environment.wiApiUrl,
      `getFiles?folderPath=${folderPath}&recursive=${recursive}`,
      '',
      info
    );
  }

  getAllInstructionsByFilePath(
    filePath: string,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<Instruction[]> {
    return this._appService._getRespByName(
      environment.wiApiUrl,
      'getInstructionsByFile?filePath=',
      filePath,
      info
    );
  }

  getSelectedCategory(
    categoryId: string,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<Category> {
    return this._appService._getRespById(
      environment.wiApiUrl,
      'categories/',
      categoryId,
      info
    );
  }

  getCategoriesByName(
    catName: string,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<Category[]> {
    return this._appService._getRespByName(
      environment.wiApiUrl,
      'getCategoriesByName/',
      catName,
      info
    );
  }

  addCategory(
    category: Category | CategoryOptional,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<Category> {
    return this._appService._postData(
      environment.wiApiUrl,
      'addCategory',
      category,
      info
    );
  }

  updateCategory(
    category: Category,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<Category> {
    return this._appService
      ._updateData(
        environment.wiApiUrl,
        `updateCategory/${category.Category_Id}`,
        category,
        info
      )
      .pipe(map((resp) => (resp === null ? category : resp)));
  }

  removeCategory(
    category: Category,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<Category> {
    return this._appService
      ._removeData(
        environment.wiApiUrl,
        `deleteCategory/${category.Category_Id}`,
        info
      )
      .pipe(map((resp) => (resp === null ? category : resp)));
  }

  getAllBusinessObjects(info: ErrorInfo = {} as ErrorInfo): Observable<any[]> {
    return this._appService._getRespFromGateway(
      environment.wiAbapApiUrl,
      'businessObjects',
      info
    );
  }

  getFavInstructions(
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<Instruction[]> {
    return this.workInstructionsWithCategories$('favInstructions', info);
  }

  getDraftedInstructions(
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<Instruction[]> {
    return this.workInstructionsWithCategories$('draftedInstructions', info);
  }

  getPublishedInstructions(
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<Instruction[]> {
    return this.workInstructionsWithCategories$('publishedInstructions', info);
  }

  getRecentInstructions(
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<Instruction[]> {
    return this.workInstructionsWithCategories$('allRecentInstructions', info);
  }

  getAllInstructions(
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<Instruction[]> {
    return this._appService._getResp(
      environment.wiApiUrl,
      'allInstructions',
      info
    );
  }

  editWorkInstructionTitle(
    wid: string,
    user: User,
    ins: Instruction,
    info: ErrorInfo
  ): Observable<Instruction> {
    return this.editInstructionTitle$(wid, user, ins, info);
  }

  getDraftedAndPublished(wid: string, info: ErrorInfo): Observable<any[]> {
    return this.getInstructionsById(wid, info).pipe(
      mergeMap((instruction: Instruction) => {
        const instructionToRetrieve = {
          APPNAME: 'MWORKORDER',
          FORMNAME: 'WI_' + instruction.Id.toString(),
          WINSTRIND: 'X'
        };
        const publishedIns = this.getInstructionsFromGateway(
          instructionToRetrieve,
          info
        );
        return publishedIns;
      })
    );
  }

  addWorkInstructionTitle(
    user: User,
    ins: Instruction | InstructionOptional,
    info: ErrorInfo
  ): Observable<Instruction> {
    return this.addInstructionTitle$(user, ins, info);
  }

  setFavoriteInstructions(
    id: string,
    info: ErrorInfo
  ): Observable<Instruction> {
    return this.setFavoriteInstruction$(id, info);
  }

  getInstructionsByName(
    wiName: string,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<Instruction[]> {
    return this._appService._getRespByName(
      environment.wiApiUrl,
      'getInstructionsByName/',
      wiName,
      info
    );
  }

  getCopyInstructionsByName(
    wiName: string,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<Instruction[]> {
    return this._appService._getRespByName(
      environment.wiApiUrl,
      'getCopyInstructionsByName/',
      wiName,
      info
    );
  }

  getInstructionsById(
    id: string,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<Instruction> {
    return this._appService._getRespById(
      environment.wiApiUrl,
      'allInstructions/',
      id,
      info
    );
  }

  getInstructionsByCategoryId(
    categoryId: string,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<Instruction[]> {
    const { displayToast, failureResponse = [] } = info;
    return this._appService._getRespById(
      environment.wiApiUrl,
      'allInstructionsByCategory/',
      categoryId,
      { displayToast, failureResponse }
    );
  }

  getInstructionsFromGateway(
    params: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any[]> {
    return this._appService._getDataFromGatewayById(
      environment.wiAbapApiUrl,
      'publishedInstructionsByName',
      params,
      info
    );
  }

  addWorkInstruction(
    instruction: Instruction | InstructionOptional,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<Instruction> {
    return this._appService._postData(
      environment.wiApiUrl,
      'addWorkInstruction',
      instruction,
      info
    );
  }

  addWorkInstructionToGateway(
    payload: any,
    params = {},
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<{ status: number }> {
    return this._appService
      ._postDataToGateway(
        environment.wiAbapApiUrl,
        'publishInstruction',
        payload,
        info
      )
      .pipe(map((resp) => (resp === null ? payload : resp)));
  }

  updateWorkInstruction(
    instruction: Instruction,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<Instruction> {
    return this._appService
      ._updateData(
        environment.wiApiUrl,
        'updateInstruction/' + instruction.Id,
        instruction,
        info
      )
      .pipe(map((resp) => (resp === null ? instruction : resp)));
  }

  updateGatewayWorkInstruction(
    payload: any,
    params = {},
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> {
    return this._appService
      ._putDataToGateway(
        environment.wiAbapApiUrl,
        'updateInstruction',
        payload,
        info
      )
      .pipe(map((resp) => (resp === null ? payload : resp)));
  }

  updateGatewayFavWorkInstruction(
    payload: any,
    params = {},
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> {
    return this._appService
      ._putDataToGateway(
        environment.wiAbapApiUrl,
        'favouriteInstruction',
        payload,
        info
      )
      .pipe(map((resp) => (resp === null ? payload : resp)));
  }

  removeWorkInstruction(
    instruction: Instruction,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<Instruction> {
    return this._appService
      ._removeData(
        environment.wiApiUrl,
        'deleteInstruction/' + instruction.Id,
        info
      )
      .pipe(map((resp) => (resp === null ? instruction : resp)));
  }

  removeWorkInstructionAndSteps(
    instruction: Instruction,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<Instruction> {
    return this._appService
      ._removeData(
        environment.wiApiUrl,
        'deleteInstructionAndSteps/' + instruction.Id,
        info
      )
      .pipe(map((resp) => (resp === null ? instruction : resp)));
  }

  removeWorkInstructionFromGateway(
    payload: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> {
    return this._appService
      ._removeDataFromGateway(
        environment.wiAbapApiUrl,
        'removeInstruction',
        payload,
        info
      )
      .pipe(map((resp) => (resp === null ? payload : resp)));
  }

  publishInstruction(
    { wiToBePublsihed, steps, wid, editedBy }: PublishInstruction,
    info: ErrorInfo
  ): Observable<(Instruction | Step)[]> {
    return this.publishInstruction$(
      { wiToBePublsihed, steps, wid, editedBy },
      info
    );
  }

  getSteps(info: ErrorInfo = {} as ErrorInfo): Observable<Step[]> {
    return this._appService._getResp(environment.wiApiUrl, 'steps', info);
  }

  getStepById(id: string, info: ErrorInfo = {} as ErrorInfo): Observable<Step> {
    return this._appService._getRespById(
      environment.wiApiUrl,
      'steps/',
      id,
      info
    );
  }

  getStepsByWID(
    WID: string,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<Step[]> {
    const { displayToast, failureResponse = [] } = info;
    return this._appService._getRespById(
      environment.wiApiUrl,
      'stepsByInstructionId/',
      WID,
      { displayToast, failureResponse }
    );
  }

  getStepsByName(
    title: string,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<Step[]> {
    return this._appService._getRespByName(
      environment.wiApiUrl,
      'stepByName/',
      title,
      info
    );
  }

  getStepFromGateway(
    params: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> {
    return this._appService._getDataFromGatewayByStep(
      environment.wiAbapApiUrl,
      'getSteps',
      params,
      info
    );
  }

  addStep(
    step: Step | StepOptional,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<Step> {
    return this._appService._postData(
      environment.wiApiUrl,
      'addStep',
      step,
      info
    );
  }

  updateStep(step: Step, info: ErrorInfo = {} as ErrorInfo): Observable<Step> {
    return this._appService
      ._updateData(
        environment.wiApiUrl,
        'updateStep/' + step.StepId,
        step,
        info
      )
      .pipe(map((resp) => (resp === null ? step : resp)));
  }

  removeStep(step: Step, info: ErrorInfo = {} as ErrorInfo): Observable<Step> {
    return this._appService
      ._removeData(environment.wiApiUrl, 'deleteStep/' + step.StepId, info)
      .pipe(map((resp) => (resp === null ? step : resp)));
  }

  removeStepFromGateway(
    payload: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> {
    return this._appService
      ._removeDataFromGateway(
        environment.wiAbapApiUrl,
        'removeStep',
        payload,
        info
      )
      .pipe(map((resp) => (resp === null ? payload : resp)));
  }

  uploadAttachments(
    form: FormData,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<UploadS3FileResponse> {
    return this._appService._postData(
      environment.wiApiUrl,
      'api/v1/upload/',
      form,
      info
    );
  }

  getFile(
    filePath: string,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<{ base64Response: string }> {
    return this._appService._getRespById(
      environment.wiApiUrl,
      'api/v1/getFile?filePath=',
      filePath,
      info
    );
  }

  uploadWIExcel(
    form: FormData,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> {
    return this._appService._postData(
      environment.wiApiUrl,
      'excel/upload-parser',
      form,
      info
    );
  }

  deleteFile(
    filePath: string,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<DeleteFileResponse> {
    return this._appService
      ._removeData(
        environment.wiApiUrl,
        `api/v1/delete?filePath=${filePath}`,
        info
      )
      .pipe(
        map((resp) =>
          resp === null ? { file: filePath.split('/').pop() } : resp
        )
      );
  }

  deleteFiles(
    folderPath: string,
    recursive: boolean = false,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<string> {
    return this._appService
      ._removeData(
        environment.wiApiUrl,
        `deleteFiles?folderPath=${folderPath}&recursive=${recursive}`,
        info
      )
      .pipe(
        map((resp) => (resp === null ? folderPath.split('/').pop() : resp))
      );
  }

  renameFile(
    fileInfo: RenameFileInfo,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<RenameFileInfo> {
    return this._appService
      ._updateData(environment.wiApiUrl, 'renameFile/', fileInfo, info)
      .pipe(map((resp) => (resp === null ? fileInfo : resp)));
  }

  copyFiles(
    pathInfo: CopyFilesPathInfo,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<string[]> {
    return this._appService._postData(
      environment.wiApiUrl,
      'copyFiles/',
      pathInfo,
      info
    );
  }

  newInstructionPromise(
    insPayload: Instruction,
    s3Folder: string,
    info: ErrorInfo
  ): Observable<Instruction> {
    return this.getAllInstructions(info).pipe(
      mergeMap((instructions) => {
        if (instructions && instructions.length > 0) {
          insPayload.WI_Id =
            instructions.length > 0 ? instructions.length + 1 : 1;
        }
        return this.addWorkInstruction(insPayload, info).pipe(
          mergeMap((instruction) => {
            if (
              Object.keys(instruction).length &&
              instruction.Cover_Image.indexOf('assets/') === -1
            ) {
              return this.copyFiles(
                {
                  folderPath: s3Folder,
                  newFolderPath: instruction.Id,
                  copyFiles: [instruction.Cover_Image]
                },
                info
              ).pipe(map(() => instruction));
            } else {
              return of(instruction);
            }
          })
        );
      })
    );
  }

  addInstructionFromImportedData(
    instructionHeaderPayload: Instruction,
    s3Folder: string,
    info: ErrorInfo
  ): Observable<Instruction> {
    const insName = instructionHeaderPayload.WI_Name;
    return this.getInstructionsByName(insName, info).pipe(
      mergeMap((existingInsResp) => {
        const copyString = insName + 'Copy';
        if (existingInsResp && existingInsResp.length > 0) {
          instructionHeaderPayload.WI_Name =
            copyString + '(' + existingInsResp.length + ')';
          return this.getCopyInstructionsByName(copyString, info).pipe(
            mergeMap((copiedInsResp) => {
              if (copiedInsResp && copiedInsResp.length > 0) {
                const copiedInsCount = copiedInsResp.length + 1;
                instructionHeaderPayload.WI_Name =
                  insName + 'Copy(' + copiedInsCount + ')';
                return this.newInstructionPromise(
                  instructionHeaderPayload,
                  s3Folder,
                  info
                );
              } else {
                return this.newInstructionPromise(
                  instructionHeaderPayload,
                  s3Folder,
                  info
                );
              }
            })
          );
        } else {
          return this.newInstructionPromise(
            instructionHeaderPayload,
            s3Folder,
            info
          );
        }
      })
    );
  }

  addStepFromImportedData(
    stepPayload: Step,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<Step> {
    return this.addStep(stepPayload, info);
  }

  copyWorkInstruction(
    title: string,
    userName: User,
    info: ErrorInfo
  ): Observable<{ instruction: Instruction; steps: Step[] }> {
    const getInsPromise = this.getInstructionsByName(title, info);
    return getInsPromise.pipe(
      concatMap((existingInsResp) => {
        const existingIns = existingInsResp[0];
        const copyString = title + 'Copy';
        return this.getCopyInstructionsByName(copyString, info).pipe(
          mergeMap((copiedInsResp) => {
            const cnt = copiedInsResp.length + 1;
            const instructionPayload = {
              WI_Id: existingIns.WI_Id,
              Categories: existingIns.Categories,
              WI_Name: existingIns.WI_Name + 'Copy(' + cnt + ')',
              Tools: existingIns.Tools,
              Equipements: existingIns.Equipements,
              Locations: existingIns.Locations,
              IsFavorite: existingIns.IsFavorite,
              CreatedBy: userName.first_name + ' ' + userName.last_name,
              EditedBy: userName.first_name + ' ' + userName.last_name,
              AssignedObjects: existingIns.AssignedObjects,
              SpareParts: existingIns.SpareParts,
              SafetyKit: existingIns.SafetyKit,
              Published: false,
              IsPublishedTillSave: false,
              Cover_Image: existingIns.Cover_Image
            };

            return this.addWorkInstruction(instructionPayload, info).pipe(
              mergeMap((instruction) => {
                return this.getStepsByWID(existingIns.Id, info).pipe(
                  mergeMap((steps) => {
                    if (steps && steps.length) {
                      return from(steps).pipe(
                        concatMap((step: Step) => {
                          const stepPayload = {
                            Attachment: step.Attachment,
                            Fields: step.Fields,
                            Hints: step.Hints,
                            Instructions: step.Instructions,
                            Published: false,
                            Reaction_Plan: step.Reaction_Plan,
                            Title: step.Title,
                            WI_Id: instruction.Id,
                            Warnings: step.Warnings
                          };
                          return this.addStep(stepPayload, info).pipe(
                            mergeMap((resp) => {
                              if (
                                Object.keys(resp).length &&
                                resp.Attachment &&
                                JSON.parse(resp.Attachment).length
                              ) {
                                return this.copyFiles(
                                  {
                                    folderPath: `${step.WI_Id}/${step.StepId}`,
                                    newFolderPath: `${resp.WI_Id}/${resp.StepId}`
                                  },
                                  info
                                ).pipe(map(() => resp));
                              } else {
                                return of(resp);
                              }
                            })
                          );
                        }),
                        toArray(),
                        mergeMap((response) =>
                          of({ instruction, steps: response })
                        )
                      );
                    } else {
                      return of({ instruction, steps: [] as Step[] });
                    }
                  }),
                  mergeMap(({ instruction, steps }) => {
                    if (
                      Object.keys(instruction).length &&
                      instruction.Cover_Image.indexOf('assets/') === -1
                    ) {
                      return this.copyFiles(
                        {
                          folderPath: `${existingIns.Id}`,
                          newFolderPath: `${instruction.Id}`
                        },
                        info
                      ).pipe(map(() => ({ instruction, steps })));
                    } else {
                      return of({ instruction, steps });
                    }
                  })
                );
              })
            );
          })
        );
      })
    );
  }

  setFavoriteInstruction$ = (
    workInstructionId: string,
    info: ErrorInfo
  ): Observable<Instruction> => {
    const userName = JSON.parse(localStorage.getItem('loggedInUser'));
    let getInstructionPayload = {};
    let updateInstructionPayload = {};
    return this.getInstructionsById(workInstructionId, info).pipe(
      switchMap((workInstruction) => {
        workInstruction.IsFavorite = workInstruction.IsFavorite ? false : true;
        workInstruction.EditedBy =
          userName.first_name + ' ' + userName.last_name;
        const { Id } = workInstruction;
        const FORMNAME = `WI_${Id}`;
        const APPNAME = 'MWORKORDER';
        const FAVOURITE = workInstruction.IsFavorite === false ? '' : 'X';
        const VERSION = '001';
        const WINSTRIND = 'X';
        getInstructionPayload = {
          ...getInstructionPayload,
          APPNAME,
          FORMNAME,
          WINSTRIND
        };
        const updateIns = this.updateWorkInstruction(workInstruction, info);
        const updateInsInABAP = this.getInstructionsFromGateway(
          getInstructionPayload,
          info
        ).pipe(
          mergeMap((res) => {
            updateInstructionPayload = {
              ...updateInstructionPayload,
              APPNAME,
              FORMNAME,
              FORMTITLE: res[0]?.FORMTITLE,
              FAVOURITE,
              VERSION,
              WINSTRIND
            };
            return this.updateGatewayFavWorkInstruction(
              updateInstructionPayload,
              undefined,
              info
            );
          })
        );
        if (workInstruction.Published) {
          return forkJoin({ updateIns, updateInsInABAP }).pipe(
            map((res: { updateIns: Instruction; updateInsInABAP: any }) => {
              return res.updateIns;
            })
          );
        } else {
          return updateIns;
        }
      })
    );
  };

  deleteWorkInstruction$ = (
    workInstructionId: string,
    info: ErrorInfo
  ): Observable<Instruction> => {
    let deleteInstructionPayload = {};
    return this.getInstructionsById(workInstructionId, info).pipe(
      switchMap((workInstruction) => {
        const { Id } = workInstruction;
        const FORMNAME = 'WI_' + `${Id}`;
        const APPNAME = 'MWORKORDER';
        const VERSION = '001';
        const WINSTRIND = 'X';
        const DELIND = 'X';
        deleteInstructionPayload = {
          ...deleteInstructionPayload,
          APPNAME,
          FORMNAME,
          WINSTRIND,
          DELIND,
          VERSION
        };

        return of(workInstruction).pipe(
          mergeMap((workInstructionDetails: Instruction) => {
            const deleteInstruction = this.removeWorkInstructionAndSteps(
              workInstructionDetails,
              info
            );
            const deleteInstructionFromGateway =
              this.removeWorkInstructionFromGateway(
                deleteInstructionPayload,
                info
              );
            if (workInstructionDetails.Published) {
              return forkJoin({
                deleteInstruction,
                deleteInstructionFromGateway
              }).pipe(
                map(
                  (res: {
                    deleteInstruction: Instruction;
                    deleteInstructionFromGateway: any;
                  }) => {
                    return res.deleteInstruction;
                  }
                )
              );
            } else {
              return deleteInstruction;
            }
          }),
          mergeMap((deleteInstruction) => {
            if (Object.keys(deleteInstruction).length) {
              return this.deleteFiles(
                `${deleteInstruction.Id}`,
                true,
                info
              ).pipe(map(() => deleteInstruction));
            } else {
              return of(deleteInstruction);
            }
          })
        );
      })
    );
  };

  addInstructionTitle$ = (
    user: User,
    ins: Instruction | InstructionOptional,
    info: ErrorInfo
  ): Observable<Instruction> => {
    const wiDetail = {
      WI_Id: null,
      Categories: JSON.stringify([defaultCategoryId]),
      WI_Name: ins.WI_Name,
      IsFavorite: false,
      CreatedBy: user.first_name + ' ' + user.last_name,
      EditedBy: user.first_name + ' ' + user.last_name,
      Published: false,
      Cover_Image:
        'assets/work-instructions-icons/img/brand/doc-placeholder.png'
    };
    return this.getAllInstructions(info).pipe(
      mergeMap((instructions) => {
        wiDetail.WI_Id = instructions.length > 0 ? instructions.length + 1 : 1;
        if (wiDetail.WI_Name.length > 0) {
          return this.addWorkInstruction(wiDetail, info);
        } else {
          return of({} as Instruction);
        }
      })
    );
  };

  editInstructionTitle$ = (
    insId: string,
    user: User,
    ins: Instruction,
    info: ErrorInfo
  ): Observable<Instruction> => {
    return this.getInstructionsById(insId, info).pipe(
      mergeMap((instruction) => {
        instruction.WI_Name = ins.WI_Name;
        if (instruction.WI_Name.length > 0) {
          instruction.EditedBy = user.first_name + ' ' + user.last_name;
          return this.updateWorkInstruction(instruction, info);
        } else {
          return of({} as Instruction);
        }
      })
    );
  };

  workInstructionsWithCategories$ = (
    requestType: string,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<Instruction[]> =>
    combineLatest([
      this._appService._getResp(environment.wiApiUrl, requestType, info),
      this.getAllCategories(info)
    ]).pipe(
      map(([workInstructions, categories]: [Instruction[], Category[]]) => {
        const categoriesObj = this.getCategoriesObject(categories);
        return workInstructions.map((workInstruction: Instruction) => {
          const categories = workInstruction.Categories
            ? JSON.parse(workInstruction.Categories).map(
                (categoryId: string) => categoriesObj[categoryId].Category_Name
              )
            : null;
          return {
            ...workInstruction,
            categories
          } as Instruction;
        });
      })
    );

  publishInstruction$ = (
    { wiToBePublsihed, steps, wid, editedBy }: PublishInstruction,
    info: ErrorInfo
  ): Observable<(Instruction | Step)[]> => {
    return this.getInstructionsById(wid, info).pipe(
      switchMap((workInstruction) => {
        if (Object.keys(workInstruction).length) {
          return from(wiToBePublsihed).pipe(
            map((data: any, index: number) => [data, index]),
            mergeMap(([data, index]) => {
              let params: any = {};
              let instructionData = {};
              if (index === 0) {
                params = { index, workInstruction };
              } else {
                params = { index, step: steps[index - 1] };
              }
              const {
                CATEGORY,
                APPNAME,
                VERSION,
                FORMTITLE,
                FORMNAME,
                UNIQUEKEY,
                STEPS,
                WINSTRIND,
                WIDETAILS,
                IMAGECONTENT,
                INSTRUCTION,
                TOOLS,
                PUBLISHED
              } = data;

              instructionData = {
                CATEGORY,
                APPNAME,
                VERSION,
                FORMTITLE,
                FORMNAME,
                UNIQUEKEY,
                STEPS,
                WINSTRIND,
                WIDETAILS,
                IMAGECONTENT,
                INSTRUCTION,
                TOOLS
              };
              if (PUBLISHED) {
                return this.updateGatewayWorkInstruction(
                  { ...instructionData, PUBLISHED },
                  params,
                  info
                ).pipe(
                  mergeMap(() => {
                    if (params.index) {
                      const step = { ...params.step, Published: true };
                      return this.updateStep(step, info).pipe(
                        map((stepData) => {
                          this.store.dispatch(
                            InstructionActions.updateStep({ step: stepData })
                          );
                          return stepData;
                        })
                      );
                    } else {
                      const instruction = {
                        ...params.workInstruction,
                        Published: true,
                        EditedBy: editedBy
                      };
                      return this.updateWorkInstruction(instruction, info).pipe(
                        map((inst) => {
                          this.store.dispatch(
                            InstructionActions.updateInstruction({
                              instruction: inst
                            })
                          );
                          return inst;
                        })
                      );
                    }
                  })
                );
              } else {
                return this.addWorkInstructionToGateway(
                  instructionData,
                  params,
                  info
                ).pipe(
                  mergeMap(() => {
                    if (params.index) {
                      const step = { ...params.step, Published: true };
                      return this.updateStep(step, info).pipe(
                        map((stepData) => {
                          this.store.dispatch(
                            InstructionActions.updateStep({ step: stepData })
                          );
                          return stepData;
                        })
                      );
                    } else {
                      const instruction = {
                        ...params.workInstruction,
                        Published: true,
                        EditedBy: editedBy
                      };
                      return this.updateWorkInstruction(instruction, info).pipe(
                        map((inst) => {
                          this.store.dispatch(
                            InstructionActions.updateInstruction({
                              instruction: inst
                            })
                          );
                          return inst;
                        })
                      );
                    }
                  })
                );
              }
            }),
            toArray()
          );
        } else {
          return throwError({
            message:
              'Unable to publish work instructon. Your publishing work instruction might be deleted!'
          } as HttpErrorResponse);
        }
      })
    );
  };

  deleteCategory$ = (
    category: Category,
    categories: Category[],
    info: ErrorInfo
  ): Observable<Category> => {
    const categoriesUpdated = categories.filter(
      (catgry) => catgry.Category_Id !== category.Category_Id
    );
    const categoriesObject = this.getCategoriesObject(categoriesUpdated);
    return this.getInstructionsByCategoryId(category.Category_Id, info).pipe(
      mergeMap((workInstructions) =>
        from(workInstructions).pipe(
          mergeMap((workInstruction: any) => {
            const categories = JSON.parse(workInstruction.Categories).filter(
              (catgryId: string) => catgryId !== category.Category_Id
            );
            let CATEGORY = categories.map(
              (categoryId: string) => categoriesObject[categoryId]
            );
            CATEGORY = JSON.stringify(CATEGORY);

            const payload = {
              APPNAME: 'MWORKORDER',
              FORMNAME: `WI_${workInstruction.Id}`,
              UNIQUEKEY: 'STEP0',
              STEPS: '0',
              WINSTRIND: 'X',
              VERSION: '001'
            };

            const updateSteps = this.getStepsByWID(
              workInstruction.Id,
              info
            ).pipe(
              mergeMap((steps) =>
                from(steps).pipe(
                  map((step: any, index: number) => [step, index]),
                  mergeMap(([step, index]) => {
                    if (step.Published) {
                      const updateInstructionPayload = {
                        ...payload,
                        UNIQUEKEY: step.StepId.toString(),
                        STEPS: `${index + 1}`,
                        CATEGORY
                      };
                      const updatedGatewayInstruction =
                        this.updateGatewayWorkInstruction(
                          updateInstructionPayload,
                          undefined,
                          info
                        );
                      const updateStep = this.updateStep(
                        { ...step, Published: false },
                        info
                      );
                      if (categories.length) {
                        return updatedGatewayInstruction;
                      } else {
                        return updateStep;
                      }
                    } else {
                      return of({ ...step });
                    }
                  })
                )
              ),
              toArray()
            );

            const updateInstruction = this.updateWorkInstruction(
              {
                ...workInstruction,
                Categories: categories.length
                  ? JSON.stringify(categories)
                  : JSON.stringify([...categories, defaultCategoryId]),
                IsFavorite: categories.length
                  ? workInstruction.IsFavorite
                  : false,
                Published: categories.length ? workInstruction.Published : false
              },
              info
            );

            if (workInstruction.Published) {
              if (categories.length) {
                const updateInstructionPayload = {
                  ...payload,
                  CATEGORY
                };
                const updatedGatewayInstruction =
                  this.updateGatewayWorkInstruction(
                    updateInstructionPayload,
                    undefined,
                    info
                  );
                return forkJoin({
                  updatedGatewayInstruction,
                  updateInstruction,
                  updateSteps
                });
              } else {
                const deleteInstructionPayload = {
                  ...payload,
                  DELIND: 'X'
                };
                const deleteInstructionFromGateway =
                  this.removeWorkInstructionFromGateway(
                    deleteInstructionPayload,
                    info
                  );
                return forkJoin({
                  deleteInstructionFromGateway,
                  updateInstruction,
                  updateSteps
                });
              }
            } else {
              return updateInstruction;
            }
          }),
          toArray()
        )
      ),
      mergeMap(() => this.removeCategory(category, info)),
      mergeMap((category) => {
        if (
          Object.keys(category).length &&
          category.Cover_Image.indexOf('assets/') === -1
        ) {
          return this.deleteFile(
            `${category.Category_Id}/${category.Cover_Image}`,
            info
          ).pipe(map(() => category));
        } else {
          return of(category);
        }
      })
    );
  };

  updateCategory$ = (
    category: Category,
    categories: Category[],
    info: ErrorInfo
  ): Observable<Category> => {
    const categoriesUpdated = categories.map((catgry) => {
      if (catgry.Category_Id === category.Category_Id) {
        return category;
      } else {
        return catgry;
      }
    });
    const categoriesObject = this.getCategoriesObject(categoriesUpdated);
    return this.updateCategory(category, info).pipe(
      mergeMap(() =>
        this.getInstructionsByCategoryId(category.Category_Id, info)
      ),
      mergeMap((workInstructions) =>
        from(workInstructions).pipe(
          mergeMap((workInstruction: any) => {
            const categories = JSON.parse(workInstruction.Categories).map(
              (catgryId: string) => categoriesObject[catgryId]
            );
            const payload = {
              APPNAME: 'MWORKORDER',
              FORMNAME: `WI_${workInstruction.Id}`,
              UNIQUEKEY: 'STEP0',
              STEPS: '0',
              WINSTRIND: 'X',
              VERSION: '001'
            };

            const updateSteps = this.getStepsByWID(
              workInstruction.Id,
              info
            ).pipe(
              mergeMap((steps) =>
                from(steps).pipe(
                  map((step: any, index: number) => [step, index]),
                  mergeMap(([step, index]) => {
                    if (step.Published) {
                      const updateInstructionPayload = {
                        ...payload,
                        UNIQUEKEY: step.StepId.toString(),
                        STEPS: `${index + 1}`,
                        CATEGORY: JSON.stringify(categories)
                      };
                      return this.updateGatewayWorkInstruction(
                        updateInstructionPayload,
                        undefined,
                        info
                      );
                    } else {
                      return of({ ...step });
                    }
                  })
                )
              ),
              toArray()
            );

            if (workInstruction.Published) {
              const updateInstructionPayload = {
                ...payload,
                CATEGORY: JSON.stringify(categories)
              };
              const updatedGatewayInstruction =
                this.updateGatewayWorkInstruction(
                  updateInstructionPayload,
                  undefined,
                  info
                );
              return forkJoin({ updatedGatewayInstruction, updateSteps });
            } else {
              return of({ ...workInstruction });
            }
          }),
          toArray()
        )
      ),
      mergeMap(() => of(category))
    );
  };

  downloadSampleInstructionTemplate(
    data: any,
    info: ErrorInfo = {} as ErrorInfo
  ): Observable<any> {
    return this._appService.downloadFile(
      environment.wiApiUrl,
      'instructions/download/sample-template',
      info,
      false,
      data
    );
  }

  generateTags$(image): Observable<any> {
    return this._appService._postData(
      environment.wiApiUrl,
      'generateTags',
      image
    );
  }
  generateHeaders$(data): Observable<any> {
    return this._appService._postData(
      environment.wiApiUrl,
      'generateHeader',
      data
    );
  }
  generateSteps$(data): Observable<any> {
    return this._appService._postData(
      environment.wiApiUrl,
      'generateSteps',
      data
    );
  }
  generateDetails$(data, info: ErrorInfo = {} as ErrorInfo): Observable<any> {
    return this._appService._postData(
      environment.wiApiUrl,
      'generateDetails',
      data,
      info
    );
  }

}
