import {Component, OnInit, ViewChild} from '@angular/core';
import Swal from 'sweetalert2';
import {InstructionService} from '../services/instruction.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {ToastService} from '../../../shared/toast';
import { ActivatedRoute } from '@angular/router';
import { ErrorInfo, Instruction } from '../../../interfaces';
import { Base64HelperService } from '../services/base64-helper.service';
import { DummyComponent } from '../../../shared/components/dummy/dummy.component';
import { ErrorHandlerService } from '../../../shared/error-handler/error-handler.service';
import { CommonService } from '../../../shared/services/common.service';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { routingUrls } from '../../../app.constants';

@Component({
  selector: 'app-drafts',
  templateUrl: './drafts.component.html',
  styleUrls: ['./drafts.component.css']
})

export class DraftsComponent implements OnInit {
  config: any = {
    id: 'drafts',
    currentPage: 1,
    itemsPerPage: 6,
    directionLinks: false
  };
  search: string;
  order = 'updated_at';
  reverse = true;
  reverseObj: any = {updated_at: true};
  public CreatedBy = '';
  public EditedBy = '';
  currentRouteUrl$: Observable<string>;
  drafts$: Observable<Instruction[]>;
  authors$: Observable<string[]>;
  readonly routingUrls = routingUrls;
  routeWithSearch: string;

  @ViewChild('filteredResults', { static: false }) set drafts(drafts: DummyComponent) {
    if (drafts) {
      drafts.value.map(instruction => {
        const { Cover_Image: coverImage, Id: path } = instruction;
        if (coverImage.indexOf('assets/') === -1 && !this.base64HelperService.getBase64ImageData(coverImage, path)) {
          this.base64HelperService.getBase64Image(coverImage, path);
        }
      });
    }
  }

  constructor(private spinner: NgxSpinnerService,
              private _instructionSvc: InstructionService,
              private _toastService: ToastService,
              private route: ActivatedRoute,
              private base64HelperService: Base64HelperService,
              private errorHandlerService: ErrorHandlerService,
              private commonService: CommonService) { }
  
  ngOnInit() {
    this.spinner.hide();
    this.routeWithSearch = `${routingUrls.drafts.url}?search=`;
    this.currentRouteUrl$ = this.commonService.currentRouteUrlAction$
      .pipe(
        tap(() => this.commonService.setHeaderTitle(routingUrls.drafts.title))
      );
    this.getAllDraftedInstructions();
    this.AuthorDropDown();
    this.route.queryParamMap.subscribe(params => {
      this.search = params.get('search');
    });
  }

  AuthorDropDown () {
    this.authors$ = this._instructionSvc.getUsers()
      .pipe(
        map(users => users.map(user => `${user.first_name} ${user.last_name}`))
      );
  }

  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    } else {
      this.order = value;
      this.reverse = false;
    }
    this.reverseObj = {[value]: this.reverse};
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
        this.spinner.show();
        const info: ErrorInfo = { displayToast: false, failureResponse: 'throwError' };
        this._instructionSvc.deleteWorkInstruction$(el.Id, info)
          .subscribe(
            data => {
              this.spinner.hide();
              this.getAllDraftedInstructions();
              this._toastService.show({
                text: "Work instuction '"+ el.WI_Name +"' has been deleted",
                type: 'success',
              });
            },
            err => {
              this.spinner.hide();
              this.errorHandlerService.handleError(err);
            }
          );
      }
    });
  }

  setFav(el) {
    const userName = JSON.parse(localStorage.getItem("loggedInUser"));
    const info: ErrorInfo = { displayToast: false, failureResponse: 'throwError' };
    this._instructionSvc.setFavoriteInstructions(el.Id, info).subscribe(
      ins => {
        el.IsFavorite = ins.IsFavorite;
        if (userName) {
          el.EditedBy = userName.first_name + " " + userName.last_name;
        }
      },
      error => this.errorHandlerService.handleError(error)
    );
  }

  getAllDraftedInstructions() {
    this.spinner.show();
    this.drafts$ = this._instructionSvc.getDraftedInstructions()
      .pipe(
        tap(() => this.spinner.hide())
      );
  }

  copyWI(ins) {
    console.log(ins);
    this.spinner.show();
    const userName = JSON.parse(localStorage.getItem("loggedInUser"));
    const info: ErrorInfo = { displayToast: false, failureResponse: 'throwError' };
    this._instructionSvc.copyWorkInstruction(ins.WI_Name, userName, info).subscribe(
      () => {
        this.spinner.hide();
        this._toastService.show({
          text: "Selected work instruction has been successfully copied",
          type: 'success'
        });
        this.getAllDraftedInstructions();
      },
      error => {
        this.spinner.hide();
        this.errorHandlerService.handleError(error);
      }
    );
  }

  getImageSrc = (source: string, path: string) => {
    return source && source.indexOf('assets/') > -1 ? source : this.base64HelperService.getBase64ImageData(source, path);
  }
}
