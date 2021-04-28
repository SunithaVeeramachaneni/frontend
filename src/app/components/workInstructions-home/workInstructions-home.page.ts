import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient,HttpErrorResponse,HttpHeaders  } from '@angular/common/http';
import { ModalController } from '@ionic/angular';
import { MyModalPageComponent } from '../my-modal-page/my-modal-page.component';
import { retry, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import {map} from 'rxjs/operators';
import { Instruction } from '../../interfaces/instruction';
import { ErrorInfo } from '../../interfaces/error-info';
import {combineLatest, Subscription} from 'rxjs';
import { Base64HelperService } from '../../shared/base64-helper.service';
import {InstructionService} from './categories/workinstructions/instruction.service';

@Component({
  selector: 'app-instruction-home',
  templateUrl: './workInstructions-home.page.html',
  styleUrls: ['./workInstructions-home.page.scss'],
})
export class WorkInstructionsHomeComponent implements OnInit {

  public wiDraftedList: Instruction[] = [];
  public wiFavList: Instruction[] = [];
  public wiRecentList: Instruction[] = [];
  showMore = false;
  private getAllFavAndDraftInstSubscription: Subscription;
  editImg = '/assets/images/edit.svg';
  deleteImg = '/assets/images/delete.svg';
  userImg = '/assets/images/User.svg';


  constructor(private http: HttpClient, 
    private base64HelperService: Base64HelperService,
    private _instructionSvc: InstructionService) { }
  
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


  ngOnInit() {
    this.getAllFavsDraftsAndRecentIns();
  }

}

