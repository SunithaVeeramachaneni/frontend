import {ActivatedRoute} from '@angular/router';
import {Component, ChangeDetectionStrategy, OnInit, ViewChild, ChangeDetectorRef, AfterContentChecked} from '@angular/core';
import {InstructionService} from '../services/instruction.service';
import {MatTabChangeEvent} from '@angular/material/tabs';
import {ToastService} from '../../../shared/toast';
import {combineLatest, Observable} from 'rxjs';

import Swal from 'sweetalert2';
import {NgxSpinnerService} from 'ngx-spinner';
import { map } from 'rxjs/operators';
import { ErrorInfo, Instruction } from '../../../interfaces';
import { Base64HelperService } from '../services/base64-helper.service';
import { DummyComponent } from '../../../shared/components/dummy/dummy.component';
import { ErrorHandlerService } from '../../../shared/error-handler/error-handler.service';
import { CommonService } from '../../../shared/services/common.service';
import { routingUrls } from '../../../app.constants';
import { BreadcrumbService } from 'xng-breadcrumb';

const { workInstructions: workInstructionsInfo } = routingUrls;

@Component({
  templateUrl: 'category-wise-instructions.component.html',
  styleUrls: ['./category-wise-instructions.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CategoryWiseInstructionsComponent implements OnInit, AfterContentChecked {
  @ViewChild('tabGroup') tabGroup;
  categoryId: string;
  public selectedCategory = '';
  draftsConfig: any = {
    id: 'drafts',
    currentPage: 1,
    itemsPerPage: 5,
    directionLinks: false
  };
  publishedConfig: any = {
    id: 'published',
    currentPage: 1,
    itemsPerPage: 5,
    directionLinks: false
  };
  public search: string;
  order = 'updated_at';
  reverse = true;
  reverseObj: any = {updated_at: true};
  public tabIndex;
  public CreatedBy = '';
  public EditedBy = '';
  currentRouteUrl$: Observable<string>;
  workInstructions$: Observable<{ drafts: Instruction[], published: Instruction[] }>;
  authors$: Observable<string[]>;
  routeUrl: string;

  @ViewChild('publishedFilteredResults', { static: false }) set published(published: DummyComponent) {
    if (published) {
      published.value.map(instruction => {
        const { Cover_Image: coverImage, Id: path } = instruction;
        if (coverImage.indexOf('assets/') === -1 && !this.base64HelperService.getBase64ImageData(coverImage,path)) {
          this.base64HelperService.getBase64Image(coverImage,path);
        }
      });
    }
  }

  @ViewChild('draftedFilteredResults', { static: false }) set drafts(drafts: DummyComponent) {
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
              private _toastService: ToastService,
              private route: ActivatedRoute,
              private _instructionSvc: InstructionService,
              private cdrf: ChangeDetectorRef,
              private base64HelperService: Base64HelperService,
              private errorHandlerService: ErrorHandlerService,
              private breadcrumbService: BreadcrumbService,
              private commonService: CommonService) {}

  ngAfterContentChecked() {
    this.cdrf.markForCheck();
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

  tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.tabIndex = tabChangeEvent.index;
    this.reverse = true;
    this.order = 'updated_at';
    this.reverseObj = {updated_at: true};
  }

  getAuthors() {
    this.authors$ = this._instructionSvc.getUsers()
      .pipe(
        map(users => users.map(user => `${user.first_name} ${user.last_name}`))
      );
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
        this.cdrf.markForCheck();
      },
      error => this.errorHandlerService.handleError(error)
    );
  }


  copyWI(ins) {
    const id = this.route.snapshot.paramMap.get('id');
    this.spinner.show();
    const userName = JSON.parse(localStorage.getItem("loggedInUser"));
    const info: ErrorInfo = { displayToast: false, failureResponse: 'throwError' };
    this._instructionSvc.copyWorkInstruction(ins.WI_Name, userName, info).subscribe(
      () => {
        this.spinner.hide();
        this.getInstructionsByCategoryId(this.categoryId);
        this.cdrf.markForCheck();
        this._toastService.show({
          text: "Selected work instruction has been successfully copied",
          type: 'success'
        });
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
      html: "Do you want to delete the work instruction <strong>" + "'" + el.WI_Name + "'" + "</strong> ?",
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
              this.getInstructionsByCategoryId(this.categoryId);
              this.cdrf.markForCheck();
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


  getInstructionsByCategoryId = (categoryId: string) => {
    this.spinner.show();
    this.workInstructions$ = this._instructionSvc.getInstructionsByCategoryId(categoryId)
    .pipe(
      map(workInstructions => {
        let drafts: Instruction[] = [], published: Instruction[] = [];
        workInstructions.map(workInstruction => {
          const { Published } = workInstruction;
          if (Published) {
            published = [...published, workInstruction];
          } else {
            drafts = [...drafts, workInstruction];
          }
        });
        this.spinner.hide();
        return { drafts, published };
      })
    );
  }

  ngOnInit(): void {
    this.spinner.hide();
    const cid = this.route.snapshot.paramMap.get('cid');
    this.categoryId = cid;
    this.routeUrl = `${workInstructionsInfo.url}/category/${cid}`;

    this.currentRouteUrl$ = combineLatest([
      this.commonService.currentRouteUrlAction$,
      this._instructionSvc.getSelectedCategory(cid)
    ]).pipe(
      map(([currentRouteUrl, category]) => {
        const { Category_Name } = category;
        this.selectedCategory = Category_Name;
        this.commonService.setHeaderTitle(this.selectedCategory);
        this.breadcrumbService.set(this.routeUrl, this.selectedCategory);
        return currentRouteUrl;
      })
    );

    this.getInstructionsByCategoryId(cid);
    this.getAuthors();
  }

  getImageSrc = (source: string, path: string) => {
    return source && source.indexOf('assets/') > -1 ? source : this.base64HelperService.getBase64ImageData(source, path);
  }
}
