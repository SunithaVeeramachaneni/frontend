import {Component, ViewChild, ElementRef, OnInit, OnDestroy, AfterViewInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {InstructionService} from '../services/instruction.service';
import Swal from 'sweetalert2';
import {ActivatedRoute, Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {WiCommonService} from '../services/wi-common.services';
import {ToastService} from '../../../shared/toast';
import { InsToBePublished, Instruction, ErrorInfo, Step, FileInfo } from '../../../interfaces';
import { Store } from '@ngrx/store';
import { State } from '../../../state/app.state';
import * as InstructionActions from '../state/intruction.actions';
import { getInsToBePublished, getInstruction, getSteps } from '../state/instruction.selectors';
import { CommonService } from '../../../shared/services/common.service';
import { ErrorHandlerService } from '../../../shared/error-handler/error-handler.service';

@Component({
  selector: 'app-add-workinstruction',
  templateUrl: './add-workinstruction.component.html',
  styleUrls: ['./add-workinstruction.component.css']
})

export class AddWorkinstructionComponent implements OnInit, OnDestroy {
  @ViewChild('workInstructionTitle') workInstructionTitle: ElementRef;
  headerTitle = 'Work Instructions'
  public wi_title = '';
  public selectedInstruction: Instruction = {
    Id: '',
    WI_Id: 0,
    WI_Desc: '',
    WI_Name: '',
    IsFavorite: false,
    AssignedObjects: null,
    CreatedBy: '',
    EditedBy: '',
    created_at: '',
    Categories: '',
    Tools: '',
    SpareParts: '',
    SafetyKit: '',
    Published: false,
    IsPublishedTillSave: false,
    Equipements: '',
    Locations: '',
    updated_at: null,
    Cover_Image: '',
    IsFromAudioOrVideoFile: false,
    IsAudioOrVideoFileDeleted: false,
    FilePath: null,
    FileType: null
  };

  insToBePublished: InsToBePublished[];
  steps: Step[];
  instructionTitle: string;
  public titleProvided = false;
  public receivedInstruction = false;
  public saveStatus = '';
  public beforeSaveMessage = false;
  public afterSaveMessage = true;
  public saveddata = false;
  public publisheddata = false;
  public setCategory = false;
  isWIPublished = false;
  titleTextChanged = new Subject<string>();
  titleErrors: any = {exists: false, required: false};
  addOrUpdateTitle = false;
  fileInfo: FileInfo;
  private titleChangeSubscription: Subscription;
  private stepDetailsSaveSubscription: Subscription;
  private publishInstructionSubscription: Subscription;
  private insToBePublishedSubscription: Subscription;
  private instructionSubscription: Subscription;
  private stepsSubscription: Subscription;

  constructor(private spinner: NgxSpinnerService,
              private route: ActivatedRoute,
              private wiCommonSvc: WiCommonService,
              private _instructionsvc: InstructionService,
              private _toastService: ToastService,
              private router: Router,
              private store: Store<State>,
              private commonService: CommonService,
              private errorHandlerService: ErrorHandlerService) {
  }

  ionViewDidEnter() {
    this.workInstructionTitle.nativeElement.focus();
  }

  ngOnInit(): void {
    this.insToBePublishedSubscription = this.store.select(getInsToBePublished).subscribe(
      insToBePublished => this.insToBePublished = insToBePublished
    );
    this.instructionSubscription = this.store.select(getInstruction).subscribe(
      instruction => {
        this.selectedInstruction = { ...instruction };
        this.instructionTitle = instruction.WI_Name;
        const { FilePath: filePath, FileType: fileType } = this.selectedInstruction;
        this.fileInfo = { filePath, fileType };
      }
    );
    this.stepsSubscription = this.store.select(getSteps).subscribe(
      steps => this.steps = steps
    );
    this.commonService.minimizeSidebar(true);
    this.stepDetailsSaveSubscription = this.wiCommonSvc.stepDetailsSaveAction$.subscribe(
      data => {
        this.saveStatus = data;
      }
    );
    const wid = this.route.snapshot.paramMap.get('id');
    if (wid) {
      this._instructionsvc.getInstructionsById(wid).subscribe((res) => {
        if (res && Object.keys(res).length > 0) {
          this.store.dispatch(InstructionActions.updateInstruction({ instruction: res }));
          this.receivedInstruction = true;
          this.titleProvided = true;
          if (res.Published === true) {
            this.saveddata = true;
            this.publisheddata = res.IsPublishedTillSave ? true : false;
            this.receivedInstruction = res.IsPublishedTillSave ? false : true;
            this.beforeSaveMessage = true;
            this.afterSaveMessage = false;
            this.isWIPublished = true;
          }
          if (res.Published === false) {
            this.saveddata = true;
            this.beforeSaveMessage = true;
            this.afterSaveMessage = false;
            this.isWIPublished = false;
          }
        }
      });
    }

    this.titleChangeSubscription = this.titleTextChanged
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        switchMap(WI_Name => this._instructionsvc.getInstructionsByName(WI_Name, { displayToast: false, failureResponse: 'throwError' }))
      )
      .subscribe(
        workInstructions => {
          if (this.wi_title !== this.instructionTitle && workInstructions.length) {
            this.titleErrors = {...this.titleErrors, exists: true};
          } else {
            this.titleErrors = {...this.titleErrors, exists: false};
          }

          if (this.addOrUpdateTitle && !this.titleErrors.exists) {
            this.addTitleToInstruction();
          }
        },
        error => this.errorHandlerService.handleError(error)
      );
  }

  publishInstruction(el) {
    this.store.dispatch(InstructionActions.setInsToBePublished());
    const wiToBePublsihed = this.insToBePublished;
    const steps = this.steps;
    const wid = this.selectedInstruction?.Id;
    const favFlag = this.selectedInstruction?.IsFavorite;
    const { first_name, last_name } = JSON.parse(localStorage.getItem('loggedInUser'));
    const editedBy = `${first_name} ${last_name}`;
    Swal.fire({
      title: 'Are you sure?',
      html: `Do you want to publish work instruction '${el.WI_Name}' ?`,
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#888888',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Publish',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.show();
        const info: ErrorInfo = { displayToast: false, failureResponse: 'throwError' };
        this.publishInstructionSubscription = this._instructionsvc.publishInstruction({
          wiToBePublsihed,
          steps,
          wid,
          editedBy
        }, info).subscribe(
          () => {
            this.spinner.hide();
            this._toastService.show({
              text: `Work instruction '${el.WI_Name}' has been published successfully`,
              type: 'success'
            });
            if (favFlag) {
              this.updateFavFlag(wiToBePublsihed);
            }
            this.publisheddata = true;
            this.receivedInstruction = false;
            this.isWIPublished = true;
            this.updatePublishedTillSaveWI(true);
          },
          error => {
            this.spinner.hide();
            this.errorHandlerService.handleError(error);
          }
        );
      }
    });
  }

  updateFavFlag(wiToBePublsihed) {
    const {APPNAME, FORMNAME, FORMTITLE, VERSION, WINSTRIND } = wiToBePublsihed[0];
    const favInstructionData = {
      APPNAME,
      FORMNAME,
      FORMTITLE,
      FAVOURITE: 'X',
      VERSION,
      WINSTRIND
    };
    this._instructionsvc.updateGatewayFavWorkInstruction(favInstructionData).subscribe(() => {
      console.log('Action updated');
    }, error => {
      console.log(error);
    });
  }

  public getWorkInstruction({insObj, update}): void {
    if (update) {
      this.receivedInstruction = true;
      this.saveddata = false;
      this.publisheddata = false;
      this.beforeSaveMessage = false;
      this.afterSaveMessage = true;
      this.draftWI(insObj);
    }
  }

  public getStepsData({ update }): void {
    if (update) {
      this.receivedInstruction = true;
      this.publisheddata = false;
      this.beforeSaveMessage = true;
      this.afterSaveMessage = false;
      this.updatePublishedTillSaveWI(false);
    }
  }

  publishOnAddCloneStepsHandler(): void {
    this.receivedInstruction = true;
    this.publisheddata = false;
    this.beforeSaveMessage = true;
    this.afterSaveMessage = false;
    this.updatePublishedTillSaveWI(false);
  }

  updatePublishedTillSaveWI = (published: boolean) => {
    if (this.isWIPublished) {
      const userName = JSON.parse(localStorage.getItem('loggedInUser'));
      if (this.selectedInstruction && this.selectedInstruction?.Id) {
        this._instructionsvc.getInstructionsById(this.selectedInstruction?.Id).subscribe((res) => {
          if (res && Object.keys(res).length > 0) {
            const IsPublishedTillSave = published ? true : false;
            // const EditedBy = userName.first_name + ' ' + userName.last_name;
            const instruction = {...this.selectedInstruction, Published: true, IsPublishedTillSave};
            this._instructionsvc.updateWorkInstruction(instruction).subscribe(
              () => {
                this.store.dispatch(InstructionActions.updateInstruction({ instruction }));
              });
          }
        });
      }
    }
  }

  copyWI(ins) {
    this.spinner.show();
    const userName = JSON.parse(localStorage.getItem('loggedInUser'));
    const info: ErrorInfo = { displayToast: false, failureResponse: 'throwError' };
    this._instructionsvc.copyWorkInstruction(ins.WI_Name, userName, info).subscribe(
      () => {
        this.spinner.hide();
        this._toastService.show({
          text: 'Selected work instruction has been successfully copied',
          type: 'success'
        });
        this.router.navigate(['/work-instructions']);
      },
      error => {
        this.spinner.hide();
        this.errorHandlerService.handleError(error);
      }
    );
  }


  removeWI(el) {
    Swal.fire({
      title: 'Are you sure?',
      html: `Do you want to delete the work instruction <strong>'${el.WI_Name}'</strong> ?`,
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#888888',
      confirmButtonColor: '#d33',
      confirmButtonText: 'Delete',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        const ID = this.selectedInstruction?.Id;
        const info: ErrorInfo = { displayToast: false, failureResponse: 'throwError' };
        this._instructionsvc.deleteWorkInstruction$(ID, info)
          .subscribe(
            data => {
              this.router.navigate(['/work-instructions']);
              this._toastService.show({
                text: `Work instuction '${el.WI_Name}' has been deleted`,
                type: 'success',
              });
            },
            err => {
              this.errorHandlerService.handleError(err);
            }
          );
      }
    });
  }

  draftWI(insObj) {
    this.saveStatus = 'Saving..';
    const ID = this.selectedInstruction?.Id;
    const userName = JSON.parse(localStorage.getItem('loggedInUser'));
    this._instructionsvc.getInstructionsById(ID).subscribe((res) => {
      if (res && Object.keys(res).length > 0) {
        const ins = res;
        ins.EditedBy = userName.first_name + ' ' + userName.last_name;
        const { AssignedObjects, Tools, SafetyKit, SpareParts, Categories } = insObj;
        ins.AssignedObjects = AssignedObjects;
        ins.Tools = Tools;
        ins.SafetyKit = SafetyKit;
        ins.SpareParts = SpareParts;
        ins.Categories = Categories;

        this._instructionsvc.updateWorkInstruction(ins).subscribe((instruction) => {
          if (Object.keys(instruction).length) {
            this.store.dispatch(InstructionActions.updateInstruction({ instruction }));
            this.saveddata = true;
            this.beforeSaveMessage = !this.beforeSaveMessage;
            this.afterSaveMessage = !this.afterSaveMessage;
            this.updatePublishedTillSaveWI(false);
            this.saveStatus = 'All Changes Saved';
          }
        });
      }
    });
  }

  setFav() {
    const wid = this.route.snapshot.paramMap.get('id') || this.selectedInstruction?.Id;
    const info: ErrorInfo = { displayToast: false, failureResponse: 'throwError' };
    this._instructionsvc.setFavoriteInstructions(wid, info).subscribe(
      ins => {
        this.store.dispatch(InstructionActions.updateInstruction({ instruction: ins }));
      },
      error => this.errorHandlerService.handleError(error)
    );
  }

  addTitleToInstruction() {
    this.wiCommonSvc.stepDetailsSave('Saving..');
    const userName = JSON.parse(localStorage.getItem('loggedInUser'));
    const wid = this.route.snapshot.paramMap.get('id');
    const WI = this.selectedInstruction;
    if ((WI && WI.Id) || wid) {
      const id = wid ? wid : WI.Id;
      const info: ErrorInfo = { displayToast: false, failureResponse: 'throwError' };
      this._instructionsvc.editWorkInstructionTitle(id, userName, this.selectedInstruction, info).subscribe(
        resp => {
          const instruction = resp;
          this.store.dispatch(InstructionActions.updateInstruction({ instruction }));
          // document.getElementById('wi_title').blur();
          this.wiCommonSvc.stepDetailsSave('All Changes Saved');
        },
        error => this.errorHandlerService.handleError(error)
      );
    } else {
      const info: ErrorInfo = { displayToast: false, failureResponse: 'throwError' };
      this._instructionsvc.addWorkInstructionTitle(userName, this.selectedInstruction, info).subscribe(instruction => {
        if (Object.keys(instruction).length) {
          this.store.dispatch(InstructionActions.addInstruction({ instruction }));
          this.titleProvided = true;
          this.saveddata = true;
          this.receivedInstruction = true;
          this.beforeSaveMessage = !this.beforeSaveMessage;
          this.afterSaveMessage = !this.afterSaveMessage;
          this.setCategory = true;
          this.updatePublishedTillSaveWI(false);
          // document.getElementById('wi_title').blur();
          this.wiCommonSvc.stepDetailsSave('All Changes Saved');
        }
      }, error => {
        this.errorHandlerService.handleError(error);
      });
    }
  }

  titleChange = (WI_Name: string, addOrUpdateTitle: boolean) => {
    this.addOrUpdateTitle = addOrUpdateTitle;
    this.wi_title = WI_Name?.trim();
    if (this.wi_title) {
      this.titleErrors = {...this.titleErrors, required: false};
      this.titleTextChanged.next(this.wi_title);
    } else {
      this.titleErrors = {...this.titleErrors, required: true, exists: false};
    }
  }

  public ngOnDestroy() {
    this.insToBePublished = [];
    this.store.dispatch(InstructionActions.resetInstructionState());
    if (this.stepDetailsSaveSubscription) {
      this.stepDetailsSaveSubscription.unsubscribe();
    }
    if (this.titleChangeSubscription) {
      this.titleChangeSubscription.unsubscribe();
    }
    if (this.publishInstructionSubscription) {
      this.publishInstructionSubscription.unsubscribe();
    }
    if (this.insToBePublishedSubscription) {
      this.insToBePublishedSubscription.unsubscribe();
    }
    if (this.instructionSubscription) {
      this.instructionSubscription.unsubscribe();
    }
    if (this.stepsSubscription) {
      this.stepsSubscription.unsubscribe();
    }
  }

}

