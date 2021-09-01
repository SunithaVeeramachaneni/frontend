import {ActivatedRoute} from '@angular/router';
import {Component, ChangeDetectionStrategy, OnInit, ViewChild, ChangeDetectorRef, OnDestroy, ElementRef} from '@angular/core';
import {InstructionService} from '../services/instruction.service';
import {MatTabChangeEvent} from '@angular/material';
import {ToastService} from '../../../shared/toast';
import {Subscription} from 'rxjs';

import Swal from 'sweetalert2';
import {NgxSpinnerService} from 'ngx-spinner';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { ErrorInfo } from '../../../interfaces';
import { Base64HelperService } from '../services/base64-helper.service';
import { DummyComponent } from '../../../shared/components/dummy/dummy.component';
import { ErrorHandlerService } from '../../../shared/error-handler/error-handler.service';

@Component({
  templateUrl: 'category-wise-instructions.component.html',
  styleUrls: ['./category-wise-instructions.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CategoryWiseInstructionsComponent implements OnInit, OnDestroy {
  headerTitle: string;
  @ViewChild('tabGroup') tabGroup;
  public wiDetailObject = null;
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
  private getCategoryAndInsSubscription: Subscription;
  public draftedInstructionsList = [];
  public publishedInstructionsList = [];
  public search: string;
  order = 'updated_at';
  reverse = true;
  reverseObj: any = {updated_at: true};
  sortedCollection: any[];
  public tabIndex;
  public authors = [];
  public CreatedBy = '';
  public EditedBy = '';

  @ViewChild('publishedFilteredResults', { static: false }) set published(published: DummyComponent) {
    if (published) {
      published.value.map(instruction => {
        const { Cover_Image: coverImage } = instruction;
        if (coverImage.indexOf('assets') === -1 && !this.base64HelperService.getBase64ImageData(coverImage)) {
          this.base64HelperService.getBase64Image(coverImage);
        }
      });
    }
  }

  @ViewChild('draftedFilteredResults', { static: false }) set drafts(drafts: DummyComponent) {
    if (drafts) {
      drafts.value.map(instruction => {
        const { Cover_Image: coverImage } = instruction;
        if (coverImage.indexOf('assets') === -1 && !this.base64HelperService.getBase64ImageData(coverImage)) {
          this.base64HelperService.getBase64Image(coverImage);
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
              private errorHandlerService: ErrorHandlerService) {}

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
    this._instructionSvc.getUsers().subscribe((users) => {
      this.authors = users.map(user => `${user.first_name} ${user.last_name}`);
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
        this._toastService.show({
          text: "Selected work instruction has been successfully copied",
          type: 'success'
        });
        this.getInstructionsWithCategoryName(id);
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
              this.getInstructionsWithCategoryName(this.categoryId);
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


  getInstructionsWithCategoryName = (categoryId: string) => {
    this.draftedInstructionsList = [];
    this.publishedInstructionsList = [];
    this.spinner.show();
    const info: ErrorInfo = { displayToast: false, failureResponse: 'throwError' };
    this.getCategoryAndInsSubscription = combineLatest([
      this._instructionSvc.getInstructionsByCategoryId(categoryId, info),
      this._instructionSvc.getSelectedCategory(categoryId, info)
    ])
    .pipe(
      map(([workInstructions, category]) => {
        const { Category_Name } = category;
        this.selectedCategory = Category_Name;
        this.headerTitle = this.selectedCategory;
        return workInstructions.map(workInstruction => ({
          ...workInstruction
        }));
      }
      )
    )
    .subscribe(
      instructions => {
        instructions.forEach(instruction => {
          if (instruction.Published) {
            this.publishedInstructionsList = [...this.publishedInstructionsList, instruction];
          } else {
            this.draftedInstructionsList = [...this.draftedInstructionsList, instruction];
          }
        });
        this.spinner.hide();
      },
      error => {
        this.errorHandlerService.handleError(error);
        this.spinner.hide();
      }
    );
  }

  ngOnInit(): void {
    const cid = this.route.snapshot.paramMap.get('cid');
    this.categoryId = cid;
    this.getInstructionsWithCategoryName(cid);
    this.getAuthors();
  }

  ngOnDestroy(): void {
    if (this.getCategoryAndInsSubscription) {
      this.getCategoryAndInsSubscription.unsubscribe();
    }
  }
  getImageSrc = (source: string) => {
    return source && source.indexOf('assets') > -1 ? source : this.base64HelperService.getBase64ImageData(source);
  }
}
