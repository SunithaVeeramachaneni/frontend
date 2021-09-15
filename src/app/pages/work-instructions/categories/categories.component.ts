import {AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {OverlayService} from '../modal/overlay.service';
import {ComponentType} from '@angular/cdk/portal';
import {CategoryComponent} from '../modal/templates/category/category.component';
import {DeleteCategoryComponent} from '../modal/templates/delete-category/delete-category.component' ;
import { NgxSpinnerService } from 'ngx-spinner';
import { CategoryService } from '../services/category.service';
import { InstructionService } from '../services/instruction.service';
import {ToastService} from '../../../shared/toast';
import { ErrorInfo } from '../../../interfaces';
import { Base64HelperService } from '../services/base64-helper.service';
import { WiCommonService } from '../services/wi-common.services';
import { ErrorHandlerService } from '../../../shared/error-handler/error-handler.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-categories',
  templateUrl: 'categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {
  p = 1;
  count = 4;
  config: any = {
    id: 'categories',
    currentPage: 1,
    itemsPerPage: 6,
    directionLinks: false
  };
  @Input() recents;
  @Input() favorites;
  private _searchCriteria: string;
  @Input() set searchCriteria(value: string) {
    this._searchCriteria = value;
  }
  get searchCriteria(): string {
    return this._searchCriteria;
  }
  public categoriesList = [];
  public wiList = [];
  public CatName = '';
  public categoryDetail = {
    CId: '',
    Category_Name: '',
    Drafts_Count: 0,
    Published_Count: 0,
    Cover_Image: '',
    Created_At: ''
  };
  public wiDetail = {
    Category_Id: '',
    WI_Name: '',
    IsFavorite: false,
    CreatedBy: '',
    EditedBy: '',
    Published: false
  };
  public catSubscribeComponent = CategoryComponent;
  public delCatSubscribeComponent = DeleteCategoryComponent;
  public categoryDetailObject = null;
  public workInstructionsDetailObject = null;
  public imageHeight = '';
  private image: ElementRef;
  @ViewChild('image', { static: false }) set content(content: ElementRef) {
    this.image = content;
    if (this.image) {
      this.imageHeight = `${this.image.nativeElement.offsetHeight}px`;
    }
  }
  @HostListener('window:resize')
  onResize() {
    if (this.image) {
      this.imageHeight = `${this.image.nativeElement.offsetHeight}px`;
    }
  }
  private updateCategoriesComponentActionSub: Subscription;

  constructor(private spinner: NgxSpinnerService,
              private overlayService: OverlayService,
              private categoryService: CategoryService,
              private _instructionSvc: InstructionService,
              private _toastService: ToastService,
              private cdrf: ChangeDetectorRef,
              private base64HelperService: Base64HelperService,
              private wiCommonService: WiCommonService,
              private errorHandlerService: ErrorHandlerService) {}

  getAllCategories() {
    this._instructionSvc.getAllCategories().subscribe(categories => {
      for (let catCnt = 0; catCnt <= categories.length; catCnt++) {
        this.categoryDetail = {
          CId: '',
          Category_Name: '',
          Drafts_Count: 0,
          Published_Count: 0,
          Cover_Image: '',
          Created_At: ''
        };
        if (categories[catCnt]) {
          const { Cover_Image: coverImage } = categories[catCnt];
          if (coverImage.indexOf('assets') === -1 && !this.base64HelperService.getBase64ImageData(coverImage)) {
            this.base64HelperService.getBase64Image(coverImage);
          }
          this.categoryDetail.Category_Name = categories[catCnt].Category_Name;
          this.categoryDetail.CId = categories[catCnt].Category_Id;
          this.categoryDetail.Cover_Image = categories[catCnt].Cover_Image;
          this.categoryDetail.Created_At = categories[catCnt].Category_Id === '_UnassignedCategory_'
            ? new Date('2050-01-01').toISOString() : categories[catCnt].Created_At;
          this.categoriesList.push(this.categoryDetail);
        }
      }

      const index =
        this.categoriesList.findIndex(category => category.CId === '_UnassignedCategory_' && category.Category_Name === 'Dummy');
      if (index !== -1) {
        this.categoriesList.splice(index, 1);
      }
      if (this.categoriesList && this.categoriesList.length > 0) {
        for (let catObj = 0; catObj <= this.categoriesList.length; catObj++) {
          if (this.categoriesList[catObj]) {
            this._instructionSvc.getInstructionsByCategoryId(this.categoriesList[catObj].CId).subscribe((wi_resp) => {
              wi_resp.forEach(wi => {
                if (wi.Published) {
                  this.categoriesList[catObj].Published_Count += 1;
                } else {
                  this.categoriesList[catObj].Drafts_Count += 1;
                }
              });
            });
          }
        }
      }
    });
  }

  ngOnInit(): void {
    this.updateCategoriesComponentActionSub = this.wiCommonService.updateCategoriesComponentAction$.subscribe(
      update => {
        if (update) {
          this.categoriesList = [];
          this.getAllCategories();
        }
      }
    )
  }

  ngAfterViewInit(): void {
    this.categoriesList = [...this.categoriesList, {
      CId: '_UnassignedCategory_',
      Category_Name: 'Dummy',
      Drafts_Count: 0,
      Published_Count: 0,
      Cover_Image: 'assets/work-instructions-icons/img/brand/category-placeholder.png',
      Created_At: new Date('2050-01-01').toISOString()
    }];
    this.cdrf.detectChanges();
  }

  ngAfterViewChecked(): void {
    if (this.image) {
      this.imageHeight = `${this.image.nativeElement.offsetHeight}px`;
    }
  }

  open(content: TemplateRef<any> | ComponentType<any> | string, obj) {
    const ref = this.overlayService.open(content, obj);
    ref.afterClosed$.subscribe(res => {
      if (content === this.catSubscribeComponent) {
        this.categoryDetailObject = res.data;
        if (this.categoryDetailObject) {
          const { cid: CId, title: Category_Name, coverImage: Cover_Image } = this.categoryDetailObject || {};
          this.categoryService.removeDeleteFiles(Cover_Image);
          if (CId) {
            this._instructionSvc.updateCategory({ Category_Id: CId, Category_Name, Cover_Image }).subscribe(
              response => {
                this.categoriesList = [];
                this.getAllCategories();
                if (Object.keys(response).length) {
                  this._toastService.show({
                    text: 'Category ' + Category_Name + ' has been updated successfully',
                    type: 'success',
                  });
                }
             },
              error => {
                console.log(error);
              });
          } else {
            this._instructionSvc.addCategory({CId, Category_Name, Cover_Image}).subscribe(
              response => {
                this.CatName = Category_Name;
                this.categoriesList = [];
                this.getAllCategories();
                if (Object.keys(response).length) {
                  this._toastService.show({
                    text: 'Category ' + Category_Name + ' has been added successfully',
                    type: 'success',
                  });
                }
              },
              error => {
                console.log(error);
              });
          }
        } else {
          this.categoryService.removeDeleteFiles(obj.Cover_Image);
        }

        const files = this.categoryService.getDeleteFiles();
        if (files.length) {
          this._instructionSvc.deleteFiles({ files }).subscribe(
            resp => {
              if (Object.keys(resp).length) {
                const { Deleted: deletedFiles } = resp;
                deletedFiles.forEach(file => {
                  this.categoryService.removeDeleteFiles(file.Key);
                });
              }
            },
            error => console.log(error)
          );
        }
      } else if (content === this.delCatSubscribeComponent) {
        this.categoryDetailObject = ref.data;
        if (this.categoryDetailObject.selectedButton !== 'yes') {
          return;
        }
        const category = {
          Category_Name: this.categoryDetailObject.Category_Name,
          Category_Id: this.categoryDetailObject.CId,
          Cover_Image: this.categoryDetailObject.Cover_Image
        };

        this.spinner.show();
        const info: ErrorInfo = { displayToast: false, failureResponse: 'throwError' };
        this._instructionSvc.deleteCategory$(category, info)
          .subscribe(
            data => {
              this.spinner.hide();
              if (category.Cover_Image && category.Cover_Image.indexOf('assets') < 0) {
                const files = [`${category.Cover_Image}`];
                this._instructionSvc.deleteFiles({ files }).subscribe({
                  error: error => console.log(error)
                });
              }
              this.categoriesList = [];
              this.getAllCategories();
              this._toastService.show({
                text:  'Category ' + category.Category_Name + ' has been deleted successfully',
                type: 'success',
              });
            },
            error => {
              this.errorHandlerService.handleError(error);
              this.spinner.hide();
            }
          );
      }
    });
  }

  getImageSrc = (source: string) => {
    return source && source.indexOf('assets') > -1 ? source : this.base64HelperService.getBase64ImageData(source);
  }

  getS3CoverImageStyles = (source: string) => {
    if (source && source.indexOf('assets') > -1) {
      return {};
    } else {
      return {'object-fit': 'cover', 'border-radius': '3px', height: this.imageHeight ? this.imageHeight : '100%'};
    }
  }

  ngOnDestroy(): void {
    if (this.updateCategoriesComponentActionSub) {
      this.updateCategoriesComponentActionSub.unsubscribe();
    }    
  }
}
