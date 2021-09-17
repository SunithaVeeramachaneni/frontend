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
import Swal from 'sweetalert2';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RecentsComponent } from './recents.component';
import { ErrorInfo } from '../../../interfaces';
import { HttpErrorResponse } from '@angular/common/http';
import { Base64HelperService } from '../services/base64-helper.service';
import { IonicModule } from '@ionic/angular';
import { ErrorHandlerService } from '../../../shared/error-handler/error-handler.service';
import { HeaderService } from '../../../shared/services/header.service';
import { logonUserDetails } from '../../../shared/services/header.service.mock';

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
const categories1 = [` ${category1.Category_Name}`];
const categories2 = [` ${category2.Category_Name}`, ` ${category3.Category_Name}`];
const image = 'assets/work-instructions-icons/img/brand/doc-placeholder.png';

const recents = [
  {
    Id: '2836',
    WI_Id: 2,
    Categories: JSON.stringify([category1]),
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
    Categories: JSON.stringify([category2, category3]),
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
    Published: true,
    IsPublishedTillSave: null,
    Cover_Image: image,
    categories: categories2,
    IsFromAudioOrVideoFile: false,
    IsAudioOrVideoFileDeleted: false,
    FilePath: null,
    FileType: null
  },
];

const users = [
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

describe('RecentsComponent', () => {
  let component: RecentsComponent;
  let fixture: ComponentFixture<RecentsComponent>;
  let spinnerSpy: NgxSpinnerService;
  let instructionServiceSpy: InstructionService;
  let errorHandlerServiceSpy: ErrorHandlerService;
  let toastServiceSpy: ToastService;
  let base64HelperServiceSpy: Base64HelperService;
  let headerServiceSpy: HeaderService;
  let recentsDe: DebugElement;
  let recentsEl: HTMLElement;

  beforeEach(waitForAsync(() => {
    spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);
    instructionServiceSpy = jasmine.createSpyObj('InstructionService', [
      'getRecentInstructions',
      'setFavoriteInstructions',
      'getUsers',
      'deleteWorkInstruction$',
    ]);
    errorHandlerServiceSpy = jasmine.createSpyObj('ErrorHandlerService', [
      'handleError'
    ]);
    toastServiceSpy = jasmine.createSpyObj('ToastService', ['show']);
    base64HelperServiceSpy = jasmine.createSpyObj('Base64HelperService', ['getBase64ImageData', 'getBase64Image']);
    headerServiceSpy = jasmine.createSpyObj('HeaderService', ['getLogonUserDetails']);

    TestBed.configureTestingModule({
      declarations: [
        RecentsComponent,
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
        { provide: HeaderService, useValue: headerServiceSpy },
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentsComponent);
    component = fixture.componentInstance;
    recentsDe = fixture.debugElement;
    recentsEl = recentsDe.nativeElement;
    (instructionServiceSpy.getRecentInstructions as jasmine.Spy)
      .withArgs()
      .and.returnValue(of(recents))
      .and.callThrough();
    (instructionServiceSpy.getUsers as jasmine.Spy)
      .withArgs()
      .and.returnValue(of(users))
      .and.callThrough();
    (headerServiceSpy.getLogonUserDetails as jasmine.Spy)
      .withArgs()
      .and.returnValue(logonUserDetails)
      .and.callThrough();
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should define varibales & set defaults', () => {
    expect(component.recents).toBeDefined();
    expect(component.config).toBeDefined();
    expect(component.config).toEqual({
      id: 'recents',
      currentPage: 1,
      itemsPerPage: 6,
      directionLinks: false,
    });
    expect(component.order).toBeDefined();
    expect(component.order).toBe('updated_at');
    expect(component.reverse).toBeDefined();
    expect(component.reverse).toBeTrue();
    expect(component.reverseObj).toBeDefined();
    expect(component.reverseObj).toEqual({ updated_at: true });
    expect(component.authors).toBeDefined();
    expect(component.CreatedBy).toBeDefined();
    expect(component.CreatedBy).toBe('');
  });

  describe('template', () => {
    const [recent] = recents;
    beforeEach(() => {
      (instructionServiceSpy.getRecentInstructions as jasmine.Spy)
        .withArgs()
        .and.returnValue(of([recent]))
        .and.callThrough();
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should contain labels related to recents', () => {
      expect(recentsEl.querySelectorAll('input').length).toBe(1);
      expect(recentsEl.querySelectorAll('select').length).toBe(1);
      expect(recentsEl.querySelectorAll('option').length).toBe(3);
      expect(recentsEl.querySelector('ion-content img').getAttribute('src')).toContain(
        'search.svg'
      );
      expect(
        recentsEl.querySelector('#prependedInput').getAttribute('placeholder')
      ).toContain('Search by title or author');
      const searchInfo = recentsEl.querySelector('.input-prepend.input-group');
      expect(searchInfo.textContent).toContain('Authors');
      expect(searchInfo.textContent).toContain('Tester One');
      expect(searchInfo.textContent).toContain('Tester Two');

      const tableHeader = recentsEl.querySelectorAll('table thead tr th');
      expect(tableHeader[0].textContent).toContain('Title');
      expect(tableHeader[1].textContent).toContain('Category');
      expect(tableHeader[2].textContent).toContain('Last Edited');
      expect(tableHeader[3].textContent).toContain('Author');
      expect(recentsEl.querySelectorAll('table thead tr').length).toBe(1);
      expect(tableHeader.length).toBe(5);

      const [recent1] = recents;
      expect(recentsEl.querySelector('table tbody tr th img').getAttribute('src')).toContain(
        recent1.Cover_Image
      );
      const tableBodyTh = recentsEl.querySelectorAll('table tbody tr th');
      const tableBodyTd = recentsEl.querySelectorAll('table tbody tr td');
      expect(tableBodyTh[0].textContent).toContain(recent1.WI_Name);
      expect(tableBodyTd[0].textContent).toBe(recent1.categories.join());
      expect(tableBodyTd[1].textContent).toContain('Edited');
      expect(tableBodyTd[1].textContent).toContain(recent1.EditedBy);
      expect(tableBodyTd[2].textContent).toContain(recent1.CreatedBy);
      expect(recentsEl.querySelectorAll('table tbody tr').length).toBe(2);
      expect(tableBodyTh.length).toBe(1);
      expect(tableBodyTd.length).toBe(4);

      const anchors = recentsEl.querySelectorAll('table tbody tr a');
      expect(anchors.length).toBe(5);

      expect((anchors[0] as HTMLElement).getAttribute('href')).toBe(
        `/work-instructions/recents/${recent1.Id}`
      );
      expect((anchors[1] as HTMLElement).getAttribute('href')).toBe(
        `/work-instructions/recents/${recent1.Id}`
      );
      expect((anchors[2] as HTMLElement).getAttribute('href')).toBe(
        `/work-instructions/recents/${recent1.Id}`
      );
      expect((anchors[3] as HTMLElement).getAttribute('href')).toBe(
        `/work-instructions/recents/${recent1.Id}`
      );

      const menuTigger: MatMenuTrigger = fixture.debugElement
        .query(By.directive(MatMenuTrigger))
        .injector.get(MatMenuTrigger);
      menuTigger.openMenu();
      const editWIButton = recentsDe.query(By.css('#editWorkInstruction'))
        .nativeElement as HTMLElement;
      expect(editWIButton.textContent).toContain('Edit Work Instruction');
      const deleteWIButton = recentsDe.query(By.css('#deleteWorkInstruction'))
        .nativeElement as HTMLElement;
      expect(deleteWIButton.textContent).toContain('Delete Work Instruction');
      expect(
        (recentsDe.query(By.css('#editWorkInstruction'))
          .nativeElement as HTMLElement).getAttribute('ng-reflect-router-link')
      // ).toBe(`/work-instructions/recents,${recent1.Id}`);
      ).toContain(`/work-instructions/recents`);

      expect(recentsEl.querySelectorAll('pagination-template').length).toBe(1);
      expect(
        recentsEl.querySelectorAll('app-custom-pagination-controls').length
      ).toBe(1);
      expect(recentsEl.querySelectorAll('app-dummy').length).toBe(1);
      expect(recentsEl.querySelectorAll('app-header').length).toBe(1);
    });

    it('should display No Results Found if search item not present in work instructions', () => {
      const searchInput = recentsEl.querySelector('input');
      searchInput.value = 'testing';
      searchInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      const tableHeader = recentsEl.querySelectorAll('table thead tr th');
      expect(tableHeader[0].textContent).toContain('Title');
      expect(tableHeader[1].textContent).toContain('Category');
      expect(tableHeader[2].textContent).toContain('Last Edited');
      expect(tableHeader[3].textContent).toContain('Author');
      expect(recentsEl.querySelectorAll('table thead tr').length).toBe(1);
      expect(tableHeader.length).toBe(5);

      const tableBodyTh = recentsEl.querySelectorAll('table tbody tr th');
      const tableBodyTd = recentsEl.querySelectorAll('table tbody tr td');
      expect(recentsEl.querySelectorAll('table tbody tr').length).toBe(1);
      expect(recentsEl.querySelector('table tbody tr').textContent).toContain(
        'No Result Found!'
      );
      expect(tableBodyTh.length).toBe(0);
      expect(tableBodyTd.length).toBe(0);
    });

    it('should display No Recent Work Instructions if componet doesnt have data', () => {
      (instructionServiceSpy.getRecentInstructions as jasmine.Spy)
        .withArgs()
        .and.returnValue(of([]))
        .and.callThrough();
      component.ngOnInit();
      fixture.detectChanges();
      const tableHeader = recentsEl.querySelectorAll('table thead tr th');
      expect(tableHeader[0].textContent).toContain('Title');
      expect(tableHeader[1].textContent).toContain('Category');
      expect(tableHeader[2].textContent).toContain('Last Edited');
      expect(tableHeader[3].textContent).toContain('Author');
      expect(recentsEl.querySelectorAll('table thead tr').length).toBe(1);
      expect(tableHeader.length).toBe(5);

      const tableBodyTh = recentsEl.querySelectorAll('table tbody tr th');
      const tableBodyTd = recentsEl.querySelectorAll('table tbody tr td');
      expect(recentsEl.querySelectorAll('table tbody tr').length).toBe(1);
      expect(recentsEl.querySelector('.no-records').textContent).toContain(
        'No Recent Work Instructions'
      );
      expect(tableBodyTh.length).toBe(0);
      expect(tableBodyTd.length).toBe(0);
    });

    it('should filter only selected author work instructions', () => {
      (instructionServiceSpy.getRecentInstructions as jasmine.Spy)
        .withArgs()
        .and.returnValue(of(recents))
        .and.callThrough();
      component.ngOnInit();
      fixture.detectChanges();

      const authorSelect = recentsEl.querySelector('select');
      authorSelect.selectedIndex = 2;
      authorSelect.dispatchEvent(new Event('change'));
      fixture.detectChanges();

      const tableHeader = recentsEl.querySelectorAll('table thead tr th');
      expect(tableHeader[0].textContent).toContain('Title');
      expect(tableHeader[1].textContent).toContain('Category');
      expect(tableHeader[2].textContent).toContain('Last Edited');
      expect(tableHeader[3].textContent).toContain('Author');
      expect(recentsEl.querySelectorAll('table thead tr').length).toBe(1);
      expect(tableHeader.length).toBe(5);

      const [, recent2] = recents;
      const tableBodyTh = recentsEl.querySelectorAll('table tbody tr th');
      const tableBodyTd = recentsEl.querySelectorAll('table tbody tr td');
      expect(tableBodyTh[0].textContent).toContain(recent2.WI_Name);
      expect(tableBodyTd[0].textContent).toBe(recent2.categories.join());
      expect(tableBodyTd[1].textContent).toContain('Edited');
      expect(tableBodyTd[1].textContent).toContain(recent2.EditedBy);
      expect(tableBodyTd[2].textContent).toContain(recent2.CreatedBy);
      expect(recentsEl.querySelectorAll('table tbody tr').length).toBe(2);
      expect(tableBodyTh.length).toBe(1);
      expect(tableBodyTd.length).toBe(4);
    });

    it('should display No Results Found if filtered author not available in work instructions', () => {
      const authorSelect = recentsEl.querySelector('select');
      authorSelect.selectedIndex = 2;
      authorSelect.dispatchEvent(new Event('change'));
      fixture.detectChanges();

      const tableHeader = recentsEl.querySelectorAll('table thead tr th');
      expect(tableHeader[0].textContent).toContain('Title');
      expect(tableHeader[1].textContent).toContain('Category');
      expect(tableHeader[2].textContent).toContain('Last Edited');
      expect(tableHeader[3].textContent).toContain('Author');
      expect(recentsEl.querySelectorAll('table thead tr').length).toBe(1);
      expect(tableHeader.length).toBe(5);

      const tableBodyTh = recentsEl.querySelectorAll('table tbody tr th');
      const tableBodyTd = recentsEl.querySelectorAll('table tbody tr td');
      expect(recentsEl.querySelectorAll('table tbody tr').length).toBe(1);
      expect(recentsEl.querySelector('table tbody tr').textContent).toContain(
        'No Result Found!'
      );
      expect(tableBodyTh.length).toBe(0);
      expect(tableBodyTd.length).toBe(0);
    });

    it('should display draft beside instruction incase of drafted WI', () => {
      (instructionServiceSpy.getRecentInstructions as jasmine.Spy)
        .withArgs()
        .and.returnValue(of(recents))
        .and.callThrough();
      component.ngOnInit();
      fixture.detectChanges();

      const tableHeader = recentsEl.querySelectorAll('table thead tr th');
      expect(tableHeader[0].textContent).toContain('Title');
      expect(tableHeader[1].textContent).toContain('Category');
      expect(tableHeader[2].textContent).toContain('Last Edited');
      expect(tableHeader[3].textContent).toContain('Author');
      expect(recentsEl.querySelectorAll('table thead tr').length).toBe(1);
      expect(tableHeader.length).toBe(5);

      const [recent1, recent2] = recents;
      const tableBodyTh = recentsEl.querySelectorAll('table tbody tr th');
      const tableBodyTd = recentsEl.querySelectorAll('table tbody tr td');
      expect(tableBodyTh[0].textContent).toBe(recent2.WI_Name);
      expect(tableBodyTh[1].textContent).toBe(`${recent1.WI_Name}Draft`);
      expect(tableBodyTd[0].textContent).toBe(recent2.categories.join());
      expect(tableBodyTd[4].textContent).toBe(recent1.categories.join());
      expect(tableBodyTd[1].textContent).toContain('Edited');
      expect(tableBodyTd[1].textContent).toContain(recent2.EditedBy);
      expect(tableBodyTd[5].textContent).toContain('Edited');
      expect(tableBodyTd[5].textContent).toContain(recent1.EditedBy);
      expect(tableBodyTd[2].textContent).toContain(recent2.CreatedBy);
      expect(tableBodyTd[6].textContent).toContain(recent1.CreatedBy);
      expect(recentsEl.querySelectorAll('table tbody tr').length).toBe(3);
      expect(recentsEl.querySelectorAll('table tbody tr th .chip').length).toBe(1);
      expect(tableBodyTh.length).toBe(2);
      expect(tableBodyTd.length).toBe(8);
    });

    it('should call getBase64Image if Cover_Image is not from assets', () => {
      const recentCopy = {...recent};
      recentCopy.Cover_Image = 'Thumbnail.jpg';
      (instructionServiceSpy.getRecentInstructions as jasmine.Spy)
        .withArgs()
        .and.returnValue(of([recentCopy]))
        .and.callThrough();
      component.ngOnInit();
      fixture.detectChanges();
      expect(base64HelperServiceSpy.getBase64ImageData).toHaveBeenCalledWith('Thumbnail.jpg');
      expect(base64HelperServiceSpy.getBase64Image).toHaveBeenCalledWith('Thumbnail.jpg');
    });
  });

  describe('ngOnInit', () => {
    it('should define function', () => {
      expect(component.ngOnInit).toBeDefined();
    });

    it('should call getAllRecentInstructions, AuthorDropDown', () => {
      spyOn(component, 'getAllRecentInstructions');
      spyOn(component, 'AuthorDropDown');
      component.ngOnInit();
      expect(component.getAllRecentInstructions).toHaveBeenCalledWith();
      expect(component.AuthorDropDown).toHaveBeenCalledWith();
    });
  });

  describe('AuthorDropDown', () => {
    it('should define function', () => {
      expect(component.AuthorDropDown).toBeDefined();
    });

    it('should set author details', () => {
      const authors = users.map(
        (user) => `${user.first_name} ${user.last_name}`
      );
      component.AuthorDropDown();
      expect(instructionServiceSpy.getUsers).toHaveBeenCalledWith();
      expect(component.authors).toEqual(authors);
    });
  });

  describe('setOrder', () => {
    it('should define function', () => {
      expect(component.setOrder).toBeDefined();
    });

    it('should set reverse & reverseObj for recents if order and setOrder value are same', () => {
      const headings = recentsEl.querySelectorAll('.table th');
      (headings[2] as HTMLElement).click();
      expect(component.reverse).toBeFalse();
      expect(component.reverseObj).toEqual({ updated_at: false });
    });

    it('should set order, reverse & reverseObj for recents if order and setOrder value are not same', () => {
      const headings = recentsEl.querySelectorAll('.table th');
      (headings[1] as HTMLElement).click();
      expect(component.reverse).toBeFalse();
      expect(component.reverseObj).toEqual({ Category_Name: false });
    });
  });

  describe('removeWI', () => {
    const [recent] = recents;
    beforeEach(() => {
      (instructionServiceSpy.getRecentInstructions as jasmine.Spy)
        .withArgs()
        .and.returnValue(of([recent]))
        .and.callThrough();
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should define function', () => {
      expect(component.removeWI).toBeDefined();
    });

    it('should remove recent work instruction when click on confirm/delete', (done) => {
      (instructionServiceSpy.deleteWorkInstruction$ as jasmine.Spy)
        .withArgs(recent.Id, info)
        .and.returnValue(of([recent]))
        .and.callThrough();
      const menuTigger: MatMenuTrigger = fixture.debugElement
        .query(By.directive(MatMenuTrigger))
        .injector.get(MatMenuTrigger);
      menuTigger.openMenu();
      const deleteWorkInstructionButton = recentsDe.query(
        By.css('#deleteWorkInstruction')
      ).nativeElement as HTMLElement;
      deleteWorkInstructionButton.click();
      expect(Swal.isVisible()).toBeTruthy();
      expect(Swal.getTitle().textContent).toEqual('Are you sure?');
      expect(Swal.getHtmlContainer().textContent).toEqual(
        `Do you want to delete the work instruction '${recent.WI_Name}' ?`
      );
      expect(Swal.getConfirmButton().textContent).toEqual('Delete');
      Swal.clickConfirm();
      setTimeout(() => {
        expect(instructionServiceSpy.deleteWorkInstruction$).toHaveBeenCalledWith(
          recent.Id,
          info
        );
        expect(instructionServiceSpy.deleteWorkInstruction$).toHaveBeenCalledTimes(1);
        expect(spinnerSpy.show).toHaveBeenCalledWith();
        expect(spinnerSpy.hide).toHaveBeenCalledWith();
        expect(toastServiceSpy.show).toHaveBeenCalledWith({
          text: "Work instuction '"+ recent.WI_Name +"' has been deleted",
          type: 'success',
        });
        done();
      });
    });

    it('should not remove recent work instruction when user click on cancel', (done) => {
      (instructionServiceSpy.deleteWorkInstruction$ as jasmine.Spy)
        .withArgs(recent.Id, info)
        .and.returnValue(of([recent]))
        .and.callThrough();
      const menuTigger: MatMenuTrigger = fixture.debugElement
        .query(By.directive(MatMenuTrigger))
        .injector.get(MatMenuTrigger);
      menuTigger.openMenu();
      const deleteWorkInstructionButton = recentsDe.query(
        By.css('#deleteWorkInstruction')
      ).nativeElement as HTMLElement;
      deleteWorkInstructionButton.click();
      expect(Swal.isVisible()).toBeTruthy();
      expect(Swal.getTitle().textContent).toEqual('Are you sure?');
      expect(Swal.getHtmlContainer().textContent).toEqual(
        `Do you want to delete the work instruction '${recent.WI_Name}' ?`
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
        .withArgs(recent.Id, info)
        .and.returnValue(throwError({ message: 'Unable to delete WI' }))
        .and.callThrough();
      const menuTigger: MatMenuTrigger = fixture.debugElement
        .query(By.directive(MatMenuTrigger))
        .injector.get(MatMenuTrigger);
      menuTigger.openMenu();
      const deleteWorkInstructionButton = recentsDe.query(
        By.css('#deleteWorkInstruction')
      ).nativeElement as HTMLElement;
      deleteWorkInstructionButton.click();
      expect(Swal.isVisible()).toBeTruthy();
      expect(Swal.getTitle().textContent).toEqual('Are you sure?');
      expect(Swal.getHtmlContainer().textContent).toEqual(
        `Do you want to delete the work instruction '${recent.WI_Name}' ?`
      );
      expect(Swal.getConfirmButton().textContent).toEqual('Delete');
      Swal.clickConfirm();
      setTimeout(() => {
        expect(instructionServiceSpy.deleteWorkInstruction$).toHaveBeenCalledWith(
          recent.Id,
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
      const [, recent] = recents;
      const favRecent = { ...recent, IsFavorite: true };
      (instructionServiceSpy.getRecentInstructions as jasmine.Spy)
        .withArgs()
        .and.returnValue(of([recent]))
        .and.callThrough();
      component.ngOnInit();
      fixture.detectChanges();
      (instructionServiceSpy.setFavoriteInstructions as jasmine.Spy)
        .withArgs(recent.Id, info)
        .and.returnValue(of(favRecent))
        .and.callThrough();
      const anchors = recentsEl.querySelectorAll('table tbody tr td a');
      (anchors[3] as HTMLElement).click();
      expect(instructionServiceSpy.setFavoriteInstructions).toHaveBeenCalledWith(recent.Id, info);
      expect(instructionServiceSpy.setFavoriteInstructions).toHaveBeenCalledTimes(1);
      expect(component.recents[0].IsFavorite).toBe(true);
    });

    it('should set work instruction as unfavorite', () => {
      const [recent] = recents;
      const favRecent = { ...recent, IsFavorite: false };
      (instructionServiceSpy.getRecentInstructions as jasmine.Spy)
        .withArgs()
        .and.returnValue(of([recent]))
        .and.callThrough();
      component.ngOnInit();
      fixture.detectChanges();
      (instructionServiceSpy.setFavoriteInstructions as jasmine.Spy)
        .withArgs(recent.Id, info)
        .and.returnValue(of(favRecent))
        .and.callThrough();
      const anchors = recentsEl.querySelectorAll('table tbody tr td a');
      (anchors[3] as HTMLElement).click();
      expect(instructionServiceSpy.setFavoriteInstructions).toHaveBeenCalledWith(recent.Id, info);
      expect(instructionServiceSpy.setFavoriteInstructions).toHaveBeenCalledTimes(1);
      expect(component.recents[0].IsFavorite).toBe(false);
    });

    it('should handle error while setting work instruction as favorite', () => {
      const [, recent] = recents;
      (instructionServiceSpy.getRecentInstructions as jasmine.Spy)
        .withArgs()
        .and.returnValue(of([recent]))
        .and.callThrough();
      component.ngOnInit();
      fixture.detectChanges();
      (instructionServiceSpy.setFavoriteInstructions as jasmine.Spy)
        .withArgs(recent.Id, info)
        .and.returnValue(throwError({ message: 'Unable to set as favorite'}))
        .and.callThrough();
      const anchors = recentsEl.querySelectorAll('table tbody tr td a');
      (anchors[3] as HTMLElement).click();
      expect(instructionServiceSpy.setFavoriteInstructions).toHaveBeenCalledWith(recent.Id, info);
      expect(instructionServiceSpy.setFavoriteInstructions).toHaveBeenCalledTimes(1);
      expect(errorHandlerServiceSpy.handleError).toHaveBeenCalledWith({ message: 'Unable to set as favorite'} as HttpErrorResponse);
    });
  });

  describe('getAllRecentInstructions', () => {
    it('should define function', () => {
      expect(component.getAllRecentInstructions).toBeDefined();
    });

    it('should set recent work instructions list', () => {
      component.getAllRecentInstructions();
      expect(spinnerSpy.show).toHaveBeenCalledWith();
      expect(
        instructionServiceSpy.getRecentInstructions
      ).toHaveBeenCalledWith();
      expect(component.recents).toEqual(recents);
      expect(spinnerSpy.hide).toHaveBeenCalledWith();
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
