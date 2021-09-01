import { DebugElement } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { OrderModule } from 'ngx-order-pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSpinnerService } from 'ngx-spinner';
import { of, throwError } from 'rxjs';
import { AppMaterialModules } from '../../../material.module';
import Swal from 'sweetalert2';
import { TimeAgoPipe } from '../../../shared/pipes/time-ago.pipe';
import { SharedModule } from '../../../shared/shared.module';
import { InstructionService } from '../services/instruction.service';
import { CategoryWiseInstructionsComponent } from './category-wise-instructions.component';
import { ToastService } from '../../../shared/toast';
import { DropDownFilterPipe } from '../../../shared/pipes/dropdown-filter.pipe';
import { ErrorInfo } from '../../../interfaces';
import { HttpErrorResponse } from '@angular/common/http';
import { Base64HelperService } from '../services/base64-helper.service';
import { IonicModule } from '@ionic/angular';
import { ErrorHandlerService } from '../../../shared/error-handler/error-handler.service';

const categoryDetails = [
  {
    Category_Id: '_UnassignedCategory_',
    Category_Name: 'Unassigned',
    Cover_Image: 'assets/work-instructions-icons/svg/Categories/default-category.png',
  },
  {
    Category_Id: 177,
    Category_Name: 'Health-Precautions',
    Cover_Image: 'assets/work-instructions-icons/CoverImages/coverimage2.png',
  },
  {
    Category_Id: 178,
    Category_Name: 'Sample Category',
    Cover_Image: 'assets/work-instructions-icons/CoverImages/coverimage3.png',
  }
];

const [category1, category2, category3] = categoryDetails;
const categories1 = [` ${category1.Category_Name}`, ` ${category2.Category_Name}`];
const categories2 = [` ${category1.Category_Name}`, ` ${category3.Category_Name}`];
const image = 'assets/work-instructions-icons/img/brand/doc-placeholder.png';

const instructions = [
  {
    Id: '2057',
    WI_Id: 6,
    Categories: JSON.stringify([category1, category2]),
    WI_Name: 'Commercial Gas Meter Installation',
    WI_Desc: null,
    Tools: null,
    Equipements: null,
    Locations: null,
    IsFavorite: true,
    CreatedBy: 'Tester Two',
    EditedBy: 'Tester Two',
    AssignedObjects: null,
    SpareParts: null,
    SafetyKit: null,
    created_at: '2020-10-29T10:31:51.000Z',
    updated_at: '2020-10-29T10:31:51.000Z',
    Published: true,
    IsPublishedTillSave: true,
    Cover_Image: image,
    categories: categories1
  },
  {
    Id: '2639',
    WI_Id: 9,
    Categories: JSON.stringify([category1, category3]),
    WI_Name: 'TestIns',
    WI_Desc: null,
    Tools: null,
    Equipements: null,
    Locations: null,
    IsFavorite: false,
    CreatedBy: 'Tester Two',
    EditedBy: 'Tester Two',
    AssignedObjects: null,
    SpareParts: null,
    SafetyKit: null,
    created_at: '2020-11-09T12:27:38.000Z',
    updated_at: '2020-11-09T12:27:38.000Z',
    Published: false,
    IsPublishedTillSave: null,
    Cover_Image: image,
    categories: categories2
  },
];
const categoryId = '_UnassignedCategory_';
const users = [
  {
    id: 1,
    first_name: 'Tester',
    last_name: 'One',
    email: 'tester.one@innovapptive.com',
    password: '5000353tes',
    role: 'admin',
    empId: '5000353',
  },
  {
    id: 2,
    first_name: 'Tester',
    last_name: 'Two',
    email: 'tester.two@innovapptive.com',
    password: '5000392tes',
    role: 'user',
    empId: '5000392',
  },
];

const info: ErrorInfo = { displayToast: false, failureResponse: 'throwError' };

describe('CategoryWiseInstructionsComponent', () => {
  let component: CategoryWiseInstructionsComponent;
  let fixture: ComponentFixture<CategoryWiseInstructionsComponent>;
  let spinnerSpy: NgxSpinnerService;
  let instructionServiceSpy: InstructionService;
  let errorHandlerServiceSpy: ErrorHandlerService;
  let toastServiceSpy: ToastService;
  let base64HelperServiceSpy: Base64HelperService;
  let wiComponentDe: DebugElement;
  let wiComponentEl: HTMLElement;

  beforeEach(waitForAsync(() => {
    spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);
    instructionServiceSpy = jasmine.createSpyObj('InstructionService', [
      'getInstructionsByCategoryId',
      'getSelectedCategory',
      'setFavoriteInstructions',
      'getUsers',
      'deleteWorkInstruction$',
    ]);
    errorHandlerServiceSpy = jasmine.createSpyObj('ErrorHandlerService', [
      'handleError'
    ]);
    toastServiceSpy = jasmine.createSpyObj('ToastService', ['show']);
    base64HelperServiceSpy = jasmine.createSpyObj('Base64HelperService', ['getBase64ImageData', 'getBase64Image']);

    TestBed.configureTestingModule({
      declarations: [
        CategoryWiseInstructionsComponent,
        TimeAgoPipe,
        DropDownFilterPipe
      ],
      imports: [
        AppMaterialModules,
        BrowserAnimationsModule,
        FormsModule,
        NgxPaginationModule,
        SharedModule,
        Ng2SearchPipeModule,
        OrderModule,
        RouterTestingModule,
        IonicModule
      ],
      providers: [
        { provide: NgxSpinnerService, useValue: spinnerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: convertToParamMap({ cid: categoryId }) },
          },
        },
        { provide: InstructionService, useValue: instructionServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: Base64HelperService, useValue: base64HelperServiceSpy },
        { provide: ErrorHandlerService, useValue: errorHandlerServiceSpy },
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryWiseInstructionsComponent);
    component = fixture.componentInstance;
    wiComponentDe = fixture.debugElement;
    wiComponentEl = wiComponentDe.nativeElement;
    (instructionServiceSpy.getInstructionsByCategoryId as jasmine.Spy)
      .withArgs(categoryId, info)
      .and.returnValue(of(instructions))
      .and.callThrough();
    (instructionServiceSpy.getSelectedCategory as jasmine.Spy)
      .withArgs(categoryId, info)
      .and.returnValue(of(category1))
      .and.callThrough();
    (instructionServiceSpy.getUsers as jasmine.Spy)
      .withArgs()
      .and.returnValue(of(users))
      .and.callThrough();
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should define variables & set defaults', () => {
    expect(component.wiDetailObject).toBeDefined();
    expect(component.wiDetailObject).toBeNull();
    expect(component.selectedCategory).toBeDefined();
    expect(component.draftsConfig).toBeDefined();
    expect(component.draftsConfig).toEqual({
      id: 'drafts',
      currentPage: 1,
      itemsPerPage: 5,
      directionLinks: false,
    });
    expect(component.publishedConfig).toBeDefined();
    expect(component.publishedConfig).toEqual({
      id: 'published',
      currentPage: 1,
      itemsPerPage: 5,
      directionLinks: false,
    });
    expect(component.draftedInstructionsList).toBeDefined();
    expect(component.publishedInstructionsList).toBeDefined();
    expect(component.search).toBeUndefined();
    expect(component.order).toBeDefined();
    expect(component.order).toBe('updated_at');
    expect(component.reverse).toBeDefined();
    expect(component.reverse).toBeTrue();
    expect(component.reverseObj).toBeDefined();
    expect(component.reverseObj).toEqual({ updated_at: true });
    expect(component.sortedCollection).toBeUndefined();
  });

  describe('template', () => {
    describe('drafts', () => {
      it('should contain labels related to category wise drafted work instrutions listing', (done) => {
        const [, drafted] = instructions;
        expect(wiComponentEl.querySelector('ion-content img').getAttribute('src')).toContain(
          'search.svg'
        );
        expect(
          wiComponentEl
            .querySelector('#prependedInput')
            .getAttribute('placeholder')
        ).toContain('Search by title or author');
        const tabs = wiComponentEl.querySelectorAll('.mat-tab-label');
        expect(tabs.length).toBe(2);
        expect((tabs[0] as HTMLElement).textContent).toContain('DRAFTS');
        expect((tabs[1] as HTMLElement).textContent).toContain('PUBLISHED');
        (tabs[0] as HTMLElement).click();
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          const tableHeader = wiComponentEl.querySelectorAll('table thead tr th');
          expect(tableHeader[0].textContent).toContain('Title');
          expect(tableHeader[1].textContent).toContain('Last Edited');
          expect(tableHeader[2].textContent).toContain('Author');
          expect(wiComponentEl.querySelectorAll('table thead tr').length).toBe(1);
          expect(wiComponentEl.querySelectorAll('table thead tr th').length).toBe(
            4
          );

          const tableBodyTh = wiComponentEl.querySelectorAll('table tbody tr th');
          const tableBodyTd = wiComponentEl.querySelectorAll('table tbody tr td');
          expect(tableBodyTh[0].textContent).toBe(drafted.WI_Name);
          expect(tableBodyTd[0].textContent).toContain('Edited');
          expect(tableBodyTd[0].textContent).toContain(drafted.EditedBy);
          expect(tableBodyTd[1].textContent).toContain(drafted.CreatedBy);
          expect(wiComponentEl.querySelectorAll('table tbody tr').length).toBe(2);
          expect(tableBodyTh.length).toBe(
            1
          );
          expect(wiComponentEl.querySelectorAll('table tbody tr td').length).toBe(
            3
          );

          const anchors = wiComponentEl.querySelectorAll('table tbody tr a');
          expect(anchors.length).toBe(4);
          expect((anchors[0] as HTMLElement).getAttribute('href')).toBe(
            `/work-instructions/category/${categoryId}/${drafted.Id}`
          );
          expect((anchors[1] as HTMLElement).getAttribute('href')).toBe(
            `/work-instructions/category/${categoryId}/${drafted.Id}`
          );

          expect((anchors[2] as HTMLElement).getAttribute('href')).toBe(
            `/work-instructions/category/${categoryId}/${drafted.Id}`
          );

          const menuTigger: MatMenuTrigger = fixture.debugElement
            .query(By.directive(MatMenuTrigger))
            .injector.get(MatMenuTrigger);
          menuTigger.openMenu();
          const editWIButton = wiComponentDe.query(
            By.css('#editWorkInstruction')
          ).nativeElement as HTMLElement;
          expect(editWIButton.textContent).toContain(
            'Edit Work Instruction'
          );
          const deleteWIButton = wiComponentDe.query(
            By.css('#deleteWorkInstruction')
          ).nativeElement as HTMLElement;
          expect(deleteWIButton.textContent).toContain(
            'Delete Work Instruction'
          );
          expect(
            (wiComponentDe.query(By.css('#editWorkInstruction'))
              .nativeElement as HTMLElement).getAttribute(
              'ng-reflect-router-link'
            )
          ).toBe(`/work-instructions/category,${categoryId},${drafted.Id}`);
          expect(wiComponentEl.querySelectorAll('input').length).toBe(1);
          expect(wiComponentEl.querySelectorAll('pagination-template').length).toBe(1);
          expect(wiComponentEl.querySelectorAll('app-custom-pagination-controls').length).toBe(1);
          expect(wiComponentEl.querySelectorAll('app-header').length).toBe(1);
          expect(wiComponentEl.querySelectorAll('app-dummy').length).toBe(1);
          done();
        });
      });

      it('should display No Results Found if search item not present in work instructions', () => {
        const searchInput = wiComponentEl.querySelector('input');
        searchInput.value = 'testing';
        searchInput.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        const tableHeader = wiComponentEl.querySelectorAll('table thead tr th');
        expect(tableHeader[0].textContent).toContain('Title');
        expect(tableHeader[1].textContent).toContain('Last Edited');
        expect(tableHeader[2].textContent).toContain('Author');
        expect(wiComponentEl.querySelectorAll('table thead tr').length).toBe(1);
        expect(tableHeader.length).toBe(4);

        const tableBodyTh = wiComponentEl.querySelectorAll('table tbody tr th');
        const tableBodyTd = wiComponentEl.querySelectorAll('table tbody tr td');
        expect(wiComponentEl.querySelectorAll('table tbody tr').length).toBe(1);
        expect(wiComponentEl.querySelector('table tbody tr').textContent).toContain(
          'No Result Found!'
        );
        expect(tableBodyTh.length).toBe(0);
        expect(tableBodyTd.length).toBe(0);
      });

      it('should display No Drafted Work Instructions in Category if componet doesnt have data', (done) => {
        (instructionServiceSpy.getInstructionsByCategoryId as jasmine.Spy)
          .withArgs(categoryId, info)
          .and.returnValue(of([]))
          .and.callThrough();
        component.ngOnInit();
        fixture.detectChanges();
        const tabs = wiComponentEl.querySelectorAll('.mat-tab-label');
        (tabs[0] as HTMLElement).click();
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          const tableHeader = wiComponentEl.querySelectorAll('table thead tr th');
          expect(tableHeader[0].textContent).toContain('Title');
          expect(tableHeader[1].textContent).toContain('Last Edited');
          expect(tableHeader[2].textContent).toContain('Author');
          expect(wiComponentEl.querySelectorAll('table thead tr').length).toBe(1);
          expect(tableHeader.length).toBe(4);

          const tableBodyTh = wiComponentEl.querySelectorAll('table tbody tr th');
          const tableBodyTd = wiComponentEl.querySelectorAll('table tbody tr td');
          expect(wiComponentEl.querySelectorAll('table tbody tr').length).toBe(1);
          expect(wiComponentEl.querySelector('.no-records').textContent).toContain(
            `No Drafted Work Instructions in Category "${category1.Category_Name}"`
          );
          expect(tableBodyTh.length).toBe(0);
          expect(tableBodyTd.length).toBe(0);
          done();
        });
      });

      it('should filter only selected author work instructions', () => {
        const authorSelect = wiComponentEl.querySelector('select');
        authorSelect.selectedIndex = 2;
        authorSelect.dispatchEvent(new Event('change'));
        fixture.detectChanges();

        const tableHeader = wiComponentEl.querySelectorAll('table thead tr th');
        expect(tableHeader[0].textContent).toContain('Title');
        expect(tableHeader[1].textContent).toContain('Last Edited');
        expect(tableHeader[2].textContent).toContain('Author');
        expect(wiComponentEl.querySelectorAll('table thead tr').length).toBe(1);
        expect(tableHeader.length).toBe(4);

        const [, drafted] = instructions;
        const tableBodyTh = wiComponentEl.querySelectorAll('table tbody tr th');
        const tableBodyTd = wiComponentEl.querySelectorAll('table tbody tr td');
        expect(tableBodyTh[0].textContent).toBe(drafted.WI_Name);
        expect(tableBodyTd[0].textContent).toContain('Edited');
        expect(tableBodyTd[0].textContent).toContain(drafted.EditedBy);
        expect(tableBodyTd[1].textContent).toContain(drafted.CreatedBy);
        expect(wiComponentEl.querySelectorAll('table tbody tr').length).toBe(2);
        expect(tableBodyTh.length).toBe(1);
        expect(tableBodyTd.length).toBe(3);
      });

      it('should call getBase64Image if Cover_Image is not from assets', (done) => {
        const [published, drafted] = instructions;
        const draftedCopy = {...drafted};
        draftedCopy.Cover_Image = 'Thumbnail.jpg';
        (instructionServiceSpy.getInstructionsByCategoryId as jasmine.Spy)
          .withArgs(categoryId, info)
          .and.returnValue(of([draftedCopy, published]))
          .and.callThrough();
        component.ngOnInit();
        fixture.detectChanges();
        const tabs = wiComponentEl.querySelectorAll('.mat-tab-label');
        (tabs[0] as HTMLElement).click();
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          expect(base64HelperServiceSpy.getBase64ImageData).toHaveBeenCalledWith('Thumbnail.jpg');
          expect(base64HelperServiceSpy.getBase64Image).toHaveBeenCalledWith('Thumbnail.jpg');
          done();
        });
      });
    });

    describe('published', () => {
      it('should contain labels related to category wise published work instrutions listing', (done) => {
        const [published] = instructions;
        expect(wiComponentEl.querySelector('ion-content img').getAttribute('src')).toContain(
          'search.svg'
        );
        expect(
          wiComponentEl
            .querySelector('#prependedInput')
            .getAttribute('placeholder')
        ).toContain('Search by title or author');
        const tabs = wiComponentEl.querySelectorAll('.mat-tab-label');
        expect(tabs.length).toBe(2);
        expect((tabs[0] as HTMLElement).textContent).toContain('DRAFTS');
        expect((tabs[1] as HTMLElement).textContent).toContain('PUBLISHED');
        (tabs[1] as HTMLElement).click();
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          fixture.detectChanges();
          const tableHeader = wiComponentEl.querySelectorAll('table thead tr th');
          expect(tableHeader[0].textContent).toContain('Title');
          expect(tableHeader[1].textContent).toContain('Last Edited');
          expect(tableHeader[2].textContent).toContain('Author');
          expect(wiComponentEl.querySelectorAll('table thead tr').length).toBe(1);
          expect(tableHeader.length).toBe(
            4
          );

          const tableBodyTh = wiComponentEl.querySelectorAll('table tbody tr th');
          const tableBodyTd = wiComponentEl.querySelectorAll('table tbody tr td');
          expect(tableBodyTh[0].textContent).toBe(published.WI_Name);
          expect(tableBodyTd[0].textContent).toContain('Edited');
          expect(tableBodyTd[0].textContent).toContain(published.EditedBy);
          expect(tableBodyTd[1].textContent).toContain(published.CreatedBy);
          expect(wiComponentEl.querySelectorAll('table tbody tr').length).toBe(2);
          expect(tableBodyTh.length).toBe(1);
          expect(wiComponentEl.querySelectorAll('table tbody tr td').length).toBe(
            3
          );

          const anchors = wiComponentEl.querySelectorAll('table tbody tr a');
          expect(anchors.length).toBe(4);
          expect((anchors[0] as HTMLElement).getAttribute('href')).toBe(
            `/work-instructions/category/${categoryId}/${published.Id}`
          );
          expect((anchors[1] as HTMLElement).getAttribute('href')).toBe(
            `/work-instructions/category/${categoryId}/${published.Id}`
          );

          expect((anchors[2] as HTMLElement).getAttribute('href')).toBe(
            `/work-instructions/category/${categoryId}/${published.Id}`
          );

          const menuTigger: MatMenuTrigger = fixture.debugElement
            .query(By.directive(MatMenuTrigger))
            .injector.get(MatMenuTrigger);
          menuTigger.openMenu();
          const editWIButton = wiComponentDe.query(
            By.css('#editWorkInstruction')
          ).nativeElement as HTMLElement;
          expect(editWIButton.textContent).toContain(
            'Edit Work Instruction'
          );
          const deleteWIButton = wiComponentDe.query(
            By.css('#deleteWorkInstruction')
          ).nativeElement as HTMLElement;
          expect(deleteWIButton.textContent).toContain(
            'Delete Work Instruction'
          );
          expect(
            (wiComponentDe.query(By.css('#editWorkInstruction'))
              .nativeElement as HTMLElement).getAttribute(
              'ng-reflect-router-link'
            )
          // ).toBe(`/work-instructions/category, ${categoryId}, ${published.Id}`);
          ).toContain(`/work-instructions/category`);
          expect(wiComponentEl.querySelectorAll('input').length).toBe(1);
          expect(wiComponentEl.querySelectorAll('pagination-template').length).toBe(1);
          expect(wiComponentEl.querySelectorAll('app-custom-pagination-controls').length).toBe(1);
          expect(wiComponentEl.querySelectorAll('app-header').length).toBe(1);
          expect(wiComponentEl.querySelectorAll('app-dummy').length).toBe(1);
          done();
        });
      });

      it('should display No Results Found if search item not present in work instructions', () => {
        const searchInput = wiComponentEl.querySelector('input');
        searchInput.value = 'testing';
        searchInput.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        const tableHeader = wiComponentEl.querySelectorAll('table thead tr th');
        expect(tableHeader[0].textContent).toContain('Title');
        expect(tableHeader[1].textContent).toContain('Last Edited');
        expect(tableHeader[2].textContent).toContain('Author');
        expect(wiComponentEl.querySelectorAll('table thead tr').length).toBe(1);
        expect(tableHeader.length).toBe(4);

        const tableBodyTh = wiComponentEl.querySelectorAll('table tbody tr th');
        const tableBodyTd = wiComponentEl.querySelectorAll('table tbody tr td');
        expect(wiComponentEl.querySelectorAll('table tbody tr').length).toBe(1);
        expect(wiComponentEl.querySelector('table tbody tr').textContent).toContain(
          'No Result Found!'
        );
        expect(tableBodyTh.length).toBe(0);
        expect(tableBodyTd.length).toBe(0);
      });

      it('should display No Published Work Instructions in Category if componet doesnt have data', (done) => {
        (instructionServiceSpy.getInstructionsByCategoryId as jasmine.Spy)
          .withArgs(categoryId, info)
          .and.returnValue(of([]))
          .and.callThrough();
        component.ngOnInit();
        fixture.detectChanges();
        const tabs = wiComponentEl.querySelectorAll('.mat-tab-label');
        (tabs[1] as HTMLElement).click();
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          fixture.detectChanges();
          const tableHeader = wiComponentEl.querySelectorAll('table thead tr th');
          expect(tableHeader[0].textContent).toContain('Title');
          expect(tableHeader[1].textContent).toContain('Last Edited');
          expect(tableHeader[2].textContent).toContain('Author');
          expect(wiComponentEl.querySelectorAll('table thead tr').length).toBe(1);
          expect(tableHeader.length).toBe(4);

          const tableBodyTh = wiComponentEl.querySelectorAll('table tbody tr th');
          const tableBodyTd = wiComponentEl.querySelectorAll('table tbody tr td');
          expect(wiComponentEl.querySelectorAll('table tbody tr').length).toBe(1);
          expect(wiComponentEl.querySelector('.no-records').textContent).toContain(
            `No Published Work Instructions in Category "${category1.Category_Name}"`
          );
          expect(tableBodyTh.length).toBe(0);
          expect(tableBodyTd.length).toBe(0);
          done();
        });
      });

      it('should display No Results Found if filtered author not available in work instructions', (done) => {
        const tabs = wiComponentEl.querySelectorAll('.mat-tab-label');
        (tabs[1] as HTMLElement).click();
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          fixture.detectChanges();
          const authorSelect = wiComponentEl.querySelector('select');
          authorSelect.selectedIndex = 1;
          authorSelect.dispatchEvent(new Event('change'));
          fixture.detectChanges();

          const tableHeader = wiComponentEl.querySelectorAll('table thead tr th');
          expect(tableHeader[0].textContent).toContain('Title');
          expect(tableHeader[1].textContent).toContain('Last Edited');
          expect(tableHeader[2].textContent).toContain('Author');
          expect(wiComponentEl.querySelectorAll('table thead tr').length).toBe(1);
          expect(tableHeader.length).toBe(4);

          const tableBodyTh = wiComponentEl.querySelectorAll('table tbody tr th');
          const tableBodyTd = wiComponentEl.querySelectorAll('table tbody tr td');
          expect(wiComponentEl.querySelectorAll('table tbody tr').length).toBe(1);
          expect(wiComponentEl.querySelector('table tbody tr').textContent).toContain(
            'No Result Found!'
          );
          expect(tableBodyTh.length).toBe(0);
          expect(tableBodyTd.length).toBe(0);
          done();
        });

      });

      it('should call getBase64Image if Cover_Image is not from assets', (done) => {
        const [published, drafted] = instructions;
        const publishedCopy = {...published};
        publishedCopy.Cover_Image = 'Thumbnail.jpg';
        (instructionServiceSpy.getInstructionsByCategoryId as jasmine.Spy)
          .withArgs(categoryId, info)
          .and.returnValue(of([drafted, publishedCopy]))
          .and.callThrough();
        component.ngOnInit();
        fixture.detectChanges();
        const tabs = wiComponentEl.querySelectorAll('.mat-tab-label');
        (tabs[1] as HTMLElement).click();
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          fixture.detectChanges();
          expect(base64HelperServiceSpy.getBase64ImageData).toHaveBeenCalledWith('Thumbnail.jpg');
          expect(base64HelperServiceSpy.getBase64Image).toHaveBeenCalledWith('Thumbnail.jpg');
          done();
        });
      });
    });
  });

  describe('setOrder', () => {
    it('should define function', () => {
      expect(component.setOrder).toBeDefined();
    });

    it('should set reverse & reverseObj for drafts if order and setOrder value are same', (done) => {
      const tabs = wiComponentEl.querySelectorAll('.mat-tab-label');
      (tabs[0] as HTMLElement).click();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        const headings = wiComponentEl.querySelectorAll('.table th');
        (headings[1] as HTMLElement).click();
        expect(component.reverse).toBeFalse();
        expect(component.reverseObj).toEqual({ updated_at: false });
        done();
      });
    });

    it('should set order, reverse & reverseObj for drafts if order and setOrder value are not same', (done) => {
      const tabs = wiComponentEl.querySelectorAll('.mat-tab-label');
      (tabs[0] as HTMLElement).click();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        const headings = wiComponentEl.querySelectorAll('.table th');
        (headings[0] as HTMLElement).click();
        expect(component.reverse).toBeFalse();
        expect(component.reverseObj).toEqual({ WI_Name: false });
        done();
      });
    });

    it('should set reverse & reverseObj for published if order and setOrder value are same', (done) => {
      const tabs = wiComponentEl.querySelectorAll('.mat-tab-label');
      (tabs[1] as HTMLElement).click();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        const headings = wiComponentEl.querySelectorAll('.table th');
        (headings[1] as HTMLElement).click();
        expect(component.reverse).toBeFalse();
        expect(component.reverseObj).toEqual({ updated_at: false });
        done();
      });
    });

    it('should set order, reverse & reverseObj for published if order and setOrder value are not same', (done) => {
      const tabs = wiComponentEl.querySelectorAll('.mat-tab-label');
      (tabs[1] as HTMLElement).click();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        const headings = wiComponentEl.querySelectorAll('.table th');
        (headings[0] as HTMLElement).click();
        expect(component.reverse).toBeFalse();
        expect(component.reverseObj).toEqual({ WI_Name: false });
        done();
      });
    });
  });

  describe('tabChanged', () => {
    it('should define function', () => {
      expect(component.tabChanged).toBeDefined();
    });

    it('should set tabIndex, reverse, order & reverseObj', waitForAsync(() => {
      const tabs = wiComponentEl.querySelectorAll('.mat-tab-label');
      (tabs[1] as HTMLElement).click();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(component.tabIndex).toBe(1);
        expect(component.reverse).toBeTrue();
        expect(component.order).toBe('updated_at');
        expect(component.reverseObj).toEqual({ updated_at: true });
      });
    }));
  });

  describe('getAuthors', () => {
    it('should define function', () => {
      expect(component.getAuthors).toBeDefined();
    });

    it('should set author details', () => {
      const authors = users.map(
        (user) => `${user.first_name} ${user.last_name}`
      );
      component.getAuthors();
      expect(instructionServiceSpy.getUsers).toHaveBeenCalledWith();
      expect(component.authors).toEqual(authors);
    });
  });

  describe('setFav', () => {
    it('should define function', () => {
      expect(component.setFav).toBeDefined();
    });

    it('should switch to favorite state by clicking on unfavorite drafted instruction', (done) => {
      let [, drafted] = instructions;
      drafted = { ...drafted, IsFavorite: true };
      (instructionServiceSpy.setFavoriteInstructions as jasmine.Spy)
        .withArgs(drafted.Id, info)
        .and.returnValue(of(drafted))
        .and.callThrough();
      const tabs = wiComponentEl.querySelectorAll('.mat-tab-label');
      (tabs[0] as HTMLElement).click();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        const anchors = wiComponentEl.querySelectorAll('.table tr td a');
        (anchors[2] as HTMLElement).click();
        expect(instructionServiceSpy.setFavoriteInstructions).toHaveBeenCalledWith(drafted.Id, info);
        expect(instructionServiceSpy.setFavoriteInstructions).toHaveBeenCalledTimes(1);
        expect(component.draftedInstructionsList[0].IsFavorite).toBe(true);
        done();
      });
    });

    it('should handle error while switching to favorite state by clicking on unfavorite drafted instruction', (done) => {
      let [, drafted] = instructions;
      drafted = { ...drafted, IsFavorite: true };
      (instructionServiceSpy.setFavoriteInstructions as jasmine.Spy)
        .withArgs(drafted.Id, info)
        .and.returnValue(throwError({ message: 'Unable to set as favorite'}))
        .and.callThrough();
      const tabs = wiComponentEl.querySelectorAll('.mat-tab-label');
      (tabs[0] as HTMLElement).click();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        const anchors = wiComponentEl.querySelectorAll('.table tr td a');
        (anchors[2] as HTMLElement).click();
        expect(instructionServiceSpy.setFavoriteInstructions).toHaveBeenCalledWith(drafted.Id, info);
        expect(instructionServiceSpy.setFavoriteInstructions).toHaveBeenCalledTimes(1);
        expect(errorHandlerServiceSpy.handleError).toHaveBeenCalledWith({ message: 'Unable to set as favorite'} as HttpErrorResponse);
        done();
      });
    });

    it('should switch to unfavorite state by clicking on favorite published instruction', (done) => {
      let [published] = instructions;
      published = { ...published, IsFavorite: false };
      (instructionServiceSpy.setFavoriteInstructions as jasmine.Spy)
        .withArgs(published.Id, info)
        .and.returnValue(of(published))
        .and.callThrough();
      const tabs = wiComponentEl.querySelectorAll('.mat-tab-label');
      (tabs[1] as HTMLElement).click();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        const anchors = wiComponentEl.querySelectorAll('.table tr td a');
        (anchors[2] as HTMLElement).click();
        expect(instructionServiceSpy.setFavoriteInstructions).toHaveBeenCalledWith(published.Id, info);
        expect(instructionServiceSpy.setFavoriteInstructions).toHaveBeenCalledTimes(1);
        expect(component.publishedInstructionsList[0].IsFavorite).toBe(false);
        done();
      });
    });

    it('should handle error while switching to unfavorite state by clicking on favorite published instruction', (done) => {
      let [published] = instructions;
      published = { ...published, IsFavorite: false };
      (instructionServiceSpy.setFavoriteInstructions as jasmine.Spy)
        .withArgs(published.Id, info)
        .and.returnValue(throwError({ message: 'Unable to set as favorite'}))
        .and.callThrough();
      const tabs = wiComponentEl.querySelectorAll('.mat-tab-label');
      (tabs[1] as HTMLElement).click();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        const anchors = wiComponentEl.querySelectorAll('.table tr td a');
        (anchors[2] as HTMLElement).click();
        expect(instructionServiceSpy.setFavoriteInstructions).toHaveBeenCalledWith(published.Id, info);
        expect(instructionServiceSpy.setFavoriteInstructions).toHaveBeenCalledTimes(1);
        expect(errorHandlerServiceSpy.handleError).toHaveBeenCalledWith({ message: 'Unable to set as favorite'} as HttpErrorResponse);
        done();
      });
    });
  });

  describe('removeWI', () => {
    it('should define function', () => {
      expect(component.removeWI).toBeDefined();
    });

    it('should remove published work instruction when click on confirm/delete', (done) => {
      const [published] = instructions;
      (instructionServiceSpy.deleteWorkInstruction$ as jasmine.Spy)
        .withArgs(published.Id, info)
        .and.returnValue(of([published]))
        .and.callThrough();
      const tabs = wiComponentEl.querySelectorAll('.mat-tab-label');
      (tabs[1] as HTMLElement).click();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        const menuTigger: MatMenuTrigger = fixture.debugElement
          .query(By.directive(MatMenuTrigger))
          .injector.get(MatMenuTrigger);
        menuTigger.openMenu();
        const deleteWorkInstructionButton = wiComponentDe.query(
          By.css('#deleteWorkInstruction')
        ).nativeElement as HTMLElement;
        deleteWorkInstructionButton.click();
        expect(Swal.isVisible()).toBeTruthy();
        expect(Swal.getTitle().textContent).toEqual('Are you sure?');
        expect(Swal.getHtmlContainer().textContent).toEqual(
          `Do you want to delete the work instruction '${published.WI_Name}' ?`
        );
        expect(Swal.getConfirmButton().textContent).toEqual('Delete');
        Swal.clickConfirm();
        setTimeout(() => {
          expect(instructionServiceSpy.deleteWorkInstruction$).toHaveBeenCalledWith(
            published.Id,
            info
          );
          expect(instructionServiceSpy.deleteWorkInstruction$).toHaveBeenCalledTimes(1);
          expect(spinnerSpy.show).toHaveBeenCalledWith();
          expect(spinnerSpy.hide).toHaveBeenCalledWith();
          expect(toastServiceSpy.show).toHaveBeenCalledWith({
            text: "Work instuction '" + published.WI_Name + "' has been deleted",
            type: 'success'
          });
          done();
        });
      });
    });

    it('should not remove published work instruction when user click on cancel', (done) => {
      const [published] = instructions;
      (instructionServiceSpy.deleteWorkInstruction$ as jasmine.Spy)
        .withArgs(published.Id, info)
        .and.returnValue(of([published]))
        .and.callThrough();
      const tabs = wiComponentEl.querySelectorAll('.mat-tab-label');
      (tabs[1] as HTMLElement).click();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        const menuTigger: MatMenuTrigger = fixture.debugElement
          .query(By.directive(MatMenuTrigger))
          .injector.get(MatMenuTrigger);
        menuTigger.openMenu();
        const deleteWorkInstructionButton = wiComponentDe.query(
          By.css('#deleteWorkInstruction')
        ).nativeElement as HTMLElement;
        deleteWorkInstructionButton.click();
        expect(Swal.isVisible()).toBeTruthy();
        expect(Swal.getTitle().textContent).toEqual('Are you sure?');
        expect(Swal.getHtmlContainer().textContent).toEqual(
          `Do you want to delete the work instruction '${published.WI_Name}' ?`
        );
        expect(Swal.getConfirmButton().textContent).toEqual('Delete');
        Swal.clickCancel();
        setTimeout(() => {
          expect(instructionServiceSpy.deleteWorkInstruction$).not.toHaveBeenCalled();
          done();
        });
      });
    });

    it('should remove drafted work instruction when click on confirm/delete', (done) => {
      const [, drafted] = instructions;
      (instructionServiceSpy.deleteWorkInstruction$ as jasmine.Spy)
        .withArgs(drafted.Id, info)
        .and.returnValue(of([drafted]))
        .and.callThrough();
      const tabs = wiComponentEl.querySelectorAll('.mat-tab-label');
      (tabs[0] as HTMLElement).click();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        const menuTigger: MatMenuTrigger = fixture.debugElement
          .query(By.directive(MatMenuTrigger))
          .injector.get(MatMenuTrigger);
        menuTigger.openMenu();
        const deleteWorkInstructionButton = wiComponentDe.query(
          By.css('#deleteWorkInstruction')
        ).nativeElement as HTMLElement;
        deleteWorkInstructionButton.click();
        expect(Swal.isVisible()).toBeTruthy();
        expect(Swal.getTitle().textContent).toEqual('Are you sure?');
        expect(Swal.getHtmlContainer().textContent).toEqual(
          `Do you want to delete the work instruction '${drafted.WI_Name}' ?`
        );
        expect(Swal.getConfirmButton().textContent).toEqual('Delete');
        Swal.clickConfirm();
        setTimeout(() => {
          expect(instructionServiceSpy.deleteWorkInstruction$).toHaveBeenCalledWith(
            drafted.Id,
            info
          );
          expect(instructionServiceSpy.deleteWorkInstruction$).toHaveBeenCalledTimes(1);
          expect(spinnerSpy.show).toHaveBeenCalledWith();
          expect(spinnerSpy.hide).toHaveBeenCalledWith();
          expect(toastServiceSpy.show).toHaveBeenCalledWith({
            text: "Work instuction '"+ drafted.WI_Name +"' has been deleted",
            type: 'success'
          });
          done();
        });
      });
    });

    it('should not remove drafted work instruction when user click on cancel', (done) => {
      const [, drafted] = instructions;
      (instructionServiceSpy.deleteWorkInstruction$ as jasmine.Spy)
        .withArgs(drafted.Id, info)
        .and.returnValue(of([drafted]))
        .and.callThrough();
      const tabs = wiComponentEl.querySelectorAll('.mat-tab-label');
      (tabs[0] as HTMLElement).click();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        const menuTigger: MatMenuTrigger = fixture.debugElement
          .query(By.directive(MatMenuTrigger))
          .injector.get(MatMenuTrigger);
        menuTigger.openMenu();
        const deleteWorkInstructionButton = wiComponentDe.query(
          By.css('#deleteWorkInstruction')
        ).nativeElement as HTMLElement;
        deleteWorkInstructionButton.click();
        expect(Swal.isVisible()).toBeTruthy();
        expect(Swal.getTitle().textContent).toEqual('Are you sure?');
        expect(Swal.getHtmlContainer().textContent).toEqual(
          `Do you want to delete the work instruction '${drafted.WI_Name}' ?`
        );
        expect(Swal.getConfirmButton().textContent).toEqual('Delete');
        Swal.clickCancel();
        setTimeout(() => {
          expect(instructionServiceSpy.deleteWorkInstruction$).not.toHaveBeenCalled();
          done();
        });
      });
    });

    it('should handle error while deleting work instruction', (done) => {
      const [published] = instructions;
      (instructionServiceSpy.deleteWorkInstruction$ as jasmine.Spy)
        .withArgs(published.Id, info)
        .and.returnValue(throwError({ message: 'Unable to delete WI' }))
        .and.callThrough();
      const tabs = wiComponentEl.querySelectorAll('.mat-tab-label');
      (tabs[1] as HTMLElement).click();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        const menuTigger: MatMenuTrigger = fixture.debugElement
          .query(By.directive(MatMenuTrigger))
          .injector.get(MatMenuTrigger);
        menuTigger.openMenu();
        const deleteWorkInstructionButton = wiComponentDe.query(
          By.css('#deleteWorkInstruction')
        ).nativeElement as HTMLElement;
        deleteWorkInstructionButton.click();
        expect(Swal.isVisible()).toBeTruthy();
        expect(Swal.getTitle().textContent).toEqual('Are you sure?');
        expect(Swal.getHtmlContainer().textContent).toEqual(
          `Do you want to delete the work instruction '${published.WI_Name}' ?`
        );
        expect(Swal.getConfirmButton().textContent).toEqual('Delete');
        Swal.clickConfirm();
        setTimeout(() => {
          expect(instructionServiceSpy.deleteWorkInstruction$).toHaveBeenCalledWith(
            published.Id,
            info
          );
          expect(instructionServiceSpy.deleteWorkInstruction$).toHaveBeenCalledTimes(1);
          expect(errorHandlerServiceSpy.handleError).toHaveBeenCalledWith({ message: 'Unable to delete WI' } as HttpErrorResponse);
          done();
        });
      });
    });
  });

  describe('getInstructionsWithCategoryName', () => {
    it('should define function', () => {
      expect(component.getInstructionsWithCategoryName).toBeDefined();
    });

    it('should set drafted, published instructions list with category name', () => {
      const [published, drafted] = instructions;
      const { Category_Name } = category1;
      component.getInstructionsWithCategoryName(categoryId);
      expect(
        instructionServiceSpy.getInstructionsByCategoryId
      ).toHaveBeenCalledWith(categoryId, info);
      expect(instructionServiceSpy.getSelectedCategory).toHaveBeenCalledWith(
        categoryId,
        info
      );
      expect(component.draftedInstructionsList).toEqual([{ ...drafted }]);
      expect(component.publishedInstructionsList).toEqual([{ ...published }]);
      expect(spinnerSpy.show).toHaveBeenCalledWith();
      expect(spinnerSpy.hide).toHaveBeenCalledWith();
      expect(component.selectedCategory).toBe(Category_Name);
    });

    it('should handle error', () => {
      const error = 'Unable to get instructions';
      (instructionServiceSpy.getInstructionsByCategoryId as jasmine.Spy)
        .withArgs(categoryId, info)
        .and.returnValue(throwError({message: error}))
        .and.callThrough();
      const { Category_Name } = category1;
      component.getInstructionsWithCategoryName(categoryId);
      expect(
        instructionServiceSpy.getInstructionsByCategoryId
      ).toHaveBeenCalledWith(categoryId, info);
      expect(instructionServiceSpy.getSelectedCategory).toHaveBeenCalledWith(
        categoryId,
        info
      );
      expect(component.draftedInstructionsList).toEqual([]);
      expect(component.publishedInstructionsList).toEqual([]);
      expect(spinnerSpy.show).toHaveBeenCalledWith();
      expect(errorHandlerServiceSpy.handleError).toHaveBeenCalledWith({message: error} as HttpErrorResponse);
      expect(spinnerSpy.hide).toHaveBeenCalledWith();
      expect(component.selectedCategory).toBe(Category_Name);
    });
  });

  describe('ngOnInit', () => {
    it('should define function', () => {
      expect(component.ngOnInit).toBeDefined();
    });

    it('should call getInstructionsWithCategoryName function', () => {
      spyOn(component, 'getInstructionsWithCategoryName');
      component.ngOnInit();
      expect(component.getInstructionsWithCategoryName).toHaveBeenCalledWith(
        categoryId
      );
    });
  });

  describe('getImageSrc', () => {
    it('should define function', () => {
      expect(component.getImageSrc).toBeDefined();
    });

    it('should return given source if source is from assets', () => {
      const src = 'assets/work-instructions-icons/image.jpg';
      expect(component.getImageSrc(src)).toBe(src);
    });

    it('should call getBase64ImageData if source is not from assets', () => {
      const src = 'image.jpg';
      component.getImageSrc(src);
      expect(base64HelperServiceSpy.getBase64ImageData).toHaveBeenCalledWith(src);
    });
  });
});
