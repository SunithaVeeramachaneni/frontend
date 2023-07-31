/* eslint-disable @angular-eslint/no-output-on-prefix */
/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  Output,
  EventEmitter
} from '@angular/core';
import { InstructionService } from '../../services/instruction.service';
import Swal from 'sweetalert2';
import { WiCommonService } from '../../services/wi-common.services';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  mergeMap,
  skip,
  startWith
} from 'rxjs/operators';
import { combineLatest, of, Subscription, timer } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastService } from '../../../../shared/toast';
import { Base64HelperService } from '../../services/base64-helper.service';
import { Subject } from 'rxjs';
import { Step, Instruction } from '../../../../interfaces';
import { Store } from '@ngrx/store';
import * as InstructionActions from '../../state/intruction.actions';
import {
  getCurrentStep,
  getCurrentStepImages,
  getInstruction,
  getSteps,
  getUploadedFile
} from '../../state/instruction.selectors';
import { permissions } from 'src/app/app.constants';
import { State } from '../../state/instruction.reducer';

@Component({
  selector: 'app-step-content',
  templateUrl: 'step-content.component.html',
  styleUrls: ['step-content.component.scss']
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
  instruction: Instruction;
  public showMsg = false;
  public selectedStep = {
    Id: '',
    Title: <any>'',
    Fields: <any>[
      {
        Title: 'Attachment',
        Position: 0,
        Active: 'true',
        FieldCategory: 'ATT',
        FieldType: 'ATT',
        FieldValue: ''
      },
      {
        Title: 'Instruction',
        Position: 1,
        Active: 'true',
        FieldCategory: 'INS',
        FieldType: 'RTF',
        FieldValue: ''
      },
      {
        Title: 'Warning',
        Position: 2,
        Active: 'true',
        FieldCategory: 'WARN',
        FieldType: 'RTF',
        FieldValue: ''
      },
      {
        Title: 'Hint',
        Position: 3,
        Active: 'true',
        FieldCategory: 'HINT',
        FieldType: 'RTF',
        FieldValue: ''
      },
      {
        Title: 'Reaction Plan',
        Position: 4,
        Active: 'true',
        FieldCategory: 'REACTION PLAN',
        FieldType: 'RTF',
        FieldValue: ''
      }
    ]
  };
  readonly permissions = permissions;
  private subscription: Subscription;
  private instSrvSubscription: Subscription;
  private instructionsSubscription: Subscription;
  private imageContentsSubscription: Subscription;
  private uploadedFileSubscription: Subscription;
  private stepsSubscription: Subscription;
  private currentStepSubscription: Subscription;
  private instructionSubscription: Subscription;
  private currentStepImagesSubscription: Subscription;
  private updateStepDetailsCalled = false;

  constructor(
    private spinner: NgxSpinnerService,
    private _commonSvc: WiCommonService,
    private _toastService: ToastService,
    private _instructionSvc: InstructionService,
    private fb: FormBuilder,
    private base64HelperService: Base64HelperService,
    private store: Store<State>
  ) {}

  handleInputChange(uploadedFile, uploadedImg) {
    const file = uploadedFile;
    const pattern = /image-*/;
    const reader = new FileReader();
    if (!file.type.match(pattern)) {
      alert('invalid format');
      return;
    }
    this.store.dispatch(
      InstructionActions.setUploadedFile({ uploadedFile: uploadedImg.image })
    );
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
      fileContent: base64result,
      fileName: this.uploadedFile,
      fileType: ''
    };
    this.base64HelperService.setBase64ImageDetails(
      this.uploadedFile,
      reader.result,
      `${this.step.WI_Id}/${this.step.StepId}`
    );
    imageContent.fileType = this.base64HelperService.getExtention(
      this.uploadedFile
    );
    this.store.dispatch(
      InstructionActions.updateStepImagesContent({
        attachment: this.uploadedFile,
        imageContent
      })
    );
    this.uploadedBase64Images = [...this.uploadedBase64Images, imageContent];
    this.onStepDataEntry.emit({});
  }

  editByUser() {
    const userName = JSON.parse(localStorage.getItem('loggedInUser'));
    const EditedBy = userName.first_name + ' ' + userName.last_name;
    const instruction = {
      ...this.instruction,
      IsPublishedTillSave: false,
      EditedBy
    };
    this._instructionSvc.updateWorkInstruction(instruction).subscribe(() => {
      this.store.dispatch(
        InstructionActions.updateInstruction({ instruction })
      );
    });
  }

  uploadFile(event, index?: number): void {
    const FILE = event.addedFiles[0];
    let uploadToS3 = true;
    const fileExists = this.files.find((file) => file === FILE.name);
    if (index !== undefined && fileExists && fileExists !== this.files[index]) {
      uploadToS3 = false;
    }

    if (uploadToS3) {
      this.spinner.show();
      this._commonSvc.stepDetailsSave('Saving..');
      const imageForm = new FormData();
      imageForm.append('path', `${this.step.WI_Id}/${this.step.StepId}`);
      imageForm.append('image', FILE);

      this._instructionSvc
        .uploadAttachments(imageForm)
        .subscribe((uploadedImg) => {
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
              const step = { ...this.step };
              step.Attachment = JSON.stringify(this.files);
              this.selectedStep.Fields[0].FieldValue = this.files;
              this.onStepDataEntry.emit({});
              step.Fields = JSON.stringify(this.selectedStep.Fields);
              this._instructionSvc
                .updateStep(step)
                .pipe(
                  mergeMap((resp) => {
                    if (
                      Object.keys(resp).length &&
                      removedFile.length &&
                      removedFile[0] !== uploadedImg.image
                    ) {
                      return this._instructionSvc
                        .deleteFile(
                          `${resp.WI_Id}/${resp.StepId}/${removedFile[0]}`
                        )
                        .pipe(map(() => resp));
                    } else {
                      return of(resp);
                    }
                  })
                )
                .subscribe((step) => {
                  if (Object.keys(step).length) {
                    this.store.dispatch(
                      InstructionActions.updateStep({ step })
                    );
                    if (uploadedImg && uploadedImg.image) {
                      this._commonSvc.uploadImgToPreview({
                        image: uploadedImg.image,
                        index
                      });
                    }
                    this.editByUser();
                    this._commonSvc.stepDetailsSave('All Changes Saved');
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
        text: 'Attachment name ' + fileExists + ' already exists!',
        type: 'warning'
      });
    }
  }

  deleteStep(el) {
    Swal.fire({
      title: 'Are you sure?',
      html: 'Do you want to delete step ' + "'" + el.Title + "'" + ' ?',
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
        APPNAME: 'MWORKORDER',
        FORMNAME: 'WI_' + this.instruction.Id,
        UNIQUEKEY: currentStep.StepId.toString()
      };
      this._instructionSvc
        .getStepFromGateway(stepParam)
        .subscribe((stepRespFromAbap) => {
          if (Object.keys(stepRespFromAbap).length) {
            const delParams = {
              APPNAME: stepRespFromAbap.APPNAME,
              FORMNAME: stepRespFromAbap.FORMNAME,
              UNIQUEKEY: stepRespFromAbap.UNIQUEKEY,
              STEPS: stepRespFromAbap.STEPS,
              WINSTRIND: 'X',
              DELIND: 'X'
            };
            this._instructionSvc
              .removeStepFromGateway(delParams)
              .subscribe((res) => {
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
    this._instructionSvc
      .removeStep(step)
      .pipe(
        mergeMap((resp) => {
          if (
            Object.keys(resp).length &&
            resp.Attachment &&
            JSON.parse(resp.Attachment).length
          ) {
            return this._instructionSvc
              .deleteFiles(`${resp.WI_Id}/${resp.StepId}`)
              .pipe(map(() => resp));
          } else {
            return of(resp);
          }
        })
      )
      .subscribe(
        (resp) => {
          if (Object.keys(resp).length) {
            this._toastService.show({
              text: 'Step ' + resp.Title + ' is deleted successfully',
              type: 'success'
            });
            this._commonSvc.stepDetailsSave('All Changes Saved');
            this.store.dispatch(InstructionActions.removeStep({ step }));
            this.store.dispatch(
              InstructionActions.removeStepImages({ stepId: step.StepId })
            );
            this.onStepDataEntry.emit({});
            this._commonSvc.setUpdatedSteps(this.steps, step);
            this._commonSvc.unloadImages([]);
            this.files = [];
            const Fields = this.selectedStep.Fields.map((field) => ({
              ...field,
              FieldValue: '\n'
            }));
            this.selectedStep = { ...this.selectedStep, Fields };
            const selectedStep = this.steps[this.selectedTabIndex - 1];
            /* While deleting steps from last index will get selectedStep as undefined because of selectedTabIndex change detection.
        If we are deleting steps from start or middle selectedTabIndex change detection won't happen we are setting the data
        manually to update the current step*/
            if (selectedStep) {
              this.selectedStep.Title = selectedStep.Title;
              this.selectedStep.Fields = selectedStep.Fields
                ? JSON.parse(selectedStep.Fields).map((field) =>
                    field.FieldValue ? field : { ...field, FieldValue: '\n' }
                  )
                : this.selectedStep.Fields;
              this._commonSvc.updateStepTitle(this.selectedStep.Title);
              this.store.dispatch(
                InstructionActions.updateStep({ step: selectedStep })
              );
              const {
                Attachment,
                Instructions,
                Warnings,
                Hints,
                Reaction_Plan
              } = selectedStep;
              const [, instructions, warnings, hints, reaction_plan] =
                this.selectedStep.Fields;
              this._commonSvc.updateStepDetails(
                Instructions ? JSON.parse(Instructions) : instructions
              );
              this._commonSvc.updateStepDetails(
                Warnings ? JSON.parse(Warnings) : warnings
              );
              this._commonSvc.updateStepDetails(
                Hints ? JSON.parse(Hints) : hints
              );
              this._commonSvc.updateStepDetails(
                Reaction_Plan ? JSON.parse(Reaction_Plan) : reaction_plan
              );

              if (JSON.parse(Attachment) && JSON.parse(Attachment).length) {
                this.files = JSON.parse(Attachment);
                for (let imgCnt = 0; imgCnt < this.files.length; imgCnt++) {
                  this._commonSvc.uploadImgToPreview({
                    image: this.files[imgCnt]
                  });
                }
              }
            }
          }
        },
        (error) => {
          // console.log(error);
        }
      );
  }

  deleteAtt(file, index) {
    Swal.fire({
      title: 'Are you sure?',
      html: 'Do you want to delete the attachment?',
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
    const step = { ...this.step };
    step.Attachment = JSON.stringify(this.files);
    this.selectedStep.Fields[0].FieldValue = this.files;
    step.Fields = JSON.stringify(this.selectedStep.Fields);
    this._instructionSvc
      .updateStep(step)
      .pipe(
        mergeMap((resp) => {
          if (Object.keys(resp).length) {
            return this._instructionSvc
              .deleteFile(`${resp.WI_Id}/${resp.StepId}/${attachment}`)
              .pipe(map(() => resp));
          } else {
            return of(resp);
          }
        })
      )
      .subscribe((step) => {
        if (Object.keys(step).length) {
          this.store.dispatch(
            InstructionActions.removeStepImagesContent({
              attachment: attachment[0]
            })
          );
          this.onStepDataEntry.emit({});
          this.store.dispatch(InstructionActions.updateStep({ step }));
          this._commonSvc.unloadImages([]);
          if (this.files) {
            for (let i = 0; i < this.files.length; i++) {
              this._commonSvc.uploadImgToPreview({ image: this.files[i] });
            }
          }
          this._toastService.show({
            text: 'Attachment has been deleted successfully',
            type: 'success'
          });
          this.editByUser();
          this._commonSvc.stepDetailsSave('All Changes Saved');
        }
      });
  }

  stepTitle() {
    this._commonSvc.stepDetailsSave('Saving..');
    const step = { ...this.step };
    step.Title = this.selectedStep.Title;
    this._instructionSvc.updateStep(step).subscribe((resp) => {
      if (Object.keys(resp).length) {
        this.store.dispatch(InstructionActions.updateStep({ step }));
        this._commonSvc.setUpdatedSteps(this.steps);
        this._toastService.show({
          text: 'Step title has been updated',
          type: 'success'
        });
        document.getElementById('step_title').blur();
        this._commonSvc.updateStepTitle(this.selectedStep.Title);
        this.onStepDataEntry.emit({});
        this.editByUser();
        this._commonSvc.stepDetailsSave('All Changes Saved');
      }
    });
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
          if (stepResp && Object.keys(stepResp).length) {
            const [, instructions, warnings, hints, reaction_plan] =
              this.selectedStep.Fields;
            stepResp.Instructions = JSON.stringify(instructions);
            stepResp.Warnings = JSON.stringify(warnings);
            stepResp.Hints = JSON.stringify(hints);
            stepResp.Reaction_Plan = JSON.stringify(reaction_plan);
            stepResp.Fields = JSON.stringify(this.selectedStep.Fields);
            this._instructionSvc.updateStep(stepResp).subscribe((resp) => {
              if (Object.keys(resp).length) {
                this.store.dispatch(
                  InstructionActions.updateStep({ step: stepResp })
                );
                this.onStepDataEntry.emit({});
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

  updateStepDetails(index: number) {
    const selectedStep = this.steps[index];
    if (!selectedStep) return;
    this.selectedStep.Title = selectedStep.Title;
    this.selectedStep.Fields = selectedStep.Fields
      ? JSON.parse(selectedStep.Fields)
      : this.selectedStep.Fields;
    this._commonSvc.updateStepTitle(this.selectedStep.Title);
    this.store.dispatch(InstructionActions.updateStep({ step: selectedStep }));
    const {
      Attachment,
      Instructions,
      Warnings,
      Hints,
      Reaction_Plan,
      StepId,
      WI_Id
    } = selectedStep;
    const [, instructions, warnings, hints, reaction_plan] =
      this.selectedStep.Fields;

    this._commonSvc.updateStepDetails(
      Instructions ? JSON.parse(Instructions) : instructions
    );
    this._commonSvc.updateStepDetails(
      Warnings ? JSON.parse(Warnings) : warnings
    );
    this._commonSvc.updateStepDetails(Hints ? JSON.parse(Hints) : hints);
    this._commonSvc.updateStepDetails(
      Reaction_Plan ? JSON.parse(Reaction_Plan) : reaction_plan
    );

    if (JSON.parse(Attachment) && JSON.parse(Attachment).length) {
      this.files = [];
      this.files = JSON.parse(Attachment);
      this.imageContentsSubscription = this.base64HelperService
        .getImageContents(this.files, `${WI_Id}/${StepId}`)
        .subscribe((imageContents) => {
          this.files.forEach((file: string) =>
            this._commonSvc.uploadImgToPreview({ image: file })
          );
          this.uploadedBase64Images = [
            ...this.uploadedBase64Images,
            ...imageContents
          ];
          this.store.dispatch(
            InstructionActions.updateStepImages({
              stepImages: {
                stepId: StepId,
                attachments: Attachment,
                imageContents: this.uploadedBase64Images.length
                  ? JSON.stringify(this.uploadedBase64Images)
                  : ''
              }
            })
          );
          this.onStepDataEntry.emit({ update: false });
        });
    } else {
      this.onStepDataEntry.emit({ update: false });
    }
  }

  getStepImage = (file: string) =>
    this.stepImages[`${this.step.WI_Id}/${this.step.StepId}/${file}`];

  ngOnInit(): void {
    this.instructionSubscription = this.store
      .select(getInstruction)
      .subscribe((instruction) => {
        this.instruction = instruction;
      });
    this.stepsSubscription = this.store.select(getSteps).subscribe((steps) => {
      this.steps = steps;
      if (
        !this.updateStepDetailsCalled &&
        this.steps.length &&
        this.selectedTabIndex
      ) {
        this.updateStepDetailsCalled = true;
        this.files = [];
        this._commonSvc.unloadImages(this.files);
        const index = this.selectedTabIndex - 1;
        this.updateStepDetails(index);
        if (this.instruction.Id) {
          this.titleProvided = !this.titleProvided;
        }
      }
    });
    this.currentStepSubscription = this.store
      .select(getCurrentStep)
      .subscribe((currentStep) => (this.step = { ...currentStep }));
    this.uploadedFileSubscription = this.store
      .select(getUploadedFile)
      .subscribe((uploadedFile) => (this.uploadedFile = uploadedFile));
    this.currentStepImagesSubscription = this.store
      .select(getCurrentStepImages)
      .subscribe(
        () =>
          (this.stepImages = this.base64HelperService.getBase64ImageDetails())
      );

    this.stepContentForm = this.fb.group({
      Instruction: ['', null],
      Warning: ['', null],
      Hint: ['', null],
      'Reaction Plan': ['', null]
    });

    this.steptitle
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((value) => {
        this.stepTitle();
      });
    this.instructionsSubscription = combineLatest([
      this.stepContentForm.get('Instruction').valueChanges.pipe(startWith('')),
      this.stepContentForm.get('Warning').valueChanges.pipe(startWith('')),
      this.stepContentForm.get('Hint').valueChanges.pipe(startWith('')),
      this.stepContentForm.get('Reaction Plan').valueChanges.pipe(startWith(''))
    ])
      .pipe(debounceTime(1000), distinctUntilChanged(), skip(1))
      .subscribe((data) => {
        this.updateFields();
      });
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
    if (this.instructionSubscription) {
      this.instructionSubscription.unsubscribe();
    }
    if (this.currentStepImagesSubscription) {
      this.currentStepImagesSubscription.unsubscribe();
    }
  }
}
