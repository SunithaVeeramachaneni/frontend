import { ChangeDetectorRef, DebugElement } from '@angular/core';
import {
  async,
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { MatMenuTrigger } from '@angular/material';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';
import { of, throwError } from 'rxjs';
import { AppMaterialModules } from '../../../material.module';
import { SharedModule } from '../../../shared/shared.module';
import { ToastService } from '../../../shared/toast';
import { OverlayService } from '../../modal/overlay.service';
import { CategoryComponent } from '../../modal/templates/category/category.component';
import { DeleteCategoryComponent } from '../../modal/templates/delete-category/delete-category.component';
import { CategoriesComponent } from './categories.component';
import { CategoryService } from './category.service';
import { InstructionService } from './workinstructions/instruction.service';
import { COVER_IMAGES } from '../../modal/constants';
import { MockComponent } from 'ng-mocks';
import { ErrorInfo } from '../../../interfaces/error-info';
import { HttpErrorResponse } from '@angular/common/http';
import { Base64HelperService } from '../../../shared/base64-helper.service';

const categoryDetails = [
  {
    Category_Id: '4d08pHYBr',
    Category_Name: 'Unassigned',
    Cover_Image: COVER_IMAGES[0],
  },
  {
    Category_Id: '177',
    Category_Name: 'Health-Precautions',
    Cover_Image: 'assets/CoverImages/coverimage2.png',
  }
];

const [category1, category2] = categoryDetails;
const categories1 = [` ${category1.Category_Name}`];
const categories2 = [` ${category2.Category_Name}`];
const image = '../assets/img/brand/doc-placeholder.png';

const instructions = [
  {
    Id: '2267',
    WI_Id: 4,
    Categories: JSON.stringify([category1]),
    WI_Name: 'Sample Instruction Publish',
    WI_Desc: null,
    Tools: null,
    Equipements: null,
    Locations: null,
    IsFavorite: true,
    CreatedBy: 'Aldo',
    EditedBy: 'Aldo',
    AssignedObjects: null,
    SpareParts: null,
    SafetyKit: null,
    created_at: '2020-10-29T15:40:32.000Z',
    Published: true,
    IsPublishedTillSave: null,
    Cover_Image: image,
    categories: categories1
  },
  {
    Id: '2267',
    WI_Id: 5,
    Categories: JSON.stringify([category2]),
    WI_Name: 'Sample Instruction Draft',
    WI_Desc: null,
    Tools: null,
    Equipements: null,
    Locations: null,
    IsFavorite: true,
    CreatedBy: 'Aldo',
    EditedBy: 'Aldo',
    AssignedObjects: null,
    SpareParts: null,
    SafetyKit: null,
    created_at: '2020-10-29T15:40:32.000Z',
    Published: false,
    IsPublishedTillSave: null,
    Cover_Image: image,
    categories: categories2
  }
];

const info: ErrorInfo = { displayToast: false, failureResponse: 'throwError' };

describe('CategoriesComponent', () => {
  let component: CategoriesComponent;
  let fixture: ComponentFixture<CategoriesComponent>;
  let spinnerSpy: NgxSpinnerService;
  let overlayServiceSpy: OverlayService;
  let categoryServiceSpy: CategoryService;
  let instructionServiceSpy: InstructionService;
  let toastServiceSpy: ToastService;
  let base64HelperServiceSpy: Base64HelperService;
  let cdrfSpy: ChangeDetectorRef;
  let categoriesDe: DebugElement;
  let categoriesEl: HTMLElement;

  beforeEach(async(() => {
    spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);
    overlayServiceSpy = jasmine.createSpyObj('OverlayService', ['open']);
    categoryServiceSpy = jasmine.createSpyObj('CategoryService', [
      'removeDeleteFiles',
      'getDeleteFiles',
    ]);
    instructionServiceSpy = jasmine.createSpyObj('InstructionService', [
      'deleteAttachments',
      'getAllCategories',
      'getInstructionsByCategoryId',
      'deleteCategory$',
      'addCategory',
      'updateCategory',
      'handleError'
    ]);
    toastServiceSpy = jasmine.createSpyObj('ToastService', ['show']);
    base64HelperServiceSpy = jasmine.createSpyObj('Base64HelperService', ['getBase64ImageData', 'getBase64Image']);
    cdrfSpy = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);
    TestBed.configureTestingModule({
      declarations: [CategoriesComponent, MockComponent(NgxSpinnerComponent)],
      imports: [
        NgxPaginationModule,
        Ng2SearchPipeModule,
        SharedModule,
        AppMaterialModules,
        BrowserAnimationsModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: NgxSpinnerService, useValue: spinnerSpy },
        { provide: OverlayService, useValue: overlayServiceSpy },
        { provide: CategoryService, useValue: categoryServiceSpy },
        { provide: InstructionService, useValue: instructionServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: Base64HelperService, useValue: base64HelperServiceSpy },
        { provide: ChangeDetectorRef, useValue: cdrfSpy },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriesComponent);
    component = fixture.componentInstance;
    categoriesDe = fixture.debugElement;
    categoriesEl = categoriesDe.nativeElement;
    spyOn(component, 'getAllCategories');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should define variables & set defaults', () => {
    expect(component.p).toBeDefined();
    expect(component.p).toBe(1);
    expect(component.count).toBeDefined();
    expect(component.count).toBe(4);
    expect(component.config).toBeDefined();
    expect(component.config).toEqual({
      id: 'categories',
      currentPage: 1,
      itemsPerPage: 6,
      directionLinks: false,
    });
    expect(component.categoriesList).toBeDefined();
    expect(component.categoriesList).toEqual([
      {
        CId: '4d08pHYBr',
        Category_Name: 'Dummy',
        Drafts_Count: 0,
        Published_Count: 0,
        Cover_Image: 'assets/img/brand/category-placeholder.png',
      },
    ]);
    expect(component.wiList).toBeDefined();
    expect(component.wiList).toEqual([]);
    expect(component.CatName).toBeDefined();
    expect(component.CatName).toBe('');
    expect(component.categoryDetail).toBeDefined();
    expect(component.categoryDetail).toEqual({
      CId: '',
      Category_Name: '',
      Drafts_Count: 0,
      Published_Count: 0,
      Cover_Image: '',
    });
    expect(component.wiDetail).toBeDefined();
    expect(component.wiDetail).toEqual({
      Category_Id: '',
      WI_Name: '',
      IsFavorite: false,
      CreatedBy: '',
      EditedBy: '',
      Published: false,
    });
    expect(component.catSubscribeComponent).toBeDefined();
    expect(typeof component.catSubscribeComponent).toBe(
      typeof CategoryComponent
    );
    expect(component.delCatSubscribeComponent).toBeDefined();
    expect(typeof component.delCatSubscribeComponent).toBe(
      typeof DeleteCategoryComponent
    );
    expect(component.categoryDetailObject).toBeDefined();
    expect(component.categoryDetailObject).toBe(null);
    expect(component.workInstructionsDetailObject).toBeDefined();
    expect(component.workInstructionsDetailObject).toBe(null);
    expect(component.imageHeight).toBeDefined();
  });

  describe('template', () => {
    it('should contain Categories & ADD CATEGORY labels', () => {
      expect(
        categoriesEl.querySelector('.categories-header').textContent
      ).toContain('Categories');
      expect(
        categoriesEl.querySelector('.categories-header').textContent
      ).toContain('ADD CATEGORY');
      expect(
        categoriesEl
          .querySelector('div.categories-row-heading>img')
          .getAttribute('src')
      ).toContain('categories.svg');
      expect(
        categoriesEl
          .querySelector('button.categories-button>img')
          .getAttribute('src')
      ).toContain('addcategory.svg');
    });

    it('should render three categories in UI', () => {
      const { Category_Id: CId, ...rest } = categoryDetails[0];
      const { Category_Id: CId1, ...rest1 } = categoryDetails[1];
      const categoriesList = [
        { CId, ...rest, Drafts_Count: 1, Published_Count: 1 },
        { CId: CId1, ...rest1, Drafts_Count: 0, Published_Count: 0 },
      ];
      component.categoriesList = categoriesList;
      fixture.detectChanges();
      expect(
        categoriesEl.querySelectorAll('.categories-details-card').length
      ).toBe(2);
      expect(
        categoriesEl.querySelector('.categories-details-card').textContent
      ).toContain('Drafted');
      expect(
        categoriesEl.querySelector('.categories-details-card').textContent
      ).toContain('Published');
      const menuTigger: MatMenuTrigger = fixture.debugElement
        .query(By.directive(MatMenuTrigger))
        .injector.get(MatMenuTrigger);
      menuTigger.openMenu();
      const editCategoryButton = categoriesDe.query(By.css('#editCategory'))
        .nativeElement as HTMLElement;
      expect(editCategoryButton.textContent).toContain('Edit Category');
      const deleteCategoryButton = categoriesDe.query(By.css('#deleteCategory'))
        .nativeElement as HTMLElement;
      expect(deleteCategoryButton.textContent).toContain('Delete Category');
      const href = fixture.debugElement
        .query(By.css('.categories-details-card>a'))
        .nativeElement.getAttribute('href');
      expect(href).toEqual('/instructions/4d08pHYBr');
      expect(categoriesEl.querySelectorAll('pagination-template').length).toBe(1);
      expect(categoriesEl.querySelectorAll('app-custom-pagination-controls').length).toBe(1);
    });
  });

  describe('getAllCategories', () => {
    it('should define function', () => {
      expect(component.getAllCategories).toBeDefined();
    });

    it('should set categoriesList', () => {
      (component.getAllCategories as jasmine.Spy).and.callThrough();
      const { Category_Id: CId, ...rest } = categoryDetails[0];
      const { Category_Id: CId1, ...rest1 } = categoryDetails[1];
      const categoriesList = [
        { CId, ...rest, Drafts_Count: 1, Published_Count: 1 },
        { CId: CId1, ...rest1, Drafts_Count: 0, Published_Count: 0 },
      ];
      (instructionServiceSpy.getAllCategories as jasmine.Spy)
        .withArgs()
        .and.returnValue(of(categoryDetails))
        .and.callThrough();
      (instructionServiceSpy.getInstructionsByCategoryId as jasmine.Spy)
        .withArgs('4d08pHYBr')
        .and.returnValue(of(instructions))
        .and.callThrough();
      (instructionServiceSpy.getInstructionsByCategoryId as jasmine.Spy)
        .withArgs('177')
        .and.returnValue(of([]))
        .and.callThrough();
      component.getAllCategories();
      expect(instructionServiceSpy.getAllCategories).toHaveBeenCalledWith();
      expect(instructionServiceSpy.getAllCategories).toHaveBeenCalledTimes(1);
      expect(instructionServiceSpy.getInstructionsByCategoryId).toHaveBeenCalledWith(
        '4d08pHYBr'
      );
      expect(instructionServiceSpy.getInstructionsByCategoryId).toHaveBeenCalledWith(
        '177'
      );
      expect(instructionServiceSpy.getInstructionsByCategoryId).toHaveBeenCalledTimes(2);
      expect(component.categoriesList).toEqual(categoriesList);
    });

    it('should call getBase64Image if Cover_Image is not from assets', () => {
      (component.getAllCategories as jasmine.Spy).and.callThrough();
      (instructionServiceSpy.getAllCategories as jasmine.Spy)
        .withArgs()
        .and.returnValue(of([categoryDetails[0], { ...categoryDetails[1], Cover_Image: 'Thumbnail.jpg' }]))
        .and.callThrough();
      (instructionServiceSpy.getInstructionsByCategoryId as jasmine.Spy)
        .withArgs('4d08pHYBr')
        .and.returnValue(of(instructions))
        .and.callThrough();
      (instructionServiceSpy.getInstructionsByCategoryId as jasmine.Spy)
        .withArgs('177')
        .and.returnValue(of([]))
        .and.callThrough();
      component.getAllCategories();
      expect(base64HelperServiceSpy.getBase64ImageData).toHaveBeenCalledWith('Thumbnail.jpg');
      expect(base64HelperServiceSpy.getBase64Image).toHaveBeenCalledWith('Thumbnail.jpg');
    });
  });

  describe('ngOnInit', () => {
    it('should define function', () => {
      expect(component.ngOnInit).toBeDefined();
    });

    it('should call getAllCategories', () => {
      component.ngOnInit();
      expect(component.getAllCategories).toHaveBeenCalledWith();
    });
  });

  describe('ngAfterViewInit', () => {
    it('should define function', () => {
      expect(component.ngAfterViewInit).toBeDefined();
    });

    it('should set dummy category for cover image height and call detectChanges ', () => {
      const categoriesList = {
        CId: '4d08pHYBr',
        Category_Name: 'Dummy',
        Drafts_Count: 0,
        Published_Count: 0,
        Cover_Image: 'assets/img/brand/category-placeholder.png',
      };
      expect(component.categoriesList).toEqual([categoriesList]);
      // expect(cdrfSpy.detectChanges).toHaveBeenCalledWith();
      // expect(component.imageHeight).toBe('74px');
      expect(component.imageHeight).toBeDefined();
    });
  });

  describe('open', () => {
    it('should define function', () => {
      expect(component.open).toBeDefined();
    });

    it('should add new Category', () => {
      const data = {
        cid: null,
        title: 'TestCategory',
        coverImage: 'assets/CoverImages/coverimage2.png',
      };
      const { cid: CId, title: Category_Name, coverImage: Cover_Image } = data;
      let response = { CId, Category_Name, Cover_Image };
      response = { ...response, CId: 110 };
      (overlayServiceSpy.open as jasmine.Spy).and.returnValue({
        afterClosed$: of({ data }),
      });
      (categoryServiceSpy.getDeleteFiles as jasmine.Spy).and.returnValue([]);
      (instructionServiceSpy.addCategory as jasmine.Spy)
        .withArgs({ CId, Category_Name, Cover_Image })
        .and.returnValue(of(response))
        .and.callThrough();
      const addCategryButton = categoriesEl.querySelector('button');
      addCategryButton.click();
      expect(instructionServiceSpy.addCategory).toHaveBeenCalledWith({
        CId,
        Category_Name,
        Cover_Image,
      });
      expect(instructionServiceSpy.addCategory).toHaveBeenCalledTimes(1);
      expect(component.CatName).toBe(Category_Name);
      expect(categoryServiceSpy.removeDeleteFiles).toHaveBeenCalledWith(
        Cover_Image
      );
      expect(component.getAllCategories).toHaveBeenCalledWith();
      expect(toastServiceSpy.show).toHaveBeenCalledWith({
        text: `Category ${Category_Name} has been added successfully`,
        type: 'success'
      });
    });

    it('should handle error while adding new category', () => {
      const data = {
        cid: null,
        title: 'TestCategory',
        coverImage: 'assets/CoverImages/coverimage2.png',
      };
      const { cid: CId, title: Category_Name, coverImage: Cover_Image } = data;
      (overlayServiceSpy.open as jasmine.Spy).and.returnValue({
        afterClosed$: of({ data }),
      });
      (categoryServiceSpy.getDeleteFiles as jasmine.Spy).and.returnValue([]);
      (instructionServiceSpy.addCategory as jasmine.Spy)
        .withArgs({ CId, Category_Name, Cover_Image })
        .and.returnValue(throwError('Unable to create category'))
        .and.callThrough();
      const addCategryButton = categoriesEl.querySelector('button');
      addCategryButton.click();
      expect(instructionServiceSpy.addCategory).toHaveBeenCalledWith({
        CId,
        Category_Name,
        Cover_Image,
      });
      expect(instructionServiceSpy.addCategory).toHaveBeenCalledTimes(1);
    });

    it('should edit existing category', () => {
      const {
        Category_Id: cid,
        Category_Name: title,
        Cover_Image: coverImage,
      } = categoryDetails[1];
      const data = {
        cid,
        coverImage,
        title: `${title} Updated`,
      };
      (overlayServiceSpy.open as jasmine.Spy).and.returnValue({
        afterClosed$: of({ data }),
      });
      (categoryServiceSpy.getDeleteFiles as jasmine.Spy).and.returnValue([]);
      (instructionServiceSpy.updateCategory as jasmine.Spy)
        .withArgs({
          Category_Id: cid,
          Category_Name: data.title,
          Cover_Image: coverImage,
        })
        .and.returnValue(of(data))
        .and.callThrough();
      const { Category_Id: CId, ...rest } = categoryDetails[0];
      const { Category_Id: CId1, ...rest1 } = categoryDetails[1];
      const categoriesList = [
        { CId, ...rest, Drafts_Count: 1, Published_Count: 1 },
        { CId: CId1, ...rest1, Drafts_Count: 0, Published_Count: 0 },
      ];
      component.categoriesList = categoriesList;
      fixture.detectChanges();
      const menuTigger: MatMenuTrigger = fixture.debugElement
        .query(By.directive(MatMenuTrigger))
        .injector.get(MatMenuTrigger);
      menuTigger.openMenu();
      const editCategoryButton = categoriesDe.query(By.css('#editCategory'))
        .nativeElement as HTMLElement;
      editCategoryButton.click();
      expect(instructionServiceSpy.updateCategory).toHaveBeenCalledWith(
        {
          Category_Id: cid,
          Category_Name: data.title,
          Cover_Image: coverImage,
        }
      );
      expect(instructionServiceSpy.updateCategory).toHaveBeenCalledTimes(1);
      expect(categoryServiceSpy.removeDeleteFiles).toHaveBeenCalledWith(
        coverImage
      );
      expect(component.getAllCategories).toHaveBeenCalledWith();
      expect(toastServiceSpy.show).toHaveBeenCalledWith({
        text: `Category ${data.title} has been updated successfully`,
        type: 'success'
      });
    });

    it('should handle error while edit existing category', () => {
      const {
        Category_Id: cid,
        Category_Name: title,
        Cover_Image: coverImage,
      } = categoryDetails[1];
      const data = {
        cid,
        coverImage,
        title: `${title} Updated`,
      };
      (overlayServiceSpy.open as jasmine.Spy).and.returnValue({
        afterClosed$: of({ data }),
      });
      (categoryServiceSpy.getDeleteFiles as jasmine.Spy).and.returnValue([]);
      (instructionServiceSpy.updateCategory as jasmine.Spy)
        .withArgs({
          Category_Id: cid,
          Category_Name: data.title,
          Cover_Image: coverImage,
        })
        .and.returnValue(throwError('Unable to update Category'))
        .and.callThrough();
      const { Category_Id: CId, ...rest } = categoryDetails[0];
      const { Category_Id: CId1, ...rest1 } = categoryDetails[1];
      const categoriesList = [
        { CId, ...rest, Drafts_Count: 1, Published_Count: 1 },
        { CId: CId1, ...rest1, Drafts_Count: 0, Published_Count: 0 },
      ];
      component.categoriesList = categoriesList;
      fixture.detectChanges();
      const menuTigger: MatMenuTrigger = fixture.debugElement
        .query(By.directive(MatMenuTrigger))
        .injector.get(MatMenuTrigger);
      menuTigger.openMenu();
      const editCategoryButton = categoriesDe.query(By.css('#editCategory'))
        .nativeElement as HTMLElement;
      editCategoryButton.click();
      expect(instructionServiceSpy.updateCategory).toHaveBeenCalledWith(
        {
          Category_Id: cid,
          Category_Name: data.title,
          Cover_Image: coverImage,
        }
      );
      expect(instructionServiceSpy.updateCategory).toHaveBeenCalledTimes(1);
      expect(categoryServiceSpy.removeDeleteFiles).toHaveBeenCalledWith(
        coverImage
      );
    });

    it('should delete files from category service & s3 bucket in case of add category modal closed without saving', () => {
      (overlayServiceSpy.open as jasmine.Spy).and.returnValue({
        afterClosed$: of({ data: null }),
      });
      const files = ['coverimage-from-s3.jpg'];
      const s3DeleteResponse = {"Deleted": [{"Key": "coverimage-from-s3.jpg"}], "Errors": []};
      (categoryServiceSpy.getDeleteFiles as jasmine.Spy).and.returnValue(files);
      (instructionServiceSpy.deleteAttachments as jasmine.Spy)
        .withArgs({ files })
        .and.returnValue(of(s3DeleteResponse))
        .and.callThrough();
      const addCategryButton = categoriesEl.querySelector('button');
      addCategryButton.click();
      expect(categoryServiceSpy.removeDeleteFiles).toHaveBeenCalledWith(
        undefined
      );
      expect(categoryServiceSpy.getDeleteFiles).toHaveBeenCalledWith();
      expect(categoryServiceSpy.removeDeleteFiles).toHaveBeenCalledWith(
        files[0]
      );
      expect(categoryServiceSpy.removeDeleteFiles).toHaveBeenCalledTimes(2);
      expect(instructionServiceSpy.deleteAttachments).toHaveBeenCalledWith({
        files,
      });
      expect(instructionServiceSpy.deleteAttachments).toHaveBeenCalledTimes(1);
    });

    it('should handle s3 bucket delete file error in case of add category modal closed without saving', () => {
      (overlayServiceSpy.open as jasmine.Spy).and.returnValue({
        afterClosed$: of({ data: null }),
      });
      const files = ['coverimage-from-s3.jpg'];
      (categoryServiceSpy.getDeleteFiles as jasmine.Spy).and.returnValue(files);
      (instructionServiceSpy.deleteAttachments as jasmine.Spy)
        .withArgs({ files })
        .and.returnValue(throwError('Unable to delete file'))
        .and.callThrough();
      const addCategryButton = categoriesEl.querySelector('button');
      addCategryButton.click();
      expect(categoryServiceSpy.removeDeleteFiles).toHaveBeenCalledWith(
        undefined
      );
      expect(categoryServiceSpy.getDeleteFiles).toHaveBeenCalledWith();
      expect(categoryServiceSpy.removeDeleteFiles).toHaveBeenCalledTimes(1);
      expect(instructionServiceSpy.deleteAttachments).toHaveBeenCalledWith({
        files,
      });
      expect(instructionServiceSpy.deleteAttachments).toHaveBeenCalledTimes(1);
    });

    it('should delete files from category service & s3 bucket in case of edit category modal closed without saving', () => {
      (overlayServiceSpy.open as jasmine.Spy).and.returnValue({
        afterClosed$: of({ data: null }),
      });
      const { Category_Id: CId, ...rest } = categoryDetails[0];
      const { Category_Id: CId1, ...rest1 } = categoryDetails[1];
      const categoriesList = [
        { CId, ...rest, Drafts_Count: 1, Published_Count: 1 },
        { CId: CId1, ...rest1, Drafts_Count: 0, Published_Count: 0 },
      ];
      component.categoriesList = categoriesList;
      fixture.detectChanges();
      const files = ['coverimage-from-s3.jpg'];
      const s3DeleteResponse = {"Deleted": [{"Key": "coverimage-from-s3.jpg"}], "Errors": []};
      (categoryServiceSpy.getDeleteFiles as jasmine.Spy).and.returnValue(files);
      (instructionServiceSpy.deleteAttachments as jasmine.Spy)
        .withArgs({ files })
        .and.returnValue(of(s3DeleteResponse))
        .and.callThrough();
      const menuTigger: MatMenuTrigger = fixture.debugElement
        .query(By.directive(MatMenuTrigger))
        .injector.get(MatMenuTrigger);
      menuTigger.openMenu();
      const editCategoryButton = categoriesDe.query(By.css('#editCategory'))
        .nativeElement as HTMLElement;
      editCategoryButton.click();
      expect(categoryServiceSpy.removeDeleteFiles).toHaveBeenCalledWith(
        categoryDetails[1].Cover_Image
      );
      expect(categoryServiceSpy.getDeleteFiles).toHaveBeenCalledWith();
      expect(categoryServiceSpy.removeDeleteFiles).toHaveBeenCalledWith(
        files[0]
      );
      expect(instructionServiceSpy.deleteAttachments).toHaveBeenCalledWith({
        files,
      });
      expect(instructionServiceSpy.deleteAttachments).toHaveBeenCalledTimes(1);
    });

    it('should not delete category if selectedButton is "no"', () => {
      const {
        Category_Id: CId,
        Category_Name,
        Cover_Image,
      } = categoryDetails[1];
      const data = {
        CId,
        Category_Name,
        Cover_Image,
        Drafts_Count: 0,
        Published_Count: 0,
        selectedButton: 'no',
      };
      (overlayServiceSpy.open as jasmine.Spy).and.returnValue({
        afterClosed$: of({ data }),
        data,
      });
      const { Category_Id: CId0, ...rest } = categoryDetails[0];
      const { Category_Id: CId1, ...rest1 } = categoryDetails[1];
      const categoriesList = [
        { CId: CId0, ...rest, Drafts_Count: 1, Published_Count: 1 },
        { CId: CId1, ...rest1, Drafts_Count: 0, Published_Count: 0 },
      ];
      component.categoriesList = categoriesList;
      fixture.detectChanges();
      const menuTigger: MatMenuTrigger = fixture.debugElement
        .query(By.directive(MatMenuTrigger))
        .injector.get(MatMenuTrigger);
      menuTigger.openMenu();
      const deleteCategoryButton = categoriesDe.query(By.css('#deleteCategory'))
        .nativeElement as HTMLElement;
      deleteCategoryButton.click();
      expect(instructionServiceSpy.deleteCategory$).not.toHaveBeenCalled();
    });

    it(`should delete category if selectedButton is "yes" and
      work instructions belongs to deleted category assigned to Unassigned category`, () => {
      const {
        Category_Id: CId,
        Category_Name,
        Cover_Image,
      } = categoryDetails[1];
      const data = {
        CId,
        Category_Name,
        Cover_Image,
        Drafts_Count: 0,
        Published_Count: 0,
        selectedButton: 'yes',
      };
      (overlayServiceSpy.open as jasmine.Spy).and.returnValue({
        afterClosed$: of({ data }),
        data,
      });
      (instructionServiceSpy.deleteCategory$ as jasmine.Spy)
        .withArgs({
          Category_Name,
          Category_Id: CId,
          Cover_Image,
        }, info)
        .and.returnValue(of({
          Category_Name,
          Category_Id: CId,
          Cover_Image,
        }))
        .and.callThrough();
      const { Category_Id: CId0, ...rest } = categoryDetails[0];
      const { Category_Id: CId1, ...rest1 } = categoryDetails[1];
      const categoriesList = [
        { CId: CId0, ...rest, Drafts_Count: 1, Published_Count: 1 },
        { CId: CId1, ...rest1, Drafts_Count: 0, Published_Count: 0 },
      ];
      component.categoriesList = categoriesList;
      fixture.detectChanges();
      const menuTigger: MatMenuTrigger = fixture.debugElement
        .query(By.directive(MatMenuTrigger))
        .injector.get(MatMenuTrigger);
      menuTigger.openMenu();
      const deleteCategoryButton = categoriesDe.query(By.css('#deleteCategory'))
        .nativeElement as HTMLElement;
      deleteCategoryButton.click();
      expect(spinnerSpy.show).toHaveBeenCalled();
      expect(instructionServiceSpy.deleteCategory$).toHaveBeenCalledWith(
        {
          Category_Name,
          Category_Id: CId,
          Cover_Image,
        },
        info
      );
      expect(instructionServiceSpy.deleteCategory$).toHaveBeenCalledTimes(1);
      expect(spinnerSpy.hide).toHaveBeenCalled();
      expect(component.getAllCategories).toHaveBeenCalled();
      expect(toastServiceSpy.show).toHaveBeenCalledWith({
        text: `Category ${Category_Name} has been deleted successfully`,
        type: 'success'
      });
    });

    it(`should delete cover image while deleting category if cover image from s3`, () => {
      const categoryDetails1 = {
        ...categoryDetails[1],
        Cover_Image: 'coverimage-from-s3.jpg',
      };
      const { Category_Id: CId, Category_Name, Cover_Image } = categoryDetails1;
      const data = {
        CId,
        Category_Name,
        Cover_Image,
        Drafts_Count: 0,
        Published_Count: 0,
        selectedButton: 'yes',
      };
      const s3DeleteResponse = {"Deleted": [{"Key": "coverimage-from-s3.jpg"}], "Errors": []};
      (instructionServiceSpy.deleteAttachments as jasmine.Spy)
        .withArgs({ files: [Cover_Image] })
        .and.returnValue(of(s3DeleteResponse))
        .and.callThrough();
      (overlayServiceSpy.open as jasmine.Spy).and.returnValue({
        afterClosed$: of({ data }),
        data,
      });
      (instructionServiceSpy.deleteCategory$ as jasmine.Spy)
        .withArgs({
          Category_Name,
          Category_Id: CId,
          Cover_Image,
        }, info)
        .and.returnValue(of({
          Category_Name,
          Category_Id: CId,
          Cover_Image,
        }))
        .and.callThrough();
      const { Category_Id: CId0, ...rest } = categoryDetails[0];
      const { Category_Id: CId1, ...rest1 } = categoryDetails1;
      const categoriesList = [
        { CId: CId0, ...rest, Drafts_Count: 1, Published_Count: 1 },
        { CId: CId1, ...rest1, Drafts_Count: 0, Published_Count: 0 },
      ];
      component.categoriesList = categoriesList;
      fixture.detectChanges();
      const menuTigger: MatMenuTrigger = fixture.debugElement
        .query(By.directive(MatMenuTrigger))
        .injector.get(MatMenuTrigger);
      menuTigger.openMenu();
      const deleteCategoryButton = categoriesDe.query(By.css('#deleteCategory'))
        .nativeElement as HTMLElement;
      deleteCategoryButton.click();
      expect(spinnerSpy.show).toHaveBeenCalled();
      expect(instructionServiceSpy.deleteCategory$).toHaveBeenCalledWith(
        {
          Category_Name,
          Category_Id: CId,
          Cover_Image,
        },
        info
      );
      expect(instructionServiceSpy.deleteCategory$).toHaveBeenCalledTimes(1);
      expect(spinnerSpy.hide).toHaveBeenCalled();
      expect(component.getAllCategories).toHaveBeenCalled();
      expect(toastServiceSpy.show).toHaveBeenCalledWith({
        text: `Category ${Category_Name} has been deleted successfully`,
        type: 'success'
      });
    });

    it('should handle error while deleting category', () => {
      const {
        Category_Id: CId,
        Category_Name,
        Cover_Image,
      } = categoryDetails[1];
      const data = {
        CId,
        Category_Name,
        Cover_Image,
        Drafts_Count: 0,
        Published_Count: 0,
        selectedButton: 'yes',
      };
      (overlayServiceSpy.open as jasmine.Spy).and.returnValue({
        afterClosed$: of({ data }),
        data,
      });
      (instructionServiceSpy.deleteCategory$ as jasmine.Spy)
        .withArgs({
          Category_Name,
          Category_Id: CId,
          Cover_Image,
        }, info)
        .and.returnValue(throwError({ message: 'Unable to delete Category' }))
        .and.callThrough();
      const { Category_Id: CId0, ...rest } = categoryDetails[0];
      const { Category_Id: CId1, ...rest1 } = categoryDetails[1];
      const categoriesList = [
        { CId: CId0, ...rest, Drafts_Count: 1, Published_Count: 1 },
        { CId: CId1, ...rest1, Drafts_Count: 0, Published_Count: 0 },
      ];
      component.categoriesList = categoriesList;
      fixture.detectChanges();
      const menuTigger: MatMenuTrigger = fixture.debugElement
        .query(By.directive(MatMenuTrigger))
        .injector.get(MatMenuTrigger);
      menuTigger.openMenu();
      const deleteCategoryButton = categoriesDe.query(By.css('#deleteCategory'))
        .nativeElement as HTMLElement;
      deleteCategoryButton.click();
      expect(spinnerSpy.show).toHaveBeenCalled();
      expect(instructionServiceSpy.deleteCategory$).toHaveBeenCalledWith(
        {
          Category_Name,
          Category_Id: CId,
          Cover_Image,
        },
        info
      );
      expect(instructionServiceSpy.deleteCategory$).toHaveBeenCalledTimes(1);
      expect(toastServiceSpy.show).not.toHaveBeenCalled();
      expect(spinnerSpy.hide).toHaveBeenCalled();
      expect(instructionServiceSpy.handleError).toHaveBeenCalledWith({message: 'Unable to delete Category'} as HttpErrorResponse);
    });
  });

  describe('getImageSrc', () => {
    it('should define function', () => {
      expect(component.getImageSrc).toBeDefined();
    });

    it('should return given source if source is from assets', () => {
      const src = 'assets/image.jpg';
      expect(component.getImageSrc(src)).toBe(src);
    });

    it('should call getBase64ImageData if source is not from assets', () => {
      const src = 'image.jpg';
      component.getImageSrc(src);
      expect(base64HelperServiceSpy.getBase64ImageData).toHaveBeenCalledWith(src);
    });
  });

  describe('getS3CoverImageStyles', () => {
    it('should define function', () => {
      expect(component.getS3CoverImageStyles).toBeDefined();
    });

    it('should return s3 cover image style if not from assets', () => {
      component.imageHeight = '100px';
      const result = component.getS3CoverImageStyles('coverimage.jpg');
      expect(result).toEqual({
        'object-fit': 'cover',
        'border-radius': '3px',
        height: '100px',
      });
    });

    it('should return s3 cover image style if not from assets & image height is not set', () => {
      component.imageHeight = '';
      const result = component.getS3CoverImageStyles('coverimage.jpg');
      expect(result).toEqual({
        'object-fit': 'cover',
        'border-radius': '3px',
        height: '100%',
      });
    });

    it('should return empty styles if cover image is from assets', () => {
      const result = component.getS3CoverImageStyles('assets/coverimage.jpg');
      expect(result).toEqual({});
    });
  });
});
