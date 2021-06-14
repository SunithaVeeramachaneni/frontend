import { Component, OnDestroy, OnInit ,TemplateRef} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient,HttpErrorResponse,HttpHeaders  } from '@angular/common/http';
import { LoadingController, ModalController } from '@ionic/angular';
import { MyModalPageComponent } from '../my-modal-page/my-modal-page.component';
import { retry, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import {map} from 'rxjs/operators';
import { Instruction } from '../../interfaces/instruction';
import { ErrorInfo } from '../../interfaces/error-info';
import {combineLatest, Subscription} from 'rxjs';
import { Base64HelperService } from '../../shared/base64-helper.service';
import {InstructionService} from '../workinstructions/instruction.service';
import { ToastService } from 'src/app/shared/toast';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-instruction-home',
  templateUrl: './workInstructions-home.page.html',
  styleUrls: ['./workInstructions-home.page.css'],
})
export class WorkInstructionsHomeComponent implements OnInit, OnDestroy {

  public wiDraftedList: Instruction[] = [];
  public wiFavList: Instruction[] = [];
  public wiRecentList: Instruction[] = [];
  showMore = false;
  private getAllFavAndDraftInstSubscription: Subscription;
  editImg = '/assets/images/edit.svg';
  deleteImg = '/assets/images/delete.svg';
  userImg = '/assets/images/User.svg';
  searchCriteria = '';

  constructor(private http: HttpClient,
              private base64HelperService: Base64HelperService,
              private _instructionSvc: InstructionService,
              private router: Router,
              private loadingController: LoadingController,
              private toastService: ToastService) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  getBase64Images = (instructions: Instruction[]) => {
    instructions.map(instruction => {
      const { Cover_Image: coverImage } = instruction;
      if (coverImage.indexOf('assets') === -1 && !this.base64HelperService.getBase64ImageData(coverImage)) {
        this.base64HelperService.getBase64Image(coverImage);
      }
    });
  }

  getAllFavsDraftsAndRecentIns() {
    // this.spinner.show();
    const info: ErrorInfo = { displayToast: false, failureResponse: 'throwError' };
    this.getAllFavAndDraftInstSubscription = combineLatest([
      this._instructionSvc.getFavInstructions(info),
      this._instructionSvc.getDraftedInstructions(info),
      this._instructionSvc.getRecentInstructions(info)
    ])
      .pipe(
        map(([favorites, drafts, recents]: [Instruction[], Instruction[], Instruction[]]) => ({favorites, drafts, recents}))
      )
      .subscribe(
        ({favorites, drafts, recents}) => {
          console.log(favorites);
          console.log(drafts);
          this.wiFavList = favorites;
          this.wiDraftedList = drafts;
          this.wiRecentList = recents;
          // this.copyInstructionsData.recents = this.wiRecentList;
          // this.copyInstructionsData.favs = this.wiFavList;
          // this.spinner.hide();
        },
        error => {
          this._instructionSvc.handleError(error);
          // this.spinner.hide();
        }
      );
  }

  async uploadFile(event) {
    // this.spinner.show();
    const info: ErrorInfo = { displayToast: true, failureResponse: 'throwError' };
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    if (file.type.indexOf('audio') > -1 || file.type.indexOf('video') > -1) {
      formData.append('userDetails', localStorage.getItem('loggedInUser'));
      const loading = await this.loadingController.create({
        cssClass: 'my-custom-class',
        message: 'WorkInstruction conversion from audio <br/>" <b>' + file.name +' </b>" is In-progress',
      });
      await loading.present();
      this._instructionSvc.uploadWIAudioOrVideo(formData, info).subscribe(
        resp => {
          if (Object.keys(resp).length) {
            loading.dismiss();
            console.log(resp);
            // this.router.navigate(['/drafts']);
            Swal.fire({
              title: '',
              html: 'WorkInstruction <b>"' + resp.WI_Name + '"</b> is successfully created',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Goto WorkInstruction'
            }).then((result) => {
              if (result.isConfirmed) {
                this.router.navigate(['/drafts/add-instruction/',resp.Id]);
              }
            });

          }
          // this.spinner.hide();
        },
        error => loading.dismiss()
      );
    }
  }

  copyWorkInstruction = () => {
    // impl
  }

  exportAsXLSX = () => {
    // impl
  }


  ngOnInit() {
    this.getAllFavsDraftsAndRecentIns();
  }

  ngOnDestroy(): void {
    if (this.getAllFavAndDraftInstSubscription) {
      this.getAllFavAndDraftInstSubscription.unsubscribe();
    }
  }
  getImageSrc = (source: string) => {
    return source && source.indexOf('assets') > -1 ? source : this.base64HelperService.getBase64ImageData(source);
  }

}

