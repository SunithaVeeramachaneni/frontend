import {Component, OnInit, Input, OnDestroy, Output, EventEmitter} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {InstructionService} from '../../services/instruction.service';
import Swal from "sweetalert2";
import { WiCommonService } from '../../services/wi-common.services';
import { NgxSpinnerService } from 'ngx-spinner';
import { debounceTime, distinctUntilChanged, map, mergeMap, skip, startWith } from 'rxjs/operators';
import { combineLatest, of, Subscription } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import {ToastService} from '../../../../shared/toast';
import { Base64HelperService } from '../../services/base64-helper.service';
import {Subject} from 'rxjs';
import { Step, ErrorInfo } from '../../../../interfaces';
import { Store } from '@ngrx/store';
import { State } from '../../../../state/app.state';
import * as InstructionActions from '../../state/intruction.actions';
import { getCurrentStep, getCurrentStepImages, getInstructionId, getSteps, getUploadedFile } from '../../state/instruction.selectors';
import { ErrorHandlerService } from '../../../../shared/error-handler/error-handler.service';

@Component({
  selector: 'app-step-content',
  templateUrl: 'step-content.component.html',
  styleUrls: ['step-content.component.css']
})

export class StepContentComponent implements OnInit, OnDestroy {
  @Input() selectedTabIndex;
  @Input() previewDisplay;
  @Input() twelveColumned;
  @Output() sendDisplayStatus: EventEmitter<any> = new EventEmitter<any>();
  @Output() onStepDataEntry: EventEmitter<any> = new EventEmitter<any>();
  @Output() cloneStep = new EventEmitter<any>();
  public stepContentForm: FormGroup;
  public titleProvided = false;
  public uploadedBase64Images = [];
  steptitle = new Subject<string>();
  public files = [];
  uploadedFile: string;
  public quillToolbarClass = '';
  public imageSrc;
  public Base64Files = [];
  public steps: Step[] = [];
  public step: Step = {
    Attachment: '',
    Description: '',
    Fields: '',
    Hints: '',
    Instructions: '',
    Status: '',
    StepId: '',
    Title: '',
    WI_Id: '',
    Warnings: '',
    Reaction_Plan: '',
    isCloned: false,
    Published: false
  };
  stepImages = {};
  instructionId: string;
  public showMsg = false;
  public selectedStep = {
    Id: '',
    Title: <any>'',
    Fields: <any>[
      {
        Title: "Attachment",
        Position: 0,
        Active: "true",
        FieldCategory: "ATT",
        FieldType: "ATT",
        FieldValue: ''
      },
      {
        Title: "Instruction",
        Position: 1,
        Active: "true",
        FieldCategory: "INS",
        FieldType: "RTF",
        FieldValue: ''
      },
      {
        Title: "Warning",
        Position: 2,
        Active: "true",
        FieldCategory: "WARN",
        FieldType: "RTF",
        FieldValue: ''
      },
      {
        Title: "Hint",
        Position: 3,
        Active: "true",
        FieldCategory: "HINT",
        FieldType: "RTF",
        FieldValue: ''
      },
      {
        Title: "Reaction Plan",
        Position: 4,
        Active: "true",
        FieldCategory: "REACTION PLAN",
        FieldType: "RTF",
        FieldValue: ''
      }
    ]
  };
  private subscription: Subscription;
  private instSrvSubscription: Subscription;
  private instructionsSubscription: Subscription;
  private imageContentsSubscription: Subscription;
  private uploadedFileSubscription: Subscription;
  private stepsSubscription: Subscription;
  private currentStepSubscription: Subscription;
  private instructionIdSubscription: Subscription;
  private currentStepImagesSubscription: Subscription;

  constructor(private spinner: NgxSpinnerService,
              private route: ActivatedRoute,
              private _commonSvc: WiCommonService,
              private _toastService: ToastService,
              private _instructionSvc: InstructionService,
              private fb: FormBuilder,
              private base64HelperService: Base64HelperService,
              private store: Store<State>,
              private errorHandlerService: ErrorHandlerService) { }

  handleInputChange(uploadedFile, uploadedImg) {
    const file = uploadedFile;
    const pattern = /image-*/;
    const reader = new FileReader();
    if (!file.type.match(pattern)) {
      alert('invalid format');
      return;
    }
    this.store.dispatch(InstructionActions.setUploadedFile({ uploadedFile: uploadedImg.image}));
    reader.onloadend = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }

  displayStatus(status) {
    this.sendDisplayStatus.emit(status);
  }

  _handleReaderLoaded(e) {
    const reader = e.target;
    const base64result = reader.result.substr(reader.result.indexOf(',') + 1);
    const imageContent = {
      "fileContent": base64result,
      "fileName": this.uploadedFile,
      "fileType": ""
    };
    this.base64HelperService.setBase64ImageDetails(this.uploadedFile, reader.result, `${this.step.WI_Id}/${this.step.StepId}`);
    imageContent.fileType = this.base64HelperService.getExtention(this.uploadedFile);
    this.store.dispatch(InstructionActions.updateStepImagesContent({ attachment: this.uploadedFile, imageContent }));
    this.uploadedBase64Images = [...this.uploadedBase64Images, imageContent];
    this.onStepDataEntry.emit({});
  }

  editByUser() {
    const userName = JSON.parse(localStorage.getItem("loggedInUser"));
    const sid = this.instructionId;
    this._instructionSvc.getInstructionsById(sid).subscribe((instruction) => {
      if (Object.keys(instruction).length) {
        instruction.EditedBy =  userName.first_name + " " + userName.last_name;
        instruction.IsPublishedTillSave =  false;
        this._instructionSvc.updateWorkInstruction(instruction).subscribe(
          () => {
            this.store.dispatch(InstructionActions.updateInstruction({ instruction }));
          });
      }
    });
  }

  uploadFile(event, index?: number): void {
    const FILE = event.addedFiles[0];
    let uploadToS3 = true;
    const fileExists = this.files.find(file => file === FILE.name);
    if (index !== undefined && fileExists && fileExists !== this.files[index]) {
      uploadToS3 = false;
    }
    
    if (uploadToS3) {
      this.spinner.show();
      this._commonSvc.stepDetailsSave('Saving..');
      const imageForm = new FormData();
      imageForm.append('path', `${this.step.WI_Id}/${this.step.StepId}`);
      imageForm.append('image', FILE);
  
      this._instructionSvc.uploadAttachments(imageForm).subscribe(uploadedImg => {
        if (Object.keys(uploadedImg).length) {
          let removedFile = [];
          if (index !== undefined) {
            removedFile = this.files.splice(index, 1, uploadedImg.image);
          } else {
            if (fileExists === undefined) {
              this.files = [...this.files, uploadedImg.image];
            }
          }
          this.handleInputChange(FILE, uploadedImg);
  
          if (fileExists === undefined) {
            this._instructionSvc.getStepById(this.step.StepId).subscribe((step_resp) => {
              if (Object.keys(step_resp).length) {
                step_resp.Attachment = JSON.stringify(this.files);
                this.selectedStep.Fields[0].FieldValue = this.files;
                this.onStepDataEntry.emit({});
                step_resp.Fields = JSON.stringify(this.selectedStep.Fields);
                this._instructionSvc.updateStep(step_resp).pipe(
                  mergeMap(resp => {
                    if (Object.keys(resp).length && removedFile.length && removedFile[0] !== uploadedImg.image) {
                      return this._instructionSvc.deleteFile(`${resp.WI_Id}/${resp.StepId}/${removedFile[0]}`)
                        .pipe(map(() => resp))
                    } else {
                      return of(resp);
                    }
                  })
                ).subscribe((step) => {
                  if (Object.keys(step).length) {
                    this.store.dispatch(InstructionActions.updateStep({ step: step_resp }));
                    this._commonSvc.setUpdatedSteps(this.steps);
                    if (uploadedImg && uploadedImg.image) {
                      this._commonSvc.uploadImgToPreview({ image: uploadedImg.image, index });
                    }
                    this.editByUser();
                    this._commonSvc.stepDetailsSave('All Changes Saved');
                  }
                });
              }
            });
          } else {
            this.editByUser();
            this._commonSvc.stepDetailsSave('All Changes Saved');
          }
        }
        this.spinner.hide();
      });
    } else {
      this._toastService.show({
        text: "Attachment name " + fileExists +" already exists!",
        type: 'warning',
      });
    }

  }

  deleteStep (el) {
    Swal.fire({
      title: 'Are you sure?',
      html: "Do you want to delete step " + "'" + el.Title + "'" + " ?",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#888888',
      confirmButtonColor: '#d33',
      confirmButtonText: 'Delete',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.removeStep();
        this.editByUser();
      }
    });
  }

  removeStep() {
    const currentStep = this.step;
    if (currentStep.Published === false) {
      this.removeStepAndContent(currentStep);
    } else {
      const stepParam = {
        "APPNAME": "MWORKORDER",
        "FORMNAME": 'WI_' + this.instructionId,
        "UNIQUEKEY": currentStep.StepId.toString()
      };
      this._instructionSvc.getStepFromGateway(stepParam).subscribe((stepRespFromAbap) => {
        if (Object.keys(stepRespFromAbap).length) {
          const delParams = {
            APPNAME: stepRespFromAbap.APPNAME,
            FORMNAME: stepRespFromAbap.FORMNAME,
            UNIQUEKEY: stepRespFromAbap.UNIQUEKEY,
            STEPS: stepRespFromAbap.STEPS,
            WINSTRIND: "X",
            DELIND: "X"
          };
          this._instructionSvc.removeStepFromGateway(delParams).subscribe((res) => {
            if (Object.keys(res).length) {
              this.removeStepAndContent(currentStep);
            }
          });
        }
      });
    }
  }

  removeStepAndContent(step: Step) {
    this._commonSvc.stepDetailsSave('Saving..');
    this._instructionSvc.removeStep(step)
      .pipe(
        mergeMap(resp => {
          if (Object.keys(resp).length && resp.Attachment && JSON.parse(resp.Attachment).length) {
            return this._instructionSvc.deleteFiles(`${resp.WI_Id}/${resp.StepId}`)
              .pipe(map(() => resp))
          } else {
            return of(resp);
          }
        })
      )
      .subscribe((resp) => {
      if (Object.keys(resp).length) {
        this._toastService.show({
          text: "Step " + resp.Title +" is deleted successfully",
          type: 'success',
        });
        this._commonSvc.stepDetailsSave('All Changes Saved');
        this.store.dispatch(InstructionActions.removeStep({ step }));
        this.store.dispatch(InstructionActions.removeStepImages({ stepId: step.StepId }));
        this.onStepDataEntry.emit({});
        this._instructionSvc.getStepsByWID(step.WI_Id).subscribe((steps) => {
          this._commonSvc.setUpdatedSteps(steps);
          this._commonSvc.unloadImages([]);
          if (steps.length) {
            this.files = [];
            const Fields = this.selectedStep.Fields.map(field => ({...field, FieldValue: ''}));
            this.selectedStep = {...this.selectedStep, Fields};
            const selectedStep = steps[this.selectedTabIndex - 1];
            /* While deleting steps from last index will get selectedStep as undefined because of selectedTabIndex change detection.
            If we are deleting steps from start or middle selectedTabIndex change detection won't happen we are setting the data
            manually to update the current step*/
            if (selectedStep) {
              this.selectedStep.Title = selectedStep ? selectedStep.Title : this.selectedStep.Title;
              this.selectedStep.Fields = selectedStep?.Fields ? JSON.parse(selectedStep.Fields) : this.selectedStep.Fields;
              this._commonSvc.updateStepTitle(this.selectedStep.Title);
              this.store.dispatch(InstructionActions.updateStep({ step: selectedStep }));
              this.step = selectedStep;
              const { Attachment, Instructions, Warnings, Hints, Reaction_Plan } = this.step;
              const [, instructions, warnings, hints, reaction_plan] = this.selectedStep.Fields;
              this._commonSvc.updateStepDetails(Instructions ? JSON.parse(Instructions) : instructions);
              this._commonSvc.updateStepDetails(Warnings ? JSON.parse(Warnings) : warnings);
              this._commonSvc.updateStepDetails(Hints ? JSON.parse(Hints) : hints);
              this._commonSvc.updateStepDetails(Reaction_Plan ? JSON.parse(Reaction_Plan) : reaction_plan);

              if (JSON.parse(Attachment) && JSON.parse(Attachment).length) {
                this.files = JSON.parse(Attachment) ;
                for (let imgCnt = 0; imgCnt < this.files.length; imgCnt++) {
                  this._commonSvc.uploadImgToPreview({ image: this.files[imgCnt] });
                }
              }
            }
          }
        });
      }
    },
    error => {
      console.log(error);
    });
  }

  deleteAtt(file, index) {
    Swal.fire({
      title: 'Are you sure?',
      html: "Do you want to delete the attachment?",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#888888',
      confirmButtonColor: '#d33',
      confirmButtonText: 'Delete',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteAttachment(index);
      }
    });
  }

  deleteAttachment(index) {
    this._commonSvc.stepDetailsSave('Saving..');
    const attachment = this.files.splice(index, 1);
    this.uploadedBase64Images.splice(index, 1);
    this._instructionSvc.getStepById(this.step.StepId).subscribe((step_resp) => {
      if (Object.keys(step_resp).length) {
        step_resp.Attachment = JSON.stringify(this.files);
        this.selectedStep.Fields[0].FieldValue = this.files;
        step_resp.Fields = JSON.stringify(this.selectedStep.Fields);
        this._instructionSvc.updateStep(step_resp).pipe(
          mergeMap(resp => {
            if (Object.keys(resp).length) {
              return this._instructionSvc.deleteFile(`${resp.WI_Id}/${resp.StepId}/${attachment}`)
                .pipe(map(() => resp))
            } else {
              return of(resp);
            }
          })
        ).subscribe((step) => {
          if (Object.keys(step).length) {
            this.store.dispatch(InstructionActions.removeStepImagesContent({ attachment: attachment[0] }));
            this.onStepDataEntry.emit({});
            this.store.dispatch(InstructionActions.updateStep({ step: step_resp }));
            this._commonSvc.setUpdatedSteps(this.steps);
            this._commonSvc.unloadImages([]);
            if (this.files) {
              for (let i = 0; i < this.files.length; i++) {
                this._commonSvc.uploadImgToPreview({ image: this.files[i] });
              }
            }
            this._toastService.show({
              text: "Attachment has been deleted successfully",
              type: 'success',
            });
            this.editByUser();
            this._commonSvc.stepDetailsSave('All Changes Saved');
          }
        });
      }
    });
  }

  stepTitle () {
    this._commonSvc.stepDetailsSave('Saving..');
    const sid = this.instructionId || this.route.snapshot.paramMap.get('id');
    const step = {
      WI_Id: sid,
      Title: this.selectedStep.Title,
      Fields: '',
      isCloned: false
    };
    if (sid) {
      const steps = this.steps;
      if (this.selectedTabIndex) {
        const info: ErrorInfo = { displayToast: false, failureResponse: 'throwError' };
        const stepId = steps[this.selectedTabIndex - 1] ? steps[this.selectedTabIndex - 1].StepId : this.selectedStep.Id;
        this._instructionSvc.getStepById(stepId, info).subscribe(
          (stepResp: Step) => {
            if (stepResp &&  Object.keys(stepResp).length > 0) {
              stepResp.Title = this.selectedStep.Title;
              this._instructionSvc.updateStep(stepResp).subscribe((resp) => {
                if (Object.keys(resp).length) {
                  this.store.dispatch(InstructionActions.updateStep({ step: stepResp }));
                  this._commonSvc.setUpdatedSteps(this.steps);
                  this._toastService.show({
                    text: "Step title has been updated",
                    type: 'success',
                  });
                  document.getElementById("step_title").blur();
                  this._commonSvc.updateStepTitle(this.selectedStep.Title);
                  this.onStepDataEntry.emit({});
                  this.editByUser();
                  this._commonSvc.stepDetailsSave('All Changes Saved');
                }
              });
            } else {
              this._instructionSvc.addStep(step).subscribe((resp) => {
                if (Object.keys(step).length) {
                  this.selectedStep.Id = resp.StepId;
                  this.store.dispatch(InstructionActions.addStep({ step: resp }));
                  this._commonSvc.setUpdatedSteps(this.steps);
                  this._toastService.show({
                    text: "Step title has been created",
                    type: 'success',
                  });
                  document.getElementById("step_title").blur();
                  this._commonSvc.updateStepTitle(step.Title);
                  this.onStepDataEntry.emit({});
                  this._commonSvc.stepDetailsSave('All Changes Saved');
                }
              });
            }
          },
          error => this.errorHandlerService.handleError(error)
        );
      }
    }
  }

  handleEditorChange(field: any) {
    this._commonSvc.updateStepDetails(field);
    const currentStep = { ...this.step };
    currentStep.Fields = JSON.stringify(this.selectedStep.Fields);
    this.store.dispatch(InstructionActions.updateStep({ step: currentStep }));
  }

  updateQuillToolBarClass(focus: boolean, title: string = '') {
    if (focus) {
      this.quillToolbarClass = title;
    } else {
      this.quillToolbarClass = '';
    }
  }

  updateFields() {
    this._commonSvc.stepDetailsSave('Saving..');
    const step = this.step;
    if (Object.keys(step).length) {
      if (step.StepId) {
        this._instructionSvc.getStepById(step.StepId).subscribe((stepResp) => {
          if (Object.keys(stepResp).length) {
            const [, instructions, warnings, hints, reaction_plan] = this.selectedStep.Fields;
            stepResp.Instructions = JSON.stringify(instructions);
            stepResp.Warnings = JSON.stringify(warnings);
            stepResp.Hints = JSON.stringify(hints);
            stepResp.Reaction_Plan = JSON.stringify(reaction_plan);
            stepResp.Fields = JSON.stringify(this.selectedStep.Fields);
            this._instructionSvc.updateStep(stepResp).subscribe((resp) => {
              if (Object.keys(resp).length) {
                this.store.dispatch(InstructionActions.updateStep({ step: stepResp }));
                this.onStepDataEntry.emit({});
                this._commonSvc.setUpdatedSteps(this.steps);
                this.editByUser();
                this._commonSvc.stepDetailsSave('All Changes Saved');
              }
            });
          }
        });
      }
    }
  }

  cloneCurrentStep() {
    this.cloneStep.emit(this.step);
  }

  getStepsByWId(index: number) {
    const wid = this.instructionId;
    if (wid) {
      this.instSrvSubscription = this._instructionSvc.getStepsByWID(wid).subscribe((steps) => {
        this.store.dispatch(InstructionActions.updateSteps({ steps }));
        if (steps.length) {
          const selectedStep = steps[index];
          this.selectedStep.Title = selectedStep ? selectedStep.Title : this.selectedStep.Title;
          this.selectedStep.Fields = selectedStep?.Fields ? JSON.parse(selectedStep.Fields) : this.selectedStep.Fields;
          this._commonSvc.updateStepTitle(this.selectedStep.Title);
          this.store.dispatch(InstructionActions.updateStep({ step: selectedStep }));
          this.step = selectedStep;
          if (this.step) {
            const { Attachment, Instructions, Warnings, Hints, Reaction_Plan, StepId, WI_Id } = this.step;
            const [, instructions, warnings, hints, reaction_plan] = this.selectedStep.Fields;

            this._commonSvc.updateStepDetails(Instructions ? JSON.parse(Instructions) : instructions);
            this._commonSvc.updateStepDetails(Warnings ? JSON.parse(Warnings) : warnings);
            this._commonSvc.updateStepDetails(Hints ? JSON.parse(Hints) : hints);
            this._commonSvc.updateStepDetails(Reaction_Plan ? JSON.parse(Reaction_Plan) : reaction_plan);

            if (JSON.parse(Attachment) && JSON.parse(Attachment).length) {
              this.files = [];
              this.files = JSON.parse(Attachment) ;
              this.imageContentsSubscription = this.base64HelperService.getImageContents(this.files, `${WI_Id}/${StepId}`).subscribe(
                imageContents => {
                  this.files.forEach((file: string) => this._commonSvc.uploadImgToPreview({ image: file }));
                  this.uploadedBase64Images = [...this.uploadedBase64Images, ...imageContents];
                  this.store.dispatch(InstructionActions.updateStepImages({ stepImages: {
                    stepId: StepId,
                    attachments: Attachment,
                    imageContents: this.uploadedBase64Images.length ? JSON.stringify(this.uploadedBase64Images) : ''
                  }}));
                  this.onStepDataEntry.emit({ update: false });
                }
              );
            } else {
              this.onStepDataEntry.emit({ update: false });
            }
          }
        }
      });
    }
  }

  getStepImage = (file: string) => this.stepImages[`${this.step.WI_Id}/${this.step.StepId}/${file}`];

  ngOnInit(): void {
    this.uploadedFileSubscription = this.store.select(getUploadedFile).subscribe(
      uploadedFile => this.uploadedFile = uploadedFile
    );
    this.stepsSubscription = this.store.select(getSteps).subscribe(
      steps => this.steps = steps
    );
    this.currentStepSubscription = this.store.select(getCurrentStep).subscribe(
      currentStep => this.step = { ...currentStep }
    );
    this.instructionIdSubscription = this.store.select(getInstructionId).subscribe(
      instructionId => this.instructionId = instructionId
    );

    this.currentStepImagesSubscription = this.store.select(getCurrentStepImages).subscribe(
      () => this.stepImages = this.base64HelperService.getBase64ImageDetails()
    );

    this.stepContentForm = this.fb.group({
      'Instruction': ['', null],
      'Warning': ['', null],
      'Hint': ['', null],
      'Reaction Plan': ['', null],
    });

    this.steptitle.pipe(
      debounceTime(1000),
      distinctUntilChanged())
      .subscribe(value => {
        this.stepTitle();
      });
    this.instructionsSubscription = combineLatest([
      this.stepContentForm.get('Instruction').valueChanges.pipe(startWith('')),
      this.stepContentForm.get('Warning').valueChanges.pipe(startWith('')),
      this.stepContentForm.get('Hint').valueChanges.pipe(startWith('')),
      this.stepContentForm.get('Reaction Plan').valueChanges.pipe(startWith(''))
    ]).pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      skip(1)
    ).subscribe(
      data => {
        this.updateFields();
      }
    );

    if (this.selectedTabIndex) {
      this.files = [];
      this._commonSvc.unloadImages(this.files);
      const index = this.selectedTabIndex - 1;
      this.getStepsByWId(index);
      if (this.instructionId) {
        this.titleProvided = !this.titleProvided;
      }
    }
  }

  ngOnDestroy(): void {
    this.uploadedBase64Images = [];
    this.stepImages = {};
    if (this.instSrvSubscription) {
      this.instSrvSubscription.unsubscribe();
    }
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.instructionsSubscription) {
      this.instructionsSubscription.unsubscribe();
    }
    if (this.imageContentsSubscription) {
      this.imageContentsSubscription.unsubscribe();
    }
    if (this.uploadedFileSubscription) {
      this.uploadedFileSubscription.unsubscribe();
    }
    if (this.stepsSubscription) {
      this.stepsSubscription.unsubscribe();
    }
    if (this.currentStepSubscription) {
      this.currentStepSubscription.unsubscribe();
    }
    if (this.instructionIdSubscription) {
      this.instructionIdSubscription.unsubscribe();
    }
    if (this.currentStepImagesSubscription) {
      this.currentStepImagesSubscription.unsubscribe();
    }
  }

}
