import { DebugElement } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { OrderModule } from 'ngx-order-pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';
import { of, throwError } from 'rxjs';
import { AppMaterialModules } from '../../../material.module';
import { DropDownFilterPipe } from '../../../shared/pipes/dropdown-filter.pipe';
import { TimeAgoPipe } from '../../../shared/pipes/time-ago.pipe';
import { SharedModule } from '../../../shared/shared.module';
import { ToastService } from '../../../shared/toast';
import { InstructionService } from '../services/instruction.service';
import Swal from 'sweetalert2';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PublishedComponent } from './published.component';
import { ErrorInfo, User } from '../../../interfaces';
import { HttpErrorResponse } from '@angular/common/http';
import { Base64HelperService } from '../services/base64-helper.service';
import { ErrorHandlerService } from '../../../shared/error-handler/error-handler.service';
import { CommonService } from '../../../shared/services/common.service';
import {
  defaultCategoryId,
  defaultCategoryName,
  routingUrls
} from '../../../app.constants';
import { HeaderService } from 'src/app/shared/services/header.service';
import { userInfo$ } from '../../login/services/login.service.mock';
import { LoginService } from '../../login/services/login.service';

const categoryDetails = [
  {
    Category_Id: defaultCategoryId,
    Category_Name: defaultCategoryName,
    Cover_Image:
      'assets/work-instructions-icons/svg/Categories/default-category.png'
  },
  {
    Category_Id: 177,
    Category_Name: 'Health-Precautions',
    Cover_Image: 'assets/work-instructions-icons/CoverImages/coverimage2.png'
  },
  {
    Category_Id: 178,
    Category_Name: 'Sample Category',
    Cover_Image: 'assets/work-instructions-icons/CoverImages/coverimage3.png'
  }
];

const [category1, category2, category3] = categoryDetails;
const categories1 = [` ${category1.Category_Name}`];
const categories2 = [
  ` ${category2.Category_Name}`,
  ` ${category3.Category_Name}`
];
const image = 'assets/work-instructions-icons/img/brand/doc-placeholder.png';

const published = [
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
    Published: true,
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
    Published: true,
    IsPublishedTillSave: null,
    Cover_Image: image,
    categories: categories2,
    IsFromAudioOrVideoFile: false,
    IsAudioOrVideoFileDeleted: false,
    FilePath: null,
    FileType: null
  }
];

const users: User[] = [
  {
    first_name: 'Tester',
    last_name: 'One'
  },
  {
    first_name: 'Tester',
    last_name: 'Two'
  }
];

const info: ErrorInfo = { displayToast: false, failureResponse: 'throwError' };

describe('PublishedComponent', () => {
  let component: PublishedComponent;
  let fixture: ComponentFixture<PublishedComponent>;
  let instructionServiceSpy: InstructionService;
  let errorHandlerServiceSpy: ErrorHandlerService;
  let toastServiceSpy: ToastService;
  let base64HelperServiceSpy: Base64HelperService;
  let commonServiceSpy: CommonService;
  let headerServiceSpy: HeaderService;
  let loginServiceSpy: LoginService;
  let publishedDe: DebugElement;
  let publishedEl: HTMLElement;

  beforeEach(waitForAsync(() => {
    instructionServiceSpy = jasmine.createSpyObj('InstructionService', [
      'getPublishedInstructions',
      'setFavoriteInstructions',
      'getUsers',
      'deleteWorkInstruction$',
      'copyWorkInstruction'
    ]);
    errorHandlerServiceSpy = jasmine.createSpyObj('ErrorHandlerService', [
      'handleError'
    ]);
    toastServiceSpy = jasmine.createSpyObj('ToastService', ['show']);
    base64HelperServiceSpy = jasmine.createSpyObj('Base64HelperService', [
      'getBase64ImageData',
      'getBase64Image'
    ]);
    commonServiceSpy = jasmine.createSpyObj('CommonService', [], {
      currentRouteUrlAction$: of('/work-instructions/published')
    });
    headerServiceSpy = jasmine.createSpyObj('HeaderService', [
      'setHeaderTitle'
    ]);
    loginServiceSpy = jasmine.createSpyObj('LoginService', [], {
      loggedInUserInfo$: userInfo$
    });

    TestBed.configureTestingModule({
      declarations: [PublishedComponent, DropDownFilterPipe, TimeAgoPipe],
      imports: [
        NgxPaginationModule,
        OrderModule,
        Ng2SearchPipeModule,
        AppMaterialModules,
        RouterTestingModule,
        SharedModule,
        FormsModule,
        BrowserAnimationsModule,
        NgxShimmerLoadingModule
      ],
      providers: [
        { provide: InstructionService, useValue: instructionServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: Base64HelperService, useValue: base64HelperServiceSpy },
        { provide: ErrorHandlerService, useValue: errorHandlerServiceSpy },
        { provide: CommonService, useValue: commonServiceSpy },
        { provide: HeaderService, useValue: headerServiceSpy },
        { provide: LoginService, useValue: loginServiceSpy }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishedComponent);
    component = fixture.componentInstance;
    publishedDe = fixture.debugElement;
    publishedEl = publishedDe.nativeElement;
    (instructionServiceSpy.getPublishedInstructions as jasmine.Spy)
      .withArgs()
      .and.returnValue(of(published))
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
      id: 'published',
      currentPage: 1,
      itemsPerPage: 6,
      directionLinks: false
    });
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
    expect(component.published$).toBeDefined();
    expect(component.authors$).toBeDefined();
    expect(component.routingUrls).toBeDefined();
    expect(component.routingUrls).toEqual(routingUrls);
  });

  describe('template', () => {
    const [publish] = published;
    beforeEach(() => {
      (instructionServiceSpy.getPublishedInstructions as jasmine.Spy)
        .withArgs()
        .and.returnValue(of([publish]))
        .and.callThrough();
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should contain labels related to published', () => {
      expect(publishedEl.querySelectorAll('input').length).toBe(1);
      expect(publishedEl.querySelectorAll('select').length).toBe(1);
      expect(publishedEl.querySelectorAll('option').length).toBe(3);
      expect(
        publishedEl.querySelector('#inputSearch').getAttribute('placeholder')
      ).toContain('Search by title or author');
      const searchInfo = publishedEl.querySelector('.author-dropdown');
      expect(searchInfo.textContent).toContain('Authors');
      expect(searchInfo.textContent).toContain('Tester One');
      expect(searchInfo.textContent).toContain('Tester Two');

      const tableHeader = publishedEl.querySelectorAll('table thead tr th');
      expect(tableHeader[0].textContent).toContain('Title');
      expect(tableHeader[1].textContent).toContain('Category');
      expect(tableHeader[2].textContent).toContain('Last Edited');
      expect(tableHeader[3].textContent).toContain('Author');
      expect(publishedEl.querySelectorAll('table thead tr').length).toBe(1);
      expect(tableHeader.length).toBe(5);

      const [publish1] = published;
      expect(
        publishedEl.querySelector('table tbody tr th img').getAttribute('src')
      ).toContain(publish1.Cover_Image);
      const tableBodyTh = publishedEl.querySelectorAll('table tbody tr th');
      const tableBodyTd = publishedEl.querySelectorAll('table tbody tr td');
      expect(tableBodyTh[0].textContent).toContain(publish1.WI_Name);
      expect(tableBodyTd[0].textContent).toBe(publish1.categories.join());
      expect(tableBodyTd[1].textContent).toContain('Edited');
      expect(tableBodyTd[1].textContent).toContain(publish1.EditedBy);
      expect(tableBodyTd[2].textContent).toContain(publish1.CreatedBy);
      expect(publishedEl.querySelectorAll('table tbody tr').length).toBe(2);
      expect(tableBodyTh.length).toBe(1);
      expect(tableBodyTd.length).toBe(4);

      const anchors = publishedEl.querySelectorAll('table tbody tr a');
      expect(anchors.length).toBe(5);

      expect((anchors[0] as HTMLElement).getAttribute('href')).toBe(
        `/work-instructions/published/${publish1.Id}`
      );
      expect((anchors[1] as HTMLElement).getAttribute('href')).toBe(
        `/work-instructions/published/${publish1.Id}`
      );
      expect((anchors[2] as HTMLElement).getAttribute('href')).toBe(
        `/work-instructions/published/${publish1.Id}`
      );
      expect((anchors[3] as HTMLElement).getAttribute('href')).toBe(
        `/work-instructions/published/${publish1.Id}`
      );

      const menuTigger: MatMenuTrigger = fixture.debugElement
        .query(By.directive(MatMenuTrigger))
        .injector.get(MatMenuTrigger);
      menuTigger.openMenu();
      const editWIButton = publishedDe.query(By.css('#editWorkInstruction'))
        .nativeElement as HTMLElement;
      expect(editWIButton.textContent).toContain('Edit Work Instruction');
      const deleteWIButton = publishedDe.query(By.css('#deleteWorkInstruction'))
        .nativeElement as HTMLElement;
      expect(deleteWIButton.textContent).toContain('Delete Work Instruction');
      expect(
        (
          publishedDe.query(By.css('#editWorkInstruction'))
            .nativeElement as HTMLElement
        ).getAttribute('ng-reflect-router-link')
        // ).toBe(`/work-instructions/published,${publish1.Id}`);
      ).toContain(`/work-instructions/published`);
      const copyWIButton = publishedDe.query(By.css('#copyWorkInstruction'))
        .nativeElement as HTMLElement;
      expect(copyWIButton.textContent).toContain('Copy Work Instruction');
      expect(publishedEl.querySelectorAll('pagination-template').length).toBe(
        1
      );
      expect(
        publishedEl.querySelectorAll('app-custom-pagination-controls').length
      ).toBe(1);
      expect(publishedEl.querySelectorAll('app-dummy').length).toBe(1);
      expect(publishedEl.querySelectorAll('router-outlet').length).toBe(1);
    });

    it('should display No Results Found if search item not present in work instructions', () => {
      const searchInput = publishedEl.querySelector('input');
      searchInput.value = 'testing';
      searchInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      const tableHeader = publishedEl.querySelectorAll('table thead tr th');
      expect(tableHeader[0].textContent).toContain('Title');
      expect(tableHeader[1].textContent).toContain('Category');
      expect(tableHeader[2].textContent).toContain('Last Edited');
      expect(tableHeader[3].textContent).toContain('Author');
      expect(publishedEl.querySelectorAll('table thead tr').length).toBe(1);
      expect(tableHeader.length).toBe(5);

      const tableBodyTh = publishedEl.querySelectorAll('table tbody tr th');
      const tableBodyTd = publishedEl.querySelectorAll('table tbody tr td');
      expect(publishedEl.querySelectorAll('table tbody tr').length).toBe(1);
      expect(publishedEl.querySelector('table tbody tr').textContent).toContain(
        'No Result Found!'
      );
      expect(tableBodyTh.length).toBe(0);
      expect(tableBodyTd.length).toBe(0);
    });

    it('should display No Published Work Instructions if componet doesnt have data', () => {
      (instructionServiceSpy.getPublishedInstructions as jasmine.Spy)
        .withArgs()
        .and.returnValue(of([]))
        .and.callThrough();
      component.ngOnInit();
      fixture.detectChanges();
      const tableHeader = publishedEl.querySelectorAll('table thead tr th');
      expect(tableHeader[0].textContent).toContain('Title');
      expect(tableHeader[1].textContent).toContain('Category');
      expect(tableHeader[2].textContent).toContain('Last Edited');
      expect(tableHeader[3].textContent).toContain('Author');
      expect(publishedEl.querySelectorAll('table thead tr').length).toBe(1);
      expect(tableHeader.length).toBe(5);

      const tableBodyTh = publishedEl.querySelectorAll('table tbody tr th');
      const tableBodyTd = publishedEl.querySelectorAll('table tbody tr td');
      expect(publishedEl.querySelectorAll('table tbody tr').length).toBe(1);
      expect(publishedEl.querySelector('.no-records').textContent).toContain(
        'No Published Work Instructions'
      );
      expect(tableBodyTh.length).toBe(0);
      expect(tableBodyTd.length).toBe(0);
    });

    it('should filter only selected author work instructions', () => {
      (instructionServiceSpy.getPublishedInstructions as jasmine.Spy)
        .withArgs()
        .and.returnValue(of(published))
        .and.callThrough();
      component.ngOnInit();
      fixture.detectChanges();

      const authorSelect = publishedEl.querySelector('select');
      authorSelect.selectedIndex = 2;
      authorSelect.dispatchEvent(new Event('change'));
      fixture.detectChanges();

      const tableHeader = publishedEl.querySelectorAll('table thead tr th');
      expect(tableHeader[0].textContent).toContain('Title');
      expect(tableHeader[1].textContent).toContain('Category');
      expect(tableHeader[2].textContent).toContain('Last Edited');
      expect(tableHeader[3].textContent).toContain('Author');
      expect(publishedEl.querySelectorAll('table thead tr').length).toBe(1);
      expect(tableHeader.length).toBe(5);

      const [, publish2] = published;
      const tableBodyTh = publishedEl.querySelectorAll('table tbody tr th');
      const tableBodyTd = publishedEl.querySelectorAll('table tbody tr td');
      expect(tableBodyTh[0].textContent).toContain(publish2.WI_Name);
      expect(tableBodyTd[0].textContent).toBe(publish2.categories.join());
      expect(tableBodyTd[1].textContent).toContain('Edited');
      expect(tableBodyTd[1].textContent).toContain(publish2.EditedBy);
      expect(tableBodyTd[2].textContent).toContain(publish2.CreatedBy);
      expect(publishedEl.querySelectorAll('table tbody tr').length).toBe(2);
      expect(tableBodyTh.length).toBe(1);
      expect(tableBodyTd.length).toBe(4);
    });

    it('should display No Results Found if filtered author not available in work instructions', () => {
      const authorSelect = publishedEl.querySelector('select');
      authorSelect.selectedIndex = 2;
      authorSelect.dispatchEvent(new Event('change'));
      fixture.detectChanges();

      const tableHeader = publishedEl.querySelectorAll('table thead tr th');
      expect(tableHeader[0].textContent).toContain('Title');
      expect(tableHeader[1].textContent).toContain('Category');
      expect(tableHeader[2].textContent).toContain('Last Edited');
      expect(tableHeader[3].textContent).toContain('Author');
      expect(publishedEl.querySelectorAll('table thead tr').length).toBe(1);
      expect(tableHeader.length).toBe(5);

      const tableBodyTh = publishedEl.querySelectorAll('table tbody tr th');
      const tableBodyTd = publishedEl.querySelectorAll('table tbody tr td');
      expect(publishedEl.querySelectorAll('table tbody tr').length).toBe(1);
      expect(publishedEl.querySelector('table tbody tr').textContent).toContain(
        'No Result Found!'
      );
      expect(tableBodyTh.length).toBe(0);
      expect(tableBodyTd.length).toBe(0);
    });

    it('should call getBase64Image if Cover_Image is not from assets', () => {
      const publishedCopy = { ...publish };
      publishedCopy.Cover_Image = 'Thumbnail.jpg';
      (instructionServiceSpy.getPublishedInstructions as jasmine.Spy)
        .withArgs()
        .and.returnValue(of([publishedCopy]))
        .and.callThrough();
      component.ngOnInit();
      fixture.detectChanges();
      expect(base64HelperServiceSpy.getBase64ImageData).toHaveBeenCalledWith(
        'Thumbnail.jpg',
        publishedCopy.Id
      );
      expect(base64HelperServiceSpy.getBase64Image).toHaveBeenCalledWith(
        'Thumbnail.jpg',
        publishedCopy.Id
      );
    });

    it('should display published template if current route url is published', () => {
      expect(
        publishedEl.querySelector('.publish-main').childNodes.length
      ).not.toBe(0);
    });

    it('should not display published template if current route url is not published', () => {
      (
        Object.getOwnPropertyDescriptor(
          commonServiceSpy,
          'currentRouteUrlAction$'
        ).get as jasmine.Spy
      ).and.returnValue(of('/work-instructions/published/hxhgyHj'));

      component.ngOnInit();
      fixture.detectChanges();

      expect(publishedEl.querySelector('.publish-main')).toBeNull();

      (
        Object.getOwnPropertyDescriptor(
          commonServiceSpy,
          'currentRouteUrlAction$'
        ).get as jasmine.Spy
      ).and.returnValue(of('/work-instructions/published?search=test'));

      component.ngOnInit();
      fixture.detectChanges();

      expect(publishedEl.querySelector('.publish-main')).toBeNull();
    });
  });

  describe('ngOnInit', () => {
    it('should define function', () => {
      expect(component.ngOnInit).toBeDefined();
    });

    it('should call getAllPublishedInstructions, authorDropDown', () => {
      spyOn(component, 'getAllPublishedInstructions');
      spyOn(component, 'authorDropDown');
      component.ngOnInit();
      expect(component.getAllPublishedInstructions).toHaveBeenCalledWith();
      expect(component.authorDropDown).toHaveBeenCalledWith();
    });

    it('should set header title', () => {
      component.currentRouteUrl$.subscribe((data) => {
        expect(data).toBe(routingUrls.published.url);
        expect(headerServiceSpy.setHeaderTitle).toHaveBeenCalledWith(
          routingUrls.published.title
        );
      });
    });
  });

  describe('authorDropDown', () => {
    it('should define function', () => {
      expect(component.authorDropDown).toBeDefined();
    });

    it('should set authors observable', () => {
      const authors = users.map(
        (user) => `${user.first_name} ${user.last_name}`
      );
      component.authorDropDown();
      expect(instructionServiceSpy.getUsers).toHaveBeenCalledWith();
      component.authors$.subscribe((data) => expect(data).toEqual(authors));
    });
  });

  describe('setOrder', () => {
    it('should define function', () => {
      expect(component.setOrder).toBeDefined();
    });

    it('should set reverse & reverseObj for published if order and setOrder value are same', () => {
      const headings = publishedEl.querySelectorAll('.table th');
      (headings[2] as HTMLElement).click();
      expect(component.reverse).toBeFalse();
      expect(component.reverseObj).toEqual({ updated_at: false });
    });

    it('should set order, reverse & reverseObj for published if order and setOrder value are not same', () => {
      const headings = publishedEl.querySelectorAll('.table th');
      (headings[1] as HTMLElement).click();
      expect(component.reverse).toBeFalse();
      expect(component.reverseObj).toEqual({ Category_Name: false });
    });
  });

  describe('removePublsihedWI', () => {
    const [publish] = published;
    beforeEach(() => {
      (instructionServiceSpy.getPublishedInstructions as jasmine.Spy)
        .withArgs()
        .and.returnValue(of([publish]))
        .and.callThrough();
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should define function', () => {
      expect(component.removePublsihedWI).toBeDefined();
    });

    it('should remove published work instruction when click on confirm/delete', (done) => {
      (instructionServiceSpy.deleteWorkInstruction$ as jasmine.Spy)
        .withArgs(publish.Id, info)
        .and.returnValue(of([publish]))
        .and.callThrough();
      const menuTigger: MatMenuTrigger = fixture.debugElement
        .query(By.directive(MatMenuTrigger))
        .injector.get(MatMenuTrigger);
      menuTigger.openMenu();
      const deleteWorkInstructionButton = publishedDe.query(
        By.css('#deleteWorkInstruction')
      ).nativeElement as HTMLElement;
      deleteWorkInstructionButton.click();
      expect(Swal.getTitle().textContent).toEqual('Are you sure?');
      expect(Swal.getHtmlContainer().textContent).toEqual(
        `Do you want to delete the work instruction '${publish.WI_Name}' ?`
      );
      expect(Swal.getConfirmButton().textContent).toEqual('Delete');
      Swal.clickConfirm();
      setTimeout(() => {
        expect(
          instructionServiceSpy.deleteWorkInstruction$
        ).toHaveBeenCalledWith(publish.Id, info);
        expect(
          instructionServiceSpy.deleteWorkInstruction$
        ).toHaveBeenCalledTimes(1);
        expect(toastServiceSpy.show).toHaveBeenCalledWith({
          text: "Work instuction '" + publish.WI_Name + "' has been deleted",
          type: 'success'
        });
        done();
      });
    });

    it('should not remove published work instruction when user click on cancel', (done) => {
      (instructionServiceSpy.deleteWorkInstruction$ as jasmine.Spy)
        .withArgs(publish.Id, info)
        .and.returnValue(of([publish]))
        .and.callThrough();
      const menuTigger: MatMenuTrigger = fixture.debugElement
        .query(By.directive(MatMenuTrigger))
        .injector.get(MatMenuTrigger);
      menuTigger.openMenu();
      const deleteWorkInstructionButton = publishedDe.query(
        By.css('#deleteWorkInstruction')
      ).nativeElement as HTMLElement;
      deleteWorkInstructionButton.click();
      expect(Swal.getTitle().textContent).toEqual('Are you sure?');
      expect(Swal.getHtmlContainer().textContent).toEqual(
        `Do you want to delete the work instruction '${publish.WI_Name}' ?`
      );
      expect(Swal.getConfirmButton().textContent).toEqual('Delete');
      Swal.clickCancel();
      setTimeout(() => {
        expect(
          instructionServiceSpy.deleteWorkInstruction$
        ).not.toHaveBeenCalled();
        done();
      });
    });

    it('should handle error while deleting work instruction', (done) => {
      (instructionServiceSpy.deleteWorkInstruction$ as jasmine.Spy)
        .withArgs(publish.Id, info)
        .and.returnValue(throwError({ message: 'Unable to delete WI' }))
        .and.callThrough();
      const menuTigger: MatMenuTrigger = fixture.debugElement
        .query(By.directive(MatMenuTrigger))
        .injector.get(MatMenuTrigger);
      menuTigger.openMenu();
      const deleteWorkInstructionButton = publishedDe.query(
        By.css('#deleteWorkInstruction')
      ).nativeElement as HTMLElement;
      deleteWorkInstructionButton.click();
      expect(Swal.getTitle().textContent).toEqual('Are you sure?');
      expect(Swal.getHtmlContainer().textContent).toEqual(
        `Do you want to delete the work instruction '${publish.WI_Name}' ?`
      );
      expect(Swal.getConfirmButton().textContent).toEqual('Delete');
      Swal.clickConfirm();
      setTimeout(() => {
        expect(
          instructionServiceSpy.deleteWorkInstruction$
        ).toHaveBeenCalledWith(publish.Id, info);
        expect(
          instructionServiceSpy.deleteWorkInstruction$
        ).toHaveBeenCalledTimes(1);
        expect(errorHandlerServiceSpy.handleError).toHaveBeenCalledWith({
          message: 'Unable to delete WI'
        } as HttpErrorResponse);
        done();
      });
    });
  });

  describe('setFav', () => {
    it('should define function', () => {
      expect(component.setFav).toBeDefined();
    });

    it('should set work instruction as favorite', () => {
      const [, publish] = published;
      const favPublish = { ...publish, IsFavorite: true };
      (instructionServiceSpy.getPublishedInstructions as jasmine.Spy)
        .withArgs()
        .and.returnValue(of([publish]))
        .and.callThrough();
      component.ngOnInit();
      fixture.detectChanges();
      (instructionServiceSpy.setFavoriteInstructions as jasmine.Spy)
        .withArgs(publish.Id, info)
        .and.returnValue(of(favPublish))
        .and.callThrough();
      const anchors = publishedEl.querySelectorAll('table tbody tr td a');
      (anchors[3] as HTMLElement).click();
      expect(
        instructionServiceSpy.setFavoriteInstructions
      ).toHaveBeenCalledWith(publish.Id, info);
      expect(
        instructionServiceSpy.setFavoriteInstructions
      ).toHaveBeenCalledTimes(1);
      component.published$.subscribe((data) =>
        expect(data[0].IsFavorite).toBe(true)
      );
    });

    it('should set work instruction as unfavorite', () => {
      const [publish] = published;
      const favPublish = { ...publish, IsFavorite: false };
      (instructionServiceSpy.getPublishedInstructions as jasmine.Spy)
        .withArgs()
        .and.returnValue(of([publish]))
        .and.callThrough();
      component.ngOnInit();
      fixture.detectChanges();
      (instructionServiceSpy.setFavoriteInstructions as jasmine.Spy)
        .withArgs(publish.Id, info)
        .and.returnValue(of(favPublish))
        .and.callThrough();
      const anchors = publishedEl.querySelectorAll('table tbody tr td a');
      (anchors[3] as HTMLElement).click();
      expect(
        instructionServiceSpy.setFavoriteInstructions
      ).toHaveBeenCalledWith(publish.Id, info);
      expect(
        instructionServiceSpy.setFavoriteInstructions
      ).toHaveBeenCalledTimes(1);
      component.published$.subscribe((data) =>
        expect(data[0].IsFavorite).toBe(false)
      );
    });

    it('should handle error while setting work instruction as favorite', () => {
      const [, publish] = published;
      (instructionServiceSpy.getPublishedInstructions as jasmine.Spy)
        .withArgs()
        .and.returnValue(of([publish]))
        .and.callThrough();
      component.ngOnInit();
      fixture.detectChanges();
      (instructionServiceSpy.setFavoriteInstructions as jasmine.Spy)
        .withArgs(publish.Id, info)
        .and.returnValue(throwError({ message: 'Unable to set as favorite' }))
        .and.callThrough();
      const anchors = publishedEl.querySelectorAll('table tbody tr td a');
      (anchors[3] as HTMLElement).click();
      expect(
        instructionServiceSpy.setFavoriteInstructions
      ).toHaveBeenCalledWith(publish.Id, info);
      expect(
        instructionServiceSpy.setFavoriteInstructions
      ).toHaveBeenCalledTimes(1);
      expect(errorHandlerServiceSpy.handleError).toHaveBeenCalledWith({
        message: 'Unable to set as favorite'
      } as HttpErrorResponse);
    });
  });

  describe('getAllPublishedInstructions', () => {
    it('should define function', () => {
      expect(component.getAllPublishedInstructions).toBeDefined();
    });

    it('should set published observable', () => {
      component.getAllPublishedInstructions();
      expect(
        instructionServiceSpy.getPublishedInstructions
      ).toHaveBeenCalledWith();
      component.published$.subscribe((data) => expect(data).toEqual(published));
    });
  });

  describe('copyWI', () => {
    const [publish] = published;
    beforeEach(() => {
      (instructionServiceSpy.getPublishedInstructions as jasmine.Spy)
        .withArgs()
        .and.returnValue(of([publish]))
        .and.callThrough();
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should define function', () => {
      expect(component.copyWI).toBeDefined();
    });

    it('should copy work instruction while clicking on copy work instruction from mat menu', () => {
      (instructionServiceSpy.copyWorkInstruction as jasmine.Spy)
        .withArgs(publish.WI_Name, users[0], info)
        .and.returnValue(
          of({
            instruction: { ...publish, WI_Name: 'Name of Copy Inst' },
            steps: []
          })
        );
      spyOn(component, 'getAllPublishedInstructions');
      const menuTigger: MatMenuTrigger = fixture.debugElement
        .query(By.directive(MatMenuTrigger))
        .injector.get(MatMenuTrigger);
      menuTigger.openMenu();
      const copyWorkInstructionButton = publishedDe.query(
        By.css('#copyWorkInstruction')
      ).nativeElement as HTMLElement;
      copyWorkInstructionButton.click();
      expect(instructionServiceSpy.copyWorkInstruction).toHaveBeenCalledWith(
        publish.WI_Name,
        users[0],
        info
      );
      expect(instructionServiceSpy.copyWorkInstruction).toHaveBeenCalledTimes(
        1
      );
      expect(toastServiceSpy.show).toHaveBeenCalledWith({
        text: 'Selected work instruction has been successfully copied',
        type: 'success'
      });
      expect(component.getAllPublishedInstructions).toHaveBeenCalledWith();
    });

    it('should handle copy work instruction error while clicking on copy work instruction from mat menu', () => {
      (instructionServiceSpy.copyWorkInstruction as jasmine.Spy)
        .withArgs(publish.WI_Name, users[0], info)
        .and.returnValue(throwError({ message: 'Unable to copy WI' }));
      spyOn(component, 'getAllPublishedInstructions');
      const menuTigger: MatMenuTrigger = fixture.debugElement
        .query(By.directive(MatMenuTrigger))
        .injector.get(MatMenuTrigger);
      menuTigger.openMenu();
      const copyWorkInstructionButton = publishedDe.query(
        By.css('#copyWorkInstruction')
      ).nativeElement as HTMLElement;
      copyWorkInstructionButton.click();
      expect(instructionServiceSpy.copyWorkInstruction).toHaveBeenCalledWith(
        publish.WI_Name,
        users[0],
        info
      );
      expect(instructionServiceSpy.copyWorkInstruction).toHaveBeenCalledTimes(
        1
      );
      expect(errorHandlerServiceSpy.handleError).toHaveBeenCalledWith({
        message: 'Unable to copy WI'
      } as HttpErrorResponse);
      expect(component.getAllPublishedInstructions).not.toHaveBeenCalled();
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
      expect(base64HelperServiceSpy.getBase64ImageData).toHaveBeenCalledWith(
        src,
        path
      );
    });
  });
});
