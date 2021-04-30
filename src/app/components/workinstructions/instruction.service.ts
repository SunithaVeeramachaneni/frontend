import { concatMap, map, mergeMap, switchMap, toArray } from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { AppService } from '../../services/app.services';
import { combineLatest, forkJoin, from, Observable, of, throwError } from "rxjs";
import { Category, CategoryOptional } from '../../interfaces/category';
import { ErrorInfo } from '../../interfaces/error-info';
import { Instruction, InstructionOptional, PublishInstruction } from '../../interfaces/instruction';
import { User, UserOptional } from '../../interfaces/user';
import { Step, StepOptional } from '../../interfaces/step';
import { Mail } from '../../interfaces/mail';
import { DeleteFile, DeleteFileResponse } from '../../interfaces/delete-file';
import { GetFile, UploadS3FileResponse } from '../../interfaces/upload-file';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../../shared/toast';
import { Store } from '@ngrx/store';
import { State } from '../../state/app.state';
import * as InstructionActions from './state/intruction.actions';

export interface InstructionQuery {
  search: string;
}

@Injectable({providedIn: "root"})
export class InstructionService {

  constructor(private _appService: AppService,
              private toastService: ToastService,
              private store: Store<State>) {}

  getUsers(info: ErrorInfo = {} as ErrorInfo): Observable<User[]> {
    return this._appService._getResp('wiusers', info);
  }

  getUsersByEmail(email: string, info: ErrorInfo = {} as ErrorInfo): Observable<User[]> {
    return this._appService._getRespByName('wiuser/', email, info);
  }

  addUser(user: User | UserOptional, info: ErrorInfo = {} as ErrorInfo): Observable<User> {
    return this._appService._postData('addwiUser', user, info);
  }

  sendApprovalEmail(mail: Mail, info: ErrorInfo = {} as ErrorInfo): Observable<{data: string}> {
    return this._appService._postData('approvalmail', mail, info);
  }

  getAllCategories(info: ErrorInfo = {} as ErrorInfo): Observable<Category[]> {
    return this._appService._getResp('categories', info);
  }

  getSelectedCategory(categoryId: string, info: ErrorInfo = {} as ErrorInfo): Observable<Category> {
    return this._appService._getRespById('categories/', categoryId, info);
  }

  getCategoriesByName(catName: string, info: ErrorInfo = {} as ErrorInfo): Observable<Category[]> {
    return this._appService._getRespByName('getCategoriesByName/', catName, info);
  }

  addCategory(category: Category | CategoryOptional, info: ErrorInfo = {} as ErrorInfo): Observable<Category> {
    return this._appService._postData('addCategory', category, info);
  }

  updateCategory(category: Category, info: ErrorInfo = {} as ErrorInfo): Observable<Category> {
    return this._appService._updateData(`updateCategory/${category.Category_Id}`, category, info)
      .pipe(
        map(resp => resp === null ? category : resp)
      );
  }

  removeCategory(category: Category, info: ErrorInfo = {} as ErrorInfo): Observable<Category> {
    return this._appService._removeData(`deleteCategory/${category.Category_Id}`, info)
      .pipe(
        map(resp => resp === null ? category : resp)
      );
  }

  getAllBusinessObjects(info: ErrorInfo = {} as ErrorInfo): Observable<any[]> {
    return this._appService._getRespFromGateway('businessObjects', info);
  }

  getFavInstructions(info: ErrorInfo = {} as ErrorInfo): Observable<Instruction[]> {
    return this.workInstructionsWithCategories$('favInstructions', info);
  }

  getDraftedInstructions(info: ErrorInfo = {} as ErrorInfo): Observable<Instruction[]> {
    return this.workInstructionsWithCategories$('draftedInstructions', info);
  }

  getPublishedInstructions(info: ErrorInfo = {} as ErrorInfo): Observable<Instruction[]> {
    return this.workInstructionsWithCategories$('publishedInstructions', info);
  }

  getRecentInstructions(info: ErrorInfo = {} as ErrorInfo): Observable<Instruction[]> {
    return this.workInstructionsWithCategories$('allRecentInstructions', info);
  }

  getAllInstructions(info: ErrorInfo = {} as ErrorInfo): Observable<Instruction[]> {
    return this._appService._getResp('allInstructions', info);
  }

  editWorkInstructionTitle(wid: string, user: User, ins: Instruction, info: ErrorInfo): Observable<Instruction> {
    return this.editInstructionTitle$(wid, user, ins, info);
  }

  getDraftedAndPublished(wid: string, info: ErrorInfo): Observable<any[]> {
    return this.getInstructionsById(wid, info)
      .pipe(
        mergeMap((instruction: Instruction) => {
          const instructionToRetrieve = {
            "APPNAME": 'MWORKORDER',
            "FORMNAME": 'WI_' + instruction.Id.toString(),
            "WINSTRIND": 'X'
          };
          const publishedIns = this.getInstructionsFromGateway(instructionToRetrieve, info);
          return publishedIns;
        })
      );
  }

  addWorkInstructionTitle(user: User, ins: Instruction | InstructionOptional, info: ErrorInfo): Observable<Instruction> {
    return this.addInstructionTitle$(user, ins, info);
  }

  setFavoriteInstructions(id: string, info: ErrorInfo): Observable<Instruction> {
    return this.setFavoriteInstruction$(id, info);
  }

  getInstructionsByName(wiName: string, info: ErrorInfo = {} as ErrorInfo): Observable<Instruction[]> {
    return this._appService._getRespByName('getInstructionsByName/', wiName, info);
  }

  getCopyInstructionsByName(wiName: string, info: ErrorInfo = {} as ErrorInfo): Observable<Instruction[]> {
    return this._appService._getRespByName('getCopyInstructionsByName/', wiName, info);
  }

  getInstructionsById(id: string, info: ErrorInfo = {} as ErrorInfo): Observable<Instruction> {
    return this._appService._getRespById('allInstructions/', id, info);
  }

  getInstructionsByCategoryId(categoryId: string, info: ErrorInfo = {} as ErrorInfo): Observable<Instruction[]> {
    const { displayToast, failureResponse = [] } = info;
    return this._appService._getRespById('allInstructionsByCategory/', categoryId, { displayToast, failureResponse });
  }

  getInstructionsFromGateway(params: any, info: ErrorInfo = {} as ErrorInfo): Observable<any[]> {
    return this._appService._getDataFromGatewayById('publishedInstructionsByName', params, info);
  }

  addWorkInstruction(instruction: Instruction | InstructionOptional, info: ErrorInfo = {} as ErrorInfo): Observable<Instruction> {
    return this._appService._postData('addWorkInstruction', instruction, info);
  }

  addWorkInstructionToGateway(payload: any, params = {}, info: ErrorInfo = {} as ErrorInfo): Observable<{ status: number }> {
    return this._appService._postDataToGateway('publishInstruction', payload, info)
      .pipe(
        map(resp => resp === null ? payload : resp)
      );
  }

  updateWorkInstruction(instruction: Instruction, info: ErrorInfo = {} as ErrorInfo): Observable<Instruction> {
    return this._appService._updateData('updateInstruction/' + instruction.Id, instruction, info)
      .pipe(
        map(resp => resp === null ? instruction : resp)
      );
  }

  updateGatewayWorkInstruction(payload: any, params = {}, info: ErrorInfo = {} as ErrorInfo): Observable<any> {
    return this._appService._putDataToGateway('updateInstruction', payload, info)
      .pipe(
        map(resp => resp === null ? payload : resp)
      );
  }

  updateGatewayFavWorkInstruction(payload: any, params = {}, info: ErrorInfo = {} as ErrorInfo): Observable<any> {
    return this._appService._putDataToGateway('favouriteInstruction', payload, info)
      .pipe(
        map(resp => resp === null ? payload : resp)
      );
  }

  removeWorkInstruction(instruction: Instruction, info: ErrorInfo = {} as ErrorInfo): Observable<Instruction> {
    return this._appService._removeData('deleteInstruction/' + instruction.Id, info)
      .pipe(
        map(resp => resp === null ? instruction : resp)
      );
  }

  removeWorkInstructionFromGateway(payload: any, info: ErrorInfo = {} as ErrorInfo): Observable<any> {
    return this._appService._removeDataFromGateway('removeInstruction', payload, info)
      .pipe(
        map(resp => resp === null ? payload : resp)
      );
  }

  publishInstruction({wiToBePublsihed, steps, wid, editedBy}: PublishInstruction, info: ErrorInfo): Observable<(Instruction | Step)[]> {
    return this.publishInstruction$({wiToBePublsihed, steps, wid, editedBy}, info);
  }

  getSteps(info: ErrorInfo = {} as ErrorInfo): Observable<Step[]> {
    return this._appService._getResp('steps', info);
  }

  getStepById(id: string, info: ErrorInfo = {} as ErrorInfo): Observable<Step> {
    return this._appService._getRespById('steps/', id, info);
  }

  getStepsByWID(WID: string, info: ErrorInfo = {} as ErrorInfo): Observable<Step[]> {
    const { displayToast, failureResponse = [] } = info;
    return this._appService._getRespById('stepsByInstructionId/', WID, { displayToast, failureResponse });
  }

  getStepsByName(title: string, info: ErrorInfo = {} as ErrorInfo): Observable<Step[]> {
    return this._appService._getRespByName('stepByName/', title, info);
  }

  getStepFromGateway(params: any, info: ErrorInfo = {} as ErrorInfo): Observable<any> {
    return this._appService._getDataFromGatewayByStep('getSteps', params, info);
  }

  addStep(step: Step | StepOptional, info: ErrorInfo = {} as ErrorInfo): Observable<Step> {
    return this._appService._postData('addStep', step, info);
  }

  updateStep(step: Step, info: ErrorInfo = {} as ErrorInfo): Observable<Step> {
    return this._appService._updateData('updateStep/' + step.StepId, step, info)
      .pipe(
        map(resp => resp === null ? step : resp)
      );
  }

  removeStep(step: Step, info: ErrorInfo = {} as ErrorInfo): Observable<Step> {
    return this._appService._removeData('deleteStep/' + step.StepId, info)
      .pipe(
        map(resp => resp === null ? step : resp)
      );
  }

  removeStepFromGateway(payload: any, info: ErrorInfo = {} as ErrorInfo): Observable<any> {
    return this._appService._removeDataFromGateway('removeStep', payload, info)
      .pipe(
        map(resp => resp === null ? payload : resp)
      );
  }

  uploadAttachments(form: FormData, info: ErrorInfo = {} as ErrorInfo): Observable<UploadS3FileResponse> {
    return this._appService._postData('api/v1/upload/', form, info);
  }

  getImage(file: GetFile, info: ErrorInfo = {} as ErrorInfo): Observable<{ base64Response: string }> {
    return this._appService._postData('api/v1/getImage/', file, info);
  }

  uploadWIExcel(form: FormData, info: ErrorInfo = {} as ErrorInfo): Observable<any> {
    return this._appService._postData('excel/upload-parser', form, info);
  }

  uploadWIAudioOrVideo(form: FormData, info: ErrorInfo = {} as ErrorInfo): Observable<any> {
    return this._appService._postData('speech-to-text/converter', form, info);
  }

  deleteAttachments(files: DeleteFile, info: ErrorInfo = {} as ErrorInfo): Observable<DeleteFileResponse> {
    return this._appService._postData('api/v1/delete/', files, info);
  }

  newInstructionPromise(insPayload: Instruction, info: ErrorInfo): Observable<Instruction> {
    return this.getAllInstructions(info).pipe(mergeMap((instructions) => {
      if (instructions && instructions.length > 0) {
        insPayload.WI_Id = instructions.length > 0 ? instructions.length + 1 : 1;
      }
      return this.addWorkInstruction(insPayload, info);
    }));
  }

  addInstructionFromImportedData(instructionHeaderPayload: Instruction, info: ErrorInfo): Observable<Instruction> {
    const insName = instructionHeaderPayload.WI_Name;
    return this.getInstructionsByName(insName, info).pipe(mergeMap((existingInsResp) => {
      const copyString = insName + 'Copy';
      if (existingInsResp && existingInsResp.length > 0) {
        instructionHeaderPayload.WI_Name = copyString + '(' + (existingInsResp.length) + ')';
        return this.getCopyInstructionsByName(copyString, info).pipe(mergeMap((copiedInsResp) => {
          if (copiedInsResp && copiedInsResp.length > 0) {
            const copiedInsCount = copiedInsResp.length + 1;
            instructionHeaderPayload.WI_Name = insName + 'Copy(' + copiedInsCount + ')';
            return this.newInstructionPromise(instructionHeaderPayload, info);
          } else {
            return this.newInstructionPromise(instructionHeaderPayload, info);
          }
        }));
      } else {
        return this.newInstructionPromise(instructionHeaderPayload, info);
      }
    }));
 }

  addStepFromImportedData(stepPayload: Step, info: ErrorInfo = {} as ErrorInfo): Observable<Step> {
    return this.addStep(stepPayload, info);
  }

  copyWorkInstruction(title: string, userName: User, info: ErrorInfo): Observable<{ instruction: Instruction, steps: Step[] }> {
    const getInsPromise = this.getInstructionsByName(title, info);
    return getInsPromise.pipe(concatMap((existingInsResp) => {
      const existingIns = existingInsResp[0];
      const copyString = (title + 'Copy');
      return this.getCopyInstructionsByName(copyString, info).pipe(mergeMap((copiedInsResp) => {
        const cnt = copiedInsResp.length + 1;
        const instructionPayload = {
          WI_Id: existingIns.WI_Id,
          Categories: existingIns.Categories,
          WI_Name: existingIns.WI_Name + 'Copy(' + cnt + ')',
          Tools: existingIns.Tools,
          Equipements: existingIns.Equipements,
          Locations: existingIns.Locations,
          IsFavorite: existingIns.IsFavorite,
          CreatedBy: userName.first_name + " " + userName.last_name,
          EditedBy: userName.first_name + " " + userName.last_name,
          AssignedObjects: existingIns.AssignedObjects,
          SpareParts: existingIns.SpareParts,
          SafetyKit: existingIns.SafetyKit,
          Published: false,
          IsPublishedTillSave: false,
          Cover_Image: existingIns.Cover_Image
        };

        return this.addWorkInstruction(instructionPayload, info)
          .pipe(
            mergeMap(instruction => {
              return this.getStepsByWID(existingIns.Id, info)
                .pipe(
                  mergeMap(steps => {
                    if (steps && steps.length) {
                      return from(steps)
                        .pipe(
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
                              Warnings: step.Warnings,
                            };
                            return this.addStep(stepPayload, info);
                          }),
                          toArray(),
                          mergeMap(response => of({instruction, steps: response}))
                        );
                    } else {
                      return of({ instruction, steps: [] as Step[] });
                    }
                  })
                );
            })
          );
      }));
    }));
  }

  setFavoriteInstruction$ = (workInstructionId: string, info: ErrorInfo): Observable<Instruction> => {
    const userName = JSON.parse(localStorage.getItem("loggedInUser"));
    let getInstructionPayload = {};
    let updateInstructionPayload = {};
    return this.getInstructionsById(workInstructionId, info)
      .pipe(
        switchMap(workInstruction => {
          workInstruction.IsFavorite = workInstruction.IsFavorite ? false : true;
          workInstruction.EditedBy = userName.first_name + " " + userName.last_name;
          const { Id } = workInstruction;
          const FORMNAME = `WI_${Id}`;
          const APPNAME = "MWORKORDER";
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
          const updateInsInABAP =
            this.getInstructionsFromGateway(getInstructionPayload, info).pipe(mergeMap(res => {
              updateInstructionPayload = {
                ...updateInstructionPayload,
                APPNAME,
                FORMNAME,
                FORMTITLE: res[0]?.FORMTITLE,
                FAVOURITE,
                VERSION,
                WINSTRIND
              };
              return this.updateGatewayFavWorkInstruction(updateInstructionPayload, undefined, info);
            }));
          if (workInstruction.Published || workInstruction.Published === true) {
            return forkJoin({updateIns, updateInsInABAP}).pipe(
              map((res: {updateIns: Instruction, updateInsInABAP: any}) => {
                return res.updateIns;
              })
            );
          } else {
            return updateIns;
          }
        })
      );
  }

  deleteWorkInstruction$ = (workInstructionId: string, info: ErrorInfo): Observable<Instruction> => {
    let deleteStepsPayload = {};
    let deleteInstructionPayload = {};
    return combineLatest([
      this.getInstructionsById(workInstructionId, info),
      this.getStepsByWID(workInstructionId, info)
    ])
    .pipe(
      switchMap(([workInstruction, steps]) => {
        const { Id } = workInstruction;
        const FORMNAME = 'WI_' + `${Id}`;
        const APPNAME = "MWORKORDER";
        const VERSION = '001';
        const WINSTRIND = 'X';
        const DELIND = 'X';
        deleteStepsPayload = {
          ...deleteStepsPayload,
          APPNAME,
          FORMNAME,
          WINSTRIND,
          DELIND
        };
        deleteInstructionPayload = {
          ...deleteInstructionPayload,
          APPNAME,
          FORMNAME,
          WINSTRIND,
          DELIND,
          VERSION
        };

        if (steps.length) {
          return from(steps)
            .pipe(
              mergeMap((step: Step) => {
                deleteStepsPayload = {
                  ...deleteStepsPayload,
                  UNIQUEKEY: step.StepId.toString()
                };
                const deleteStep = this.removeStep(step, info);
                const deleteStepFromGateway = this.removeStepFromGateway(deleteStepsPayload, info);
                if (step.Published) {
                  return forkJoin({deleteStep, deleteStepFromGateway});
                } else {
                  return deleteStep;
                }
              }),
              toArray(),
              switchMap(() => {
                const deleteInstruction = this.removeWorkInstruction(workInstruction, info);
                const deleteInstructionFromGateway = this.removeWorkInstructionFromGateway(deleteInstructionPayload, info);
                if (workInstruction.Published) {
                  return forkJoin({ deleteInstruction, deleteInstructionFromGateway })
                    .pipe(
                      map((res: { deleteInstruction: Instruction, deleteInstructionFromGateway: any }) => {
                        return res.deleteInstruction;
                      })
                    );
                } else {
                  return deleteInstruction;
                }
              })
            );
        } else {
          return of(workInstruction)
            .pipe(
              mergeMap((workInstructionDetails: Instruction) => {
                const deleteInstruction =
                  this.removeWorkInstruction(workInstructionDetails, info);
                const deleteInstructionFromGateway = this.removeWorkInstructionFromGateway(deleteInstructionPayload, info);
                if (workInstructionDetails.Published) {
                  return forkJoin({ deleteInstruction, deleteInstructionFromGateway })
                    .pipe(
                      map((res: { deleteInstruction: Instruction, deleteInstructionFromGateway: any }) => {
                        return res.deleteInstruction;
                      })
                    );
                } else {
                  return deleteInstruction;
                }
              })
            );
        }
      })
    );
  }

  addInstructionTitle$ = (user: User, ins: Instruction | InstructionOptional, info: ErrorInfo): Observable<Instruction> => {
    const wiDetail = {
      WI_Id: null,
      Categories: JSON.stringify([
        {Category_Id: '4d08pHYBr', Category_Name: 'Unassigned', Cover_Image: "assets/img/brand/category-placeholder.png"}
      ]),
      WI_Name: ins.WI_Name,
      IsFavorite: false,
      CreatedBy: user.first_name + " " + user.last_name,
      EditedBy: user.first_name + " " + user.last_name,
      Published: false,
      Cover_Image: '../../assets/img/brand/doc-placeholder.png'
    };
    return this.getAllInstructions(info).pipe(mergeMap((instructions) => {
      wiDetail.WI_Id = instructions.length > 0 ? instructions.length + 1 : 1;
      if (wiDetail.WI_Name.length > 0) {
        return this.addWorkInstruction(wiDetail, info);
      } else {
        return of({} as Instruction);
      }
    }));
  }

  editInstructionTitle$ = (insId: string, user: User, ins: Instruction, info: ErrorInfo): Observable<Instruction> => {
    return this.getInstructionsById(insId, info).pipe(mergeMap(instruction => {
      instruction.WI_Name = ins.WI_Name;
      if (instruction.WI_Name.length > 0) {
        instruction.EditedBy = user.first_name + " " + user.last_name;
        return this.updateWorkInstruction(instruction, info);
      } else {
        return of({} as Instruction);
      }
    }));
  }

  workInstructionsWithCategories$ = (requestType: string, info: ErrorInfo = {} as ErrorInfo): Observable<Instruction[]> =>
    this._appService._getResp(requestType, info)
      .pipe(
        map((workInstructions: Instruction[]) => {
          return workInstructions.map((workInstruction: Instruction) => {
            const categories = workInstruction.Categories ?
              JSON.parse(workInstruction.Categories).map((category: Category) => ` ${category.Category_Name}`)
              : null;
            return {
              ...workInstruction,
              categories,
            } as Instruction;
          });
        })
      )

  publishInstruction$ = ({ wiToBePublsihed, steps, wid, editedBy }: PublishInstruction, info: ErrorInfo):
  Observable<(Instruction| Step)[]> => {
    return this.getInstructionsById(wid, info)
      .pipe(
        switchMap(workInstruction => {
          if (Object.keys(workInstruction).length) {
            return from(wiToBePublsihed)
              .pipe(
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
                    return this.updateGatewayWorkInstruction({...instructionData, PUBLISHED}, params, info)
                      .pipe(
                        mergeMap(() => {
                          if (params.index) {
                            const step = { ...params.step, Published: true };
                            return this.updateStep(step, info)
                              .pipe(
                                map(stepData => {
                                  this.store.dispatch(InstructionActions.updateStep({ step: stepData }));
                                  return stepData;
                                })
                              );
                          } else {
                            const instruction = { ...params.workInstruction, Published: true, EditedBy: editedBy };
                            return this.updateWorkInstruction(instruction, info)
                              .pipe(
                                map(inst => {
                                  this.store.dispatch(InstructionActions.updateInstruction({ instruction: inst }));
                                  return inst;
                                })
                              );
                          }
                        })
                      );
                  } else {
                    return this.addWorkInstructionToGateway(instructionData, params, info)
                      .pipe(
                        mergeMap(() => {
                          if (params.index) {
                            const step = { ...params.step, Published: true };
                            return this.updateStep(step, info)
                              .pipe(
                                map(stepData => {
                                  this.store.dispatch(InstructionActions.updateStep({ step: stepData }));
                                  return stepData;
                                })
                              );
                          } else {
                            const instruction = { ...params.workInstruction, Published: true, EditedBy: editedBy };
                            return this.updateWorkInstruction(instruction, info)
                              .pipe(
                                map(inst => {
                                  this.store.dispatch(InstructionActions.updateInstruction({ instruction: inst }));
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
              message: 'Unable to publish work instructon. Your publishing work instruction might be deleted!'
            } as HttpErrorResponse);
          }
        })
      );
  }

  deleteCategory$ = (category: Category, info: ErrorInfo): Observable<Category> => {
    return this.getSelectedCategory(category.Category_Id, info)
      .pipe(
        mergeMap(() => this.getInstructionsByCategoryId(category.Category_Id, info)),
        mergeMap(workInstructions =>
          from(workInstructions)
            .pipe(
              mergeMap((workInstruction: any) => {
                const categories = JSON.parse(workInstruction.Categories)
                  .filter((catgry: Category) => catgry.Category_Id !== category.Category_Id);

                const payload = {
                  APPNAME: 'MWORKORDER',
                  FORMNAME: `WI_${workInstruction.Id}`,
                  UNIQUEKEY: 'STEP0',
                  STEPS: '0',
                  WINSTRIND: "X",
                  VERSION: '001'
                };

                const updateSteps = this.getStepsByWID(workInstruction.Id, info)
                  .pipe(
                    mergeMap(steps =>
                      from(steps)
                        .pipe(
                          map((step: any, index: number) => [step, index]),
                          mergeMap(([step, index]) => {
                            if (step.Published) {
                              const updateInstructionPayload = {
                                ...payload,
                                UNIQUEKEY: step.StepId.toString(),
                                STEPS: `${index + 1}`,
                                CATEGORY: JSON.stringify(categories)
                              };
                              const updatedGatewayInstruction =
                                this.updateGatewayWorkInstruction(updateInstructionPayload, undefined, info);
                              const updateStep = this.updateStep({ ...step, Published: false }, info);
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

                const updateInstruction = this.updateWorkInstruction({
                  ...workInstruction,
                  Categories: categories.length ? JSON.stringify(categories) : JSON.stringify([...categories,
                    { Category_Id: '4d08pHYBr', Category_Name: 'Unassigned', Cover_Image: "assets/img/brand/category-placeholder.png" }
                  ]),
                  categories: categories.length ? categories : [' Unassigned'],
                  IsFavorite: categories.length ? workInstruction.IsFavorite : false,
                  Published: categories.length ? workInstruction.Published : false,
                }, info);

                if (workInstruction.Published) {
                  if (categories.length) {
                    const updateInstructionPayload = {
                      ...payload,
                      CATEGORY: JSON.stringify(categories)
                    };
                    const updatedGatewayInstruction = this.updateGatewayWorkInstruction(updateInstructionPayload, undefined, info);
                    return forkJoin({ updatedGatewayInstruction, updateInstruction, updateSteps });
                  } else {
                    const deleteInstructionPayload = {
                      ...payload,
                      DELIND: 'X'
                    };
                    const deleteInstructionFromGateway =
                    this.removeWorkInstructionFromGateway(deleteInstructionPayload, info);
                    return forkJoin({ deleteInstructionFromGateway, updateInstruction, updateSteps });
                  }
                } else {
                  return updateInstruction;
                }
              }),
              toArray()
            )
        ),
        switchMap(() => this.removeCategory(category, info))
      );
  }

  /**
   * Will handle error by displaying toast message and returns specified response
   *
   * @param  {HttpErrorResponse} error
   * @param  {{}|[]|null=null} response
   *
   * @returns null | Observable<{} | []>
   */
  handleError = (error: HttpErrorResponse, response: {} | [] | null = null): Observable<{} | []> | null => {
    this.toastService.show({
      text: this.getErrorMessage(error),
      type: 'warning',
    });
    if (response !== null) {
      return of(response);
    }
    return null;
  }

  /**
   * returns error message from HttpErrorResponse
   *
   * @param  {HttpErrorResponse} error
   *
   * @returns {string} error message
   */
  getErrorMessage = (error: HttpErrorResponse): string => {
    if (error.status === 0 && error.statusText === 'Unknown Error') {
      return 'Unable to connect to server!';
    } else {
      return error.error?.message ? error.error.message : error.message ? error.message : error.statusText;
    }
  }

}
