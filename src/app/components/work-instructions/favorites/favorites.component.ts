/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { InstructionService } from '../services/instruction.service';
import { ToastService } from '../../../shared/toast';
import { ActivatedRoute } from '@angular/router';
import { ErrorInfo, Instruction } from '../../../interfaces';
import { Base64HelperService } from '../services/base64-helper.service';
import { DummyComponent } from '../../../shared/components/dummy/dummy.component';
import { ErrorHandlerService } from '../../../shared/error-handler/error-handler.service';
import { CommonService } from '../../../shared/services/common.service';
import { Observable } from 'rxjs';
import { permissions, routingUrls } from '../../../app.constants';
import { map, tap } from 'rxjs/operators';
import { HeaderService } from 'src/app/shared/services/header.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {
  config: any = {
    id: 'favorites',
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
  favorites$: Observable<Instruction[]>;
  authors$: Observable<string[]>;
  readonly routingUrls = routingUrls;
  readonly permissions = permissions;
  routeWithSearch: string;
  ghostLoading = new Array(16).fill(0).map((v, i) => i);

  @ViewChild('filteredResults', { static: false }) set favorites(
    favorites: DummyComponent
  ) {
    if (favorites) {
      favorites.value.forEach((instruction) => {
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
    private instructionSvc: InstructionService,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private base64HelperService: Base64HelperService,
    private errorHandlerService: ErrorHandlerService,
    private commonService: CommonService,
    private headerService: HeaderService
  ) {}

  ngOnInit() {
    this.routeWithSearch = `${routingUrls.favorites.url}?search=`;
    this.currentRouteUrl$ = this.commonService.currentRouteUrlAction$.pipe(
      tap(() => this.headerService.setHeaderTitle(routingUrls.favorites.title))
    );
    this.getAllWorkInstructionsByFav();
    this.authorDropDown();
    this.route.queryParamMap.subscribe((params) => {
      this.search = params.get('search');
    });
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
          this.getAllWorkInstructionsByFav();
        },
        (error) => {
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
        const info: ErrorInfo = {
          displayToast: false,
          failureResponse: 'throwError'
        };
        this.instructionSvc.deleteWorkInstruction$(el.Id, info).subscribe(
          (data) => {
            this.getAllWorkInstructionsByFav();
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

  setFav(el) {
    const info: ErrorInfo = {
      displayToast: false,
      failureResponse: 'throwError'
    };
    this.instructionSvc.setFavoriteInstructions(el.Id, info).subscribe(
      (ins) => {
        el.IsFavorite = ins.IsFavorite;
        this.getAllWorkInstructionsByFav();
      },
      (error) => this.errorHandlerService.handleError(error)
    );
  }

  getAllWorkInstructionsByFav() {
    this.favorites$ = this.instructionSvc.getFavInstructions();
  }

  getImageSrc = (source: string, path: string) =>
    source && source.indexOf('assets/') > -1
      ? source
      : this.base64HelperService.getBase64ImageData(source, path);
}
