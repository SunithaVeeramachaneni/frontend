import { Component, OnInit, ViewChild } from '@angular/core';
import { InstructionService } from '../services/instruction.service';
import Swal from 'sweetalert2';
import { ToastService } from '../../../shared/toast';
import { ErrorInfo, Instruction } from '../../../interfaces';
import { Base64HelperService } from '../services/base64-helper.service';
import { DummyComponent } from '../../../shared/components/dummy/dummy.component';
import { ErrorHandlerService } from '../../../shared/error-handler/error-handler.service';
import { Observable } from 'rxjs';
import { permissions, routingUrls } from '../../../app.constants';
import { CommonService } from '../../../shared/services/common.service';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-recents',
  templateUrl: './recents.component.html',
  styleUrls: ['./recents.component.scss']
})
export class RecentsComponent implements OnInit {
  config: any = {
    id: 'recents',
    currentPage: 1,
    itemsPerPage: 6,
    directionLinks: false
  };
  search: string;
  order = 'updated_at';
  reverse = true;
  reverseObj: any = { updated_at: true };
  public CreatedBy = '';
  public EditedBy = '';
  currentRouteUrl$: Observable<string>;
  recents$: Observable<Instruction[]>;
  authors$: Observable<string[]>;
  readonly routingUrls = routingUrls;
  readonly permissions = permissions;

  @ViewChild('filteredResults', { static: false }) set recentWIs(
    recents: DummyComponent
  ) {
    if (recents) {
      recents.value.forEach((instruction) => {
        const { Cover_Image: coverImage, Id: path } = instruction;
        if (
          coverImage.indexOf('assets/') === -1 &&
          !this.base64HelperService.getBase64ImageData(coverImage, path)
        ) {
          this.base64HelperService.getBase64Image(coverImage, path);
        }
      });
    }
  }

  constructor(
    private toastService: ToastService,
    private instructionSvc: InstructionService,
    private base64HelperService: Base64HelperService,
    private errorHandlerService: ErrorHandlerService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.currentRouteUrl$ = this.commonService.currentRouteUrlAction$.pipe(
      tap(() => this.commonService.setHeaderTitle(routingUrls.recents.title))
    );
    this.getAllRecentInstructions();
    this.authorDropDown();
  }

  authorDropDown() {
    this.authors$ = this.instructionSvc
      .getUsers()
      .pipe(
        map((users) =>
          users.map((user) => `${user.first_name} ${user.last_name}`)
        )
      );
  }

  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    } else {
      this.order = value;
      this.reverse = false;
    }
    this.reverseObj = { [value]: this.reverse };
  }

  setFav(el) {
    const userName = JSON.parse(localStorage.getItem('loggedInUser'));
    const info: ErrorInfo = {
      displayToast: false,
      failureResponse: 'throwError'
    };
    this.instructionSvc.setFavoriteInstructions(el.Id, info).subscribe(
      (ins) => {
        el.IsFavorite = ins.IsFavorite;
        if (userName) {
          el.EditedBy = userName.first_name + ' ' + userName.last_name;
        }
      },
      (error) => this.errorHandlerService.handleError(error)
    );
  }

  copyWI(ins) {
    const userName = JSON.parse(localStorage.getItem('loggedInUser'));
    const info: ErrorInfo = {
      displayToast: false,
      failureResponse: 'throwError'
    };
    this.instructionSvc
      .copyWorkInstruction(ins.WI_Name, userName, info)
      .subscribe(
        () => {
          this.toastService.show({
            text: 'Selected work instruction has been successfully copied',
            type: 'success'
          });
          this.getAllRecentInstructions();
        },
        (error) => {
          this.errorHandlerService.handleError(error);
        }
      );
  }

  removeWI(el) {
    const instructionType = el.Published ? 'published' : 'drafted';
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
        const info: ErrorInfo = {
          displayToast: false,
          failureResponse: 'throwError'
        };
        this.instructionSvc.deleteWorkInstruction$(el.Id, info).subscribe(
          (data) => {
            this.getAllRecentInstructions();
            this.toastService.show({
              text: "Work instuction '" + el.WI_Name + "' has been deleted",
              type: 'success'
            });
          },
          (err) => {
            this.errorHandlerService.handleError(err);
          }
        );
      }
    });
  }

  getAllRecentInstructions() {
    this.recents$ = this.instructionSvc.getRecentInstructions();
  }

  getImageSrc = (source: string, path: string) =>
    source && source.indexOf('assets/') > -1
      ? source
      : this.base64HelperService.getBase64ImageData(source, path);
}
