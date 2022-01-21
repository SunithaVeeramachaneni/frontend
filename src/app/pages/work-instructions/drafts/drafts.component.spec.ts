import { DebugElement } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { OrderModule } from 'ngx-order-pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSpinnerService } from 'ngx-spinner';
import { of, throwError } from 'rxjs';
import { AppMaterialModules } from '../../../material.module';
import { DropDownFilterPipe } from '../../../shared/pipes/dropdown-filter.pipe';
import { TimeAgoPipe } from '../../../shared/pipes/time-ago.pipe';
import { SharedModule } from '../../../shared/shared.module';
import { ToastService } from '../../../shared/toast';
import { InstructionService } from '../services/instruction.service';
import { DraftsComponent } from './drafts.component';
import Swal from 'sweetalert2';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorInfo, User } from '../../../interfaces';
import { HttpErrorResponse } from '@angular/common/http';
import { Base64HelperService } from '../services/base64-helper.service';
import { IonicModule } from '@ionic/angular';
import { ErrorHandlerService } from '../../../shared/error-handler/error-handler.service';
import { CommonService } from '../../../shared/services/common.service';
import { defaultCategoryId, defaultCategoryName, routingUrls } from '../../../app.constants';
import { ActivatedRoute, convertToParamMap } from '@angular/router';

const categoryDetails = [
  {
    Category_Id: defaultCategoryId,
    Category_Name: defaultCategoryName,
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
const categories1 = [` ${category1.Category_Name}`];
const categories2 = [` ${category2.Category_Name}`, ` ${category3.Category_Name}`];
const image = 'assets/work-instructions-icons/img/brand/doc-placeholder.png';

const drafts = [
  {
    Id: '2836',
    WI_Id: 2,
    Categories: JSON.stringify([category1.Category_Id]),
    WI_Name: 'Post Job Sanitisation procedure',
    WI_Desc: null,
    Tools: null,
    Equipements: null,
    Locations: null,
    IsFavorite: true,
    CreatedBy: 'Tester One',
    EditedBy: 'Tester One',
    AssignedObjects: null,
    SpareParts: null,
    SafetyKit: null,
    created_at: '2020-11-17T09:25:13.000Z',
    updated_at: '2020-11-17T09:25:13.000Z',
    Published: false,
    IsPublishedTillSave: null,
    Cover_Image: image,
    categories: categories1,
    IsFromAudioOrVideoFile: false,
    IsAudioOrVideoFileDeleted: false,
    FilePath: null,
    FileType: null
  },
  {
    Id: '2845',
    WI_Id: 3,
    Categories: JSON.stringify([category2.Category_Id, category3.Category_Id]),
    WI_Name: 'InstToBePublish',
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
    created_at: '2020-11-17T12:06:39.000Z',
    updated_at: '2020-11-17T12:06:39.000Z',
    Published: false,
    IsPublishedTillSave: null,
    Cover_Image: image,
    categories: categories2,
    IsFromAudioOrVideoFile: false,
    IsAudioOrVideoFileDeleted: false,
    FilePath: null,
    FileType: null
  },
];

const users: User[] = [
  {
    id: '1',
    first_name: 'Tester',
    last_name: 'One',
    email: 'tester.one@innovapptive.com',
    password: '5000353tes',
    role: 'admin',
    empId: '5000353',
  },
  {
    id: '2',
    first_name: 'Tester',
    last_name: 'Two',
    email: 'tester.two@innovapptive.com',
    password: '5000392tes',
    role: 'user',
    empId: '5000392',
  },
];

const info: ErrorInfo = { displayToast: false, failureResponse: 'throwError' };

describe('DraftsComponent', () => {
  let component: DraftsComponent;
  let fixture: ComponentFixture<DraftsComponent>;
  let spinnerSpy: NgxSpinnerService;
  let instructionServiceSpy: InstructionService;
  let errorHandlerServiceSpy: ErrorHandlerService;
  let toastServiceSpy: ToastService;
  let base64HelperServiceSpy: Base64HelperService;
  let commonServiceSpy: CommonService;
  let activatedRouteSpy: ActivatedRoute;
  let draftsDe: DebugElement;
  let draftsEl: HTMLElement;

  beforeEach(waitForAsync(() => {
    spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);
    instructionServiceSpy = jasmine.createSpyObj('InstructionService', [
      'getDraftedInstructions',
      'setFavoriteInstructions',
      'getUsers',
      'deleteWorkInstruction$',
      'copyWorkInstruction'
    ]);
    errorHandlerServiceSpy = jasmine.createSpyObj('ErrorHandlerService', [
      'handleError'
    ]);
    toastServiceSpy = jasmine.createSpyObj('ToastService', ['show']);
    base64HelperServiceSpy = jasmine.createSpyObj('Base64HelperService', ['getBase64ImageData', 'getBase64Image']);
    commonServiceSpy = jasmine.createSpyObj('CommonService', ['setHeaderTitle'], {
      currentRouteUrlAction$: of('/work-instructions/drafts')
    });
    activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], {
      queryParamMap: of(convertToParamMap({ }))
    });

    TestBed.configureTestingModule({
      declarations: [
        DraftsComponent,
        DropDownFilterPipe,
        TimeAgoPipe
      ],
      imports: [
        NgxPaginationModule,
        OrderModule,
        Ng2SearchPipeModule,
        AppMaterialModules,
        RouterTestingModule,
        SharedModule,
        FormsModule,
        BrowserAnimationsModule,
        IonicModule
      ],
      providers: [
        { provide: NgxSpinnerService, useValue: spinnerSpy },
        { provide: InstructionService, useValue: instructionServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: Base64HelperService, useValue: base64HelperServiceSpy },
        { provide: ErrorHandlerService, useValue: errorHandlerServiceSpy },
        { provide: CommonService, useValue: commonServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DraftsComponent);
    component = fixture.componentInstance;
    draftsDe = fixture.debugElement;
    draftsEl = draftsDe.nativeElement;
    (instructionServiceSpy.getDraftedInstructions as jasmine.Spy)
      .withArgs()
      .and.returnValue(of(drafts))
      .and.callThrough();
    (instructionServiceSpy.getUsers as jasmine.Spy)
      .withArgs()
      .and.returnValue(of(users))
      .and.callThrough();
    localStorage.setItem('loggedInUser', JSON.stringify(users[0]));
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should define varibales & set defaults', () => {
    expect(component.config).toBeDefined();
    expect(component.config).toEqual({
      id: 'draftsss',
      currentPage: 1,
      itemsPerPage: 6,
      directionLinks: false,
    });
    expect(component.search).toBeDefined();
    expect(component.order).toBeDefined();
    expect(component.order).toBe('updated_at');
    expect(component.reverse).toBeDefined();
    expect(component.reverse).toBeTrue();
    expect(component.reverseObj).toBeDefined();
    expect(component.reverseObj).toEqual({ updated_at: true });
    expect(component.CreatedBy).toBeDefined();
    expect(component.CreatedBy).toBe('');
    expect(component.EditedBy).toBeDefined();
    expect(component.EditedBy).toBe('');
    expect(component.currentRouteUrl$).toBeDefined();
    expect(component.drafts$).toBeDefined();
    expect(component.authors$).toBeDefined();
    expect(component.routingUrls).toBeDefined();
    expect(component.routingUrls).toEqual(routingUrls);
    expect(component.routeWithSearch).toBeDefined();
  });

  describe('template', () => {
    const [drafted] = drafts;
    beforeEach(() => {
      (instructionServiceSpy.getDraftedInstructions as jasmine.Spy)
        .withArgs()
        .and.returnValue(of([drafted]))
        .and.callThrough();
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should contain labels related to drafts', () => {
      expect(draftsEl.querySelectorAll('input').length).toBe(1);
      expect(draftsEl.querySelectorAll('select').length).toBe(1);
      expect(draftsEl.querySelectorAll('option').length).toBe(3);
      expect(draftsEl.querySelector('img').getAttribute('src')).toContain(
        'search.svg'
      );
      expect(
        draftsEl.querySelector('#prependedInput').getAttribute('placeholder')
      ).toContain('Search by title or author');
      const searchInfo = draftsEl.querySelector('.input-prepend.input-group');
      expect(searchInfo.textContent).toContain('Authors');
      expect(searchInfo.textContent).toContain('Tester One');
      expect(searchInfo.textContent).toContain('Tester Two');

      const tableHeader = draftsEl.querySelectorAll('table thead tr th');
      expect(tableHeader[0].textContent).toContain('Title');
      expect(tableHeader[1].textContent).toContain('Category');
      expect(tableHeader[2].textContent).toContain('Last Edited');
      expect(tableHeader[3].textContent).toContain('Author');
      expect(draftsEl.querySelectorAll('table thead tr').length).toBe(1);
      expect(tableHeader.length).toBe(5);

      const [draft1] = drafts;
      expect(draftsEl.querySelector('table tbody tr th img').getAttribute('src')).toContain(
        draft1.Cover_Image
      );
      const tableBodyTh = draftsEl.querySelectorAll('table tbody tr th');
      const tableBodyTd = draftsEl.querySelectorAll('table tbody tr td');
      expect(tableBodyTh[0].textContent).toBe(draft1.WI_Name);
      expect(tableBodyTd[0].textContent).toBe(draft1.categories.join());
      expect(tableBodyTd[1].textContent).toContain('Edited');
      expect(tableBodyTd[1].textContent).toContain(draft1.EditedBy);
      expect(tableBodyTd[2].textContent).toContain(draft1.CreatedBy);
      expect(draftsEl.querySelectorAll('table tbody tr').length).toBe(2);
      expect(tableBodyTh.length).toBe(1);
      expect(tableBodyTd.length).toBe(4);

      const anchors = draftsEl.querySelectorAll('table tbody tr a');
      expect(anchors.length).toBe(5);

      expect((anchors[0] as HTMLElement).getAttribute('href')).toBe(
        `/work-instructions/drafts/${draft1.Id}`
      );
      expect((anchors[1] as HTMLElement).getAttribute('href')).toBe(
        `/work-instructions/drafts/${draft1.Id}`
      );
      expect((anchors[2] as HTMLElement).getAttribute('href')).toBe(
        `/work-instructions/drafts/${draft1.Id}`
      );
      expect((anchors[3] as HTMLElement).getAttribute('href')).toBe(
        `/work-instructions/drafts/${draft1.Id}`
      );

      const menuTigger: MatMenuTrigger = fixture.debugElement
        .query(By.directive(MatMenuTrigger))
        .injector.get(MatMenuTrigger);
      menuTigger.openMenu();
      const editWIButton = draftsDe.query(By.css('#editWorkInstruction'))
        .nativeElement as HTMLElement;
      expect(editWIButton.textContent).toContain('Edit Work Instruction');
      const deleteWIButton = draftsDe.query(By.css('#deleteWorkInstruction'))
        .nativeElement as HTMLElement;
      expect(deleteWIButton.textContent).toContain('Delete Work Instruction');
      expect(
        (draftsDe.query(By.css('#editWorkInstruction'))
          .nativeElement as HTMLElement).getAttribute('ng-reflect-router-link')
      ).toBe(`/work-instructions/drafts,${draft1.Id}`);
      const copyWIButton = draftsDe.query(By.css('#copyWorkInstruction'))
        .nativeElement as HTMLElement;
      expect(copyWIButton.textContent).toContain('Copy Work Instruction');
      expect(draftsEl.querySelectorAll('pagination-template').length).toBe(1);
      expect(
        draftsEl.querySelectorAll('app-custom-pagination-controls').length
      ).toBe(1);
      expect(
        draftsEl.querySelectorAll('app-dummy').length
      ).toBe(1);
      expect(draftsEl.querySelectorAll('router-outlet').length).toBe(1);
    });

    it('should display No Results Found if search item not present in work instructions', () => {
      const searchInput = draftsEl.querySelector('input');
      searchInput.value = 'testing';
      searchInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      const tableHeader = draftsEl.querySelectorAll('table thead tr th');
      expect(tableHeader[0].textContent).toContain('Title');
      expect(tableHeader[1].textContent).toContain('Category');
      expect(tableHeader[2].textContent).toContain('Last Edited');
      expect(tableHeader[3].textContent).toContain('Author');
      expect(draftsEl.querySelectorAll('table thead tr').length).toBe(1);
      expect(tableHeader.length).toBe(5);

      const tableBodyTh = draftsEl.querySelectorAll('table tbody tr th');
      const tableBodyTd = draftsEl.querySelectorAll('table tbody tr td');
      expect(draftsEl.querySelectorAll('table tbody tr').length).toBe(1);
      expect(draftsEl.querySelector('table tbody tr').textContent).toContain(
        'No Result Found!'
      );
      expect(tableBodyTh.length).toBe(0);
      expect(tableBodyTd.length).toBe(0);
    });

    it('should display No Drafted Work Instructions if componet doesnt have data', () => {
      (instructionServiceSpy.getDraftedInstructions as jasmine.Spy)
        .withArgs()
        .and.returnValue(of([]))
        .and.callThrough();
      component.ngOnInit();
      fixture.detectChanges();
      const tableHeader = draftsEl.querySelectorAll('table thead tr th');
      expect(tableHeader[0].textContent).toContain('Title');
      expect(tableHeader[1].textContent).toContain('Category');
      expect(tableHeader[2].textContent).toContain('Last Edited');
      expect(tableHeader[3].textContent).toContain('Author');
      expect(draftsEl.querySelectorAll('table thead tr').length).toBe(1);
      expect(tableHeader.length).toBe(5);

      const tableBodyTh = draftsEl.querySelectorAll('table tbody tr th');
      const tableBodyTd = draftsEl.querySelectorAll('table tbody tr td');
      expect(draftsEl.querySelectorAll('table tbody tr').length).toBe(1);
      expect(draftsEl.querySelector('.no-records').textContent).toContain(
        'No Drafted Work Instructions'
      );
      expect(tableBodyTh.length).toBe(0);
      expect(tableBodyTd.length).toBe(0);
    });

    it('should filter only selected author work instructions', () => {
      (instructionServiceSpy.getDraftedInstructions as jasmine.Spy)
        .withArgs()
        .and.returnValue(of(drafts))
        .and.callThrough();
      component.ngOnInit();
      fixture.detectChanges();

      const authorSelect = draftsEl.querySelector('select');
      authorSelect.selectedIndex = 2;
      authorSelect.dispatchEvent(new Event('change'));
      fixture.detectChanges();

      const tableHeader = draftsEl.querySelectorAll('table thead tr th');
      expect(tableHeader[0].textContent).toContain('Title');
      expect(tableHeader[1].textContent).toContain('Category');
      expect(tableHeader[2].textContent).toContain('Last Edited');
      expect(tableHeader[3].textContent).toContain('Author');
      expect(draftsEl.querySelectorAll('table thead tr').length).toBe(1);
      expect(tableHeader.length).toBe(5);

      const [, draft2] = drafts;
      const tableBodyTh = draftsEl.querySelectorAll('table tbody tr th');
      const tableBodyTd = draftsEl.querySelectorAll('table tbody tr td');
      expect(tableBodyTh[0].textContent).toBe(draft2.WI_Name);
      expect(tableBodyTd[0].textContent).toBe(draft2.categories.join());
      expect(tableBodyTd[1].textContent).toContain('Edited');
      expect(tableBodyTd[1].textContent).toContain(draft2.EditedBy);
      expect(tableBodyTd[2].textContent).toContain(draft2.CreatedBy);
      expect(draftsEl.querySelectorAll('table tbody tr').length).toBe(2);
      expect(tableBodyTh.length).toBe(1);
      expect(tableBodyTd.length).toBe(4);
    });

    it('should display No Results Found if filtered author not available in work instructions', () => {
      const authorSelect = draftsEl.querySelector('select');
      authorSelect.selectedIndex = 2;
      authorSelect.dispatchEvent(new Event('change'));
      fixture.detectChanges();

      const tableHeader = draftsEl.querySelectorAll('table thead tr th');
      expect(tableHeader[0].textContent).toContain('Title');
      expect(tableHeader[1].textContent).toContain('Category');
      expect(tableHeader[2].textContent).toContain('Last Edited');
      expect(tableHeader[3].textContent).toContain('Author');
      expect(draftsEl.querySelectorAll('table thead tr').length).toBe(1);
      expect(tableHeader.length).toBe(5);

      const tableBodyTh = draftsEl.querySelectorAll('table tbody tr th');
      const tableBodyTd = draftsEl.querySelectorAll('table tbody tr td');
      expect(draftsEl.querySelectorAll('table tbody tr').length).toBe(1);
      expect(draftsEl.querySelector('table tbody tr').textContent).toContain(
        'No Result Found!'
      );
      expect(tableBodyTh.length).toBe(0);
      expect(tableBodyTd.length).toBe(0);
    });

    it('should call getBase64Image if Cover_Image is not from assets', () => {
      const draftedCopy = {...drafted};
      draftedCopy.Cover_Image = 'Thumbnail.jpg';
      (instructionServiceSpy.getDraftedInstructions as jasmine.Spy)
        .withArgs()
        .and.returnValue(of([draftedCopy]))
        .and.callThrough();
      component.ngOnInit();
      fixture.detectChanges();
      expect(base64HelperServiceSpy.getBase64ImageData).toHaveBeenCalledWith('Thumbnail.jpg', draftedCopy.Id);
      expect(base64HelperServiceSpy.getBase64Image).toHaveBeenCalledWith('Thumbnail.jpg', draftedCopy.Id);
    });

    it('should display drafts template if current route url is drafts or drafts search', () => {
      expect(draftsEl.querySelector('.drafts-main').childNodes.length).not.toBe(0);

      (Object.getOwnPropertyDescriptor(activatedRouteSpy, 'queryParamMap')
        .get as jasmine.Spy).and.returnValue(of(convertToParamMap({ search: 'test' })));
      (Object.getOwnPropertyDescriptor(commonServiceSpy, 'currentRouteUrlAction$')
        .get as jasmine.Spy).and.returnValue(of('/work-instructions/drafts?search=test'));  

      component.ngOnInit();  
      fixture.detectChanges();

      expect(component.search).toBe('test');
      expect(draftsEl.querySelector('.drafts-main').childNodes.length).not.toBe(0);
    });

    it('should not display drafts template if current route url is not drafts or drafts search', () => {
      (Object.getOwnPropertyDescriptor(commonServiceSpy, 'currentRouteUrlAction$')
        .get as jasmine.Spy).and.returnValue(of('/work-instructions/drafts/hxhgyHj'));  

      component.ngOnInit();  
      fixture.detectChanges();

      expect(draftsEl.querySelector('.drafts-main')).toBeNull();
    });
  });

  describe('ngOnInit', () => {
    it('should define function', () => {
      expect(component.ngOnInit).toBeDefined();
    });

    it('should call getAllDraftedInstructions, AuthorDropDown', () => {
      spyOn(component, 'getAllDraftedInstructions');
      spyOn(component, 'AuthorDropDown');
      component.ngOnInit();
      expect(component.getAllDraftedInstructions).toHaveBeenCalledWith();
      expect(component.AuthorDropDown).toHaveBeenCalledWith();
      expect(component.search).toBeNull();
    });

    it('should set header title', () => {
      expect(spinnerSpy.hide).toHaveBeenCalled();
      expect(component.routeWithSearch).toBe(`${routingUrls.drafts.url}?search=`);
      component.currentRouteUrl$.subscribe(
        data => {
          expect(data).toBe(routingUrls.drafts.url);
          expect(commonServiceSpy.setHeaderTitle).toHaveBeenCalledWith(routingUrls.drafts.title);
        }
      )
    });
  });

  describe('AuthorDropDown', () => {
    it('should define function', () => {
      expect(component.AuthorDropDown).toBeDefined();
    });

    it('should set authors observable', () => {
      const authors = users.map(
        (user) => `${user.first_name} ${user.last_name}`
      );
      component.AuthorDropDown();
      expect(instructionServiceSpy.getUsers).toHaveBeenCalledWith();
      component.authors$.subscribe(
        data => expect(data).toEqual(authors)
      );
    });
  });

  describe('setOrder', () => {
    it('should define function', () => {
      expect(component.setOrder).toBeDefined();
    });

    it('should set reverse & reverseObj for drafts if order and setOrder value are same', () => {
      const headings = draftsEl.querySelectorAll('.table th');
      (headings[2] as HTMLElement).click();
      expect(component.reverse).toBeFalse();
      expect(component.reverseObj).toEqual({ updated_at: false });
    });

    it('should set order, reverse & reverseObj for drafts if order and setOrder value are not same', () => {
      const headings = draftsEl.querySelectorAll('.table th');
      (headings[1] as HTMLElement).click();
      expect(component.reverse).toBeFalse();
      expect(component.reverseObj).toEqual({ Category_Name: false });
    });
  });

  describe('removeWI', () => {
    const [drafted] = drafts;
    beforeEach(() => {
      (instructionServiceSpy.getDraftedInstructions as jasmine.Spy)
        .withArgs()
        .and.returnValue(of([drafted]))
        .and.callThrough();
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should define function', () => {
      expect(component.removeWI).toBeDefined();
    });

    it('should remove drafted work instruction when click on confirm/delete', (done) => {
      (instructionServiceSpy.deleteWorkInstruction$ as jasmine.Spy)
        .withArgs(drafted.Id, info)
        .and.returnValue(of([drafted]))
        .and.callThrough();
      const menuTigger: MatMenuTrigger = fixture.debugElement
        .query(By.directive(MatMenuTrigger))
        .injector.get(MatMenuTrigger);
      menuTigger.openMenu();
      const deleteWorkInstructionButton = draftsDe.query(
        By.css('#deleteWorkInstruction')
      ).nativeElement as HTMLElement;
      deleteWorkInstructionButton.click();
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
          type: 'success',
        });
        done();
      });
    });

    it('should not remove drafted work instruction when user click on cancel', (done) => {
      (instructionServiceSpy.deleteWorkInstruction$ as jasmine.Spy)
        .withArgs(drafted.Id, info)
        .and.returnValue(of([drafted]))
        .and.callThrough();
      const menuTigger: MatMenuTrigger = fixture.debugElement
        .query(By.directive(MatMenuTrigger))
        .injector.get(MatMenuTrigger);
      menuTigger.openMenu();
      const deleteWorkInstructionButton = draftsDe.query(
        By.css('#deleteWorkInstruction')
      ).nativeElement as HTMLElement;
      deleteWorkInstructionButton.click();
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

    it('should handle error while deleting work instruction', (done) => {
      (instructionServiceSpy.deleteWorkInstruction$ as jasmine.Spy)
        .withArgs(drafted.Id, info)
        .and.returnValue(throwError({ message: 'Unable to delete WI' }))
        .and.callThrough();
      const menuTigger: MatMenuTrigger = fixture.debugElement
        .query(By.directive(MatMenuTrigger))
        .injector.get(MatMenuTrigger);
      menuTigger.openMenu();
      const deleteWorkInstructionButton = draftsDe.query(
        By.css('#deleteWorkInstruction')
      ).nativeElement as HTMLElement;
      deleteWorkInstructionButton.click();
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
        expect(errorHandlerServiceSpy.handleError).toHaveBeenCalledWith({ message: 'Unable to delete WI' } as HttpErrorResponse);
        done();
      });
    });
  });

  describe('setFav', () => {
    it('should define function', () => {
      expect(component.setFav).toBeDefined();
    });

    it('should set work instruction as favorite', () => {
      const [, drafted] = drafts;
      const favDrafted = { ...drafted, IsFavorite: true };
      (instructionServiceSpy.getDraftedInstructions as jasmine.Spy)
        .withArgs()
        .and.returnValue(of([drafted]))
        .and.callThrough();
      component.ngOnInit();
      fixture.detectChanges();
      (instructionServiceSpy.setFavoriteInstructions as jasmine.Spy)
        .withArgs(drafted.Id, info)
        .and.returnValue(of(favDrafted))
        .and.callThrough();
      const anchors = draftsEl.querySelectorAll('table tbody tr td a');
      (anchors[3] as HTMLElement).click();
      expect(instructionServiceSpy.setFavoriteInstructions).toHaveBeenCalledWith(drafted.Id, info);
      expect(instructionServiceSpy.setFavoriteInstructions).toHaveBeenCalledTimes(1);
      component.drafts$.subscribe(data => expect(data[0].IsFavorite).toBe(true));
    });

    it('should set work instruction as unfavorite', () => {
      const [drafted] = drafts;
      const favDrafted = { ...drafted, IsFavorite: false };
      (instructionServiceSpy.getDraftedInstructions as jasmine.Spy)
        .withArgs()
        .and.returnValue(of([drafted]))
        .and.callThrough();
      component.ngOnInit();
      fixture.detectChanges();
      (instructionServiceSpy.setFavoriteInstructions as jasmine.Spy)
        .withArgs(drafted.Id, info)
        .and.returnValue(of(favDrafted))
        .and.callThrough();
      const anchors = draftsEl.querySelectorAll('table tbody tr td a');
      (anchors[3] as HTMLElement).click();
      expect(instructionServiceSpy.setFavoriteInstructions).toHaveBeenCalledWith(drafted.Id, info);
      expect(instructionServiceSpy.setFavoriteInstructions).toHaveBeenCalledTimes(1);
      component.drafts$.subscribe(data => expect(data[0].IsFavorite).toBe(false));
    });

    it('should handle error while setting work instruction as favorite', () => {
      const [, drafted] = drafts;
      (instructionServiceSpy.getDraftedInstructions as jasmine.Spy)
        .withArgs()
        .and.returnValue(of([drafted]))
        .and.callThrough();
      component.ngOnInit();
      fixture.detectChanges();
      (instructionServiceSpy.setFavoriteInstructions as jasmine.Spy)
        .withArgs(drafted.Id, info)
        .and.returnValue(throwError({ message: 'Unable to set as favorite'}))
        .and.callThrough();
      const anchors = draftsEl.querySelectorAll('table tbody tr td a');
      (anchors[3] as HTMLElement).click();
      expect(instructionServiceSpy.setFavoriteInstructions).toHaveBeenCalledWith(drafted.Id, info);
      expect(instructionServiceSpy.setFavoriteInstructions).toHaveBeenCalledTimes(1);
      expect(errorHandlerServiceSpy.handleError).toHaveBeenCalledWith({ message: 'Unable to set as favorite'} as HttpErrorResponse);
    });
  });

  describe('getAllDraftedInstructions', () => {
    it('should define function', () => {
      expect(component.getAllDraftedInstructions).toBeDefined();
    });

    it('should set drafts observable', () => {
      component.getAllDraftedInstructions();
      expect(spinnerSpy.show).toHaveBeenCalledWith();
      expect(
        instructionServiceSpy.getDraftedInstructions
      ).toHaveBeenCalledWith();
      expect(spinnerSpy.hide).toHaveBeenCalledWith();
      component.drafts$.subscribe(
        data => expect(data).toEqual(drafts)
      );
    });
  });

  describe('copyWI', () => {
    const [drafted] = drafts;
    beforeEach(() => {
      (instructionServiceSpy.getDraftedInstructions as jasmine.Spy)
        .withArgs()
        .and.returnValue(of([drafted]))
        .and.callThrough();
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should define function', () => {
      expect(component.copyWI).toBeDefined();
    });

    it('should copy work instruction while clicking on copy work instruction from mat menu', () => {
      (instructionServiceSpy.copyWorkInstruction as jasmine.Spy)
        .withArgs(drafted.WI_Name, users[0], info)
        .and.returnValue(of({ instruction: { ...drafted, WI_Name: 'Name of Copy Inst'}, steps: [] }));
      spyOn(component, 'getAllDraftedInstructions');
      const menuTigger: MatMenuTrigger = fixture.debugElement
        .query(By.directive(MatMenuTrigger))
        .injector.get(MatMenuTrigger);
      menuTigger.openMenu();
      const copyWorkInstructionButton = draftsDe.query(
        By.css('#copyWorkInstruction')
      ).nativeElement as HTMLElement;
      copyWorkInstructionButton.click();
      expect(instructionServiceSpy.copyWorkInstruction).toHaveBeenCalledWith(drafted.WI_Name, users[0], info);
      expect(instructionServiceSpy.copyWorkInstruction).toHaveBeenCalledTimes(1);
      expect(spinnerSpy.show).toHaveBeenCalledWith();
      expect(spinnerSpy.hide).toHaveBeenCalledWith();
      expect(toastServiceSpy.show).toHaveBeenCalledWith({
        text: "Selected work instruction has been successfully copied",
        type: 'success',
      });
      expect(component.getAllDraftedInstructions).toHaveBeenCalledWith();
    });

    it('should handle copy work instruction error while clicking on copy work instruction from mat menu', () => {
      (instructionServiceSpy.copyWorkInstruction as jasmine.Spy)
        .withArgs(drafted.WI_Name, users[0], info)
        .and.returnValue(throwError({ message: 'Unable to copy WI' }));
      spyOn(component, 'getAllDraftedInstructions');
      const menuTigger: MatMenuTrigger = fixture.debugElement
        .query(By.directive(MatMenuTrigger))
        .injector.get(MatMenuTrigger);
      menuTigger.openMenu();
      const copyWorkInstructionButton = draftsDe.query(
        By.css('#copyWorkInstruction')
      ).nativeElement as HTMLElement;
      copyWorkInstructionButton.click();
      expect(instructionServiceSpy.copyWorkInstruction).toHaveBeenCalledWith(drafted.WI_Name, users[0], info);
      expect(instructionServiceSpy.copyWorkInstruction).toHaveBeenCalledTimes(1);
      expect(spinnerSpy.show).toHaveBeenCalledWith();
      expect(spinnerSpy.hide).toHaveBeenCalledWith();
      expect(errorHandlerServiceSpy.handleError).toHaveBeenCalledWith({ message: 'Unable to copy WI' } as HttpErrorResponse);
      expect(component.getAllDraftedInstructions).not.toHaveBeenCalled();
    });
  });
  
  describe('getImageSrc', () => {
    it('should define function', () => {
      expect(component.getImageSrc).toBeDefined();
    });

    it('should return given source if source is from assets', () => {
      const src = 'assets/work-instructions-icons/image.jpg';
      const path = 'path';
      expect(component.getImageSrc(src, path)).toBe(src);
    });

    it('should call getBase64ImageData if source is not from assets', () => {
      const src = 'image.jpg';
      const path = 'path';
      component.getImageSrc(src, path);
      expect(base64HelperServiceSpy.getBase64ImageData).toHaveBeenCalledWith(src, path);
    });
  });
});
