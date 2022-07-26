import { DebugElement } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from 'ng-mocks';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgpSortModule } from 'ngp-sort-pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';
import { of } from 'rxjs';
import { ErrorInfo } from '../../interfaces';
import { AppMaterialModules } from '../../material.module';
import { TimeAgoPipe } from '../../shared/pipes/time-ago.pipe';
import { Base64HelperService } from './services/base64-helper.service';
import { DummyComponent } from '../../shared/components/dummy/dummy.component';
import { ToastService } from '../../shared/toast';
import { CategoriesComponent } from './categories/categories.component';
import { InstructionService } from './services/instruction.service';
import { WorkInstructionsComponent } from './work-instructions.component';
import { SharedModule } from '../../shared/shared.module';
import { ErrorHandlerService } from '../../shared/error-handler/error-handler.service';
import { WiCommonService } from './services/wi-common.services';
import { importedWorkInstructions } from './work-instructions.component.mock';
import { OverlayService } from './modal/overlay.service';
import { CommonService } from '../../shared/services/common.service';
import {
  defaultCategoryId,
  defaultCategoryName,
  routingUrls
} from '../../app.constants';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { NgxSpinnerComponent } from 'ngx-spinner';
import { BreadcrumbService } from 'xng-breadcrumb';
import { HeaderService } from 'src/app/shared/services/header.service';
import { ImportService } from './services/import.service';
import { LoginService } from '../login/services/login.service';
import { userInfo$ } from '../login/services/login.service.mock';

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

const favorites = [
  {
    Id: '2947',
    WI_Id: 9,
    Categories: JSON.stringify([category1.Category_Id]),
    WI_Name: 'Pole Inspection measure',
    WI_Desc: null,
    Tools: null,
    Equipements: null,
    Locations: null,
    IsFavorite: true,
    CreatedBy: 'Tester One',
    EditedBy: 'Tester Two',
    AssignedObjects: null,
    SpareParts: null,
    SafetyKit: null,
    created_at: '2020-11-24T05:34:23.000Z',
    updated_at: '2020-11-25T12:59:57.000Z',
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
    Id: '2948',
    WI_Id: 10,
    Categories: JSON.stringify([category2.Category_Id, category3.Category_Id]),
    WI_Name: 'Sample Instruc',
    WI_Desc: null,
    Tools: null,
    Equipements: null,
    Locations: null,
    IsFavorite: false,
    CreatedBy: 'Tester One',
    EditedBy: 'Tester One',
    AssignedObjects: null,
    SpareParts: null,
    SafetyKit: null,
    created_at: '2020-11-24T09:59:26.000Z',
    updated_at: '2020-11-26T07:09:31.000Z',
    Published: false,
    IsPublishedTillSave: null,
    Cover_Image: image,
    categories: categories2,
    IsFromAudioOrVideoFile: false,
    IsAudioOrVideoFileDeleted: false,
    FilePath: null,
    FileType: null
  }
];

const drafts = [
  {
    Id: '2840',
    WI_Id: 3,
    Categories: JSON.stringify([category2.Category_Id, category3.Category_Id]),
    WI_Name: 'Gas Meter Installation And Activationzz',
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
    created_at: '2020-11-17T10:16:25.000Z',
    updated_at: '2020-11-24T13:18:21.000Z',
    Published: true,
    IsPublishedTillSave: false,
    Cover_Image: image,
    categories: categories2,
    IsFromAudioOrVideoFile: false,
    IsAudioOrVideoFileDeleted: false,
    FilePath: null,
    FileType: null
  },
  {
    Id: '2947',
    WI_Id: 9,
    Categories: JSON.stringify([category1.Category_Id]),
    WI_Name: 'Pole Inspection measure',
    WI_Desc: null,
    Tools: null,
    Equipements: null,
    Locations: null,
    IsFavorite: true,
    CreatedBy: 'Tester One',
    EditedBy: 'Tester Two',
    AssignedObjects: null,
    SpareParts: null,
    SafetyKit: null,
    created_at: '2020-11-24T05:34:23.000Z',
    updated_at: '2020-11-25T12:59:57.000Z',
    Published: false,
    IsPublishedTillSave: null,
    Cover_Image: image,
    categories: categories1,
    IsFromAudioOrVideoFile: false,
    IsAudioOrVideoFileDeleted: false,
    FilePath: null,
    FileType: null
  }
];

const info: ErrorInfo = { displayToast: false, failureResponse: 'throwError' };

describe('WorkInstructionsComponent', () => {
  let component: WorkInstructionsComponent;
  let fixture: ComponentFixture<WorkInstructionsComponent>;
  let instructionServiceSpy: InstructionService;
  let errorHandlerServiceSpy: ErrorHandlerService;
  let toastServiceSpy: ToastService;
  let base64HelperServiceSpy: Base64HelperService;
  let wiCommonServiceSpy: WiCommonService;
  let overlayServiceSpy: OverlayService;
  let commonServiceSpy: CommonService;
  let headerServiceSpy: HeaderService;
  let breadcrumbService: BreadcrumbService;
  let importServiceSpy: ImportService;
  let loginServiceSpy: LoginService;
  let homeDe: DebugElement;
  let homeEl: HTMLElement;

  beforeEach(waitForAsync(() => {
    instructionServiceSpy = jasmine.createSpyObj('InstructionService', [
      'getFavInstructions',
      'getDraftedInstructions',
      'getRecentInstructions',
      'uploadWIExcel'
    ]);
    errorHandlerServiceSpy = jasmine.createSpyObj('ErrorHandlerService', [
      'handleError'
    ]);
    toastServiceSpy = jasmine.createSpyObj('ToastService', ['show']);
    base64HelperServiceSpy = jasmine.createSpyObj('Base64HelperService', [
      'getBase64ImageData',
      'getBase64Image'
    ]);
    wiCommonServiceSpy = jasmine.createSpyObj('WiCommonService', [], {
      fetchWIAction$: of(true)
    });
    overlayServiceSpy = jasmine.createSpyObj('OverlayService', ['open']);
    commonServiceSpy = jasmine.createSpyObj('CommonService', [], {
      currentRouteUrlAction$: of('/work-instructions')
    });
    headerServiceSpy = jasmine.createSpyObj(
      'HeaderService',
      ['setHeaderTitle'],
      {
        headerTitleAction$: of(routingUrls.workInstructions.title)
      }
    );
    loginServiceSpy = jasmine.createSpyObj('LoginService', [], {
      loggedInUserInfo$: userInfo$
    });
    importServiceSpy = jasmine.createSpyObj('ImportService', ['importFile']);

    TestBed.configureTestingModule({
      declarations: [
        WorkInstructionsComponent,
        MockComponent(CategoriesComponent),
        TimeAgoPipe,
        DummyComponent,
        MockComponent(NgxSpinnerComponent)
      ],
      imports: [
        NgxPaginationModule,
        NgpSortModule,
        Ng2SearchPipeModule,
        RouterTestingModule,
        AppMaterialModules,
        FormsModule,
        SharedModule,
        BrowserAnimationsModule,
        NgxShimmerLoadingModule
      ],
      providers: [
        { provide: InstructionService, useValue: instructionServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: Base64HelperService, useValue: base64HelperServiceSpy },
        { provide: ErrorHandlerService, useValue: errorHandlerServiceSpy },
        { provide: WiCommonService, useValue: wiCommonServiceSpy },
        { provide: OverlayService, useValue: overlayServiceSpy },
        { provide: CommonService, useValue: commonServiceSpy },
        { provide: HeaderService, useValue: headerServiceSpy },
        { provide: LoginService, useValue: loginServiceSpy },
        { provide: ImportService, useValue: importServiceSpy }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    breadcrumbService = TestBed.inject(BreadcrumbService);
    fixture = TestBed.createComponent(WorkInstructionsComponent);
    component = fixture.componentInstance;
    homeDe = fixture.debugElement;
    homeEl = homeDe.nativeElement;
    (instructionServiceSpy.getFavInstructions as jasmine.Spy)
      .withArgs()
      .and.returnValue(of(favorites))
      .and.callThrough();
    (instructionServiceSpy.getDraftedInstructions as jasmine.Spy)
      .withArgs()
      .and.returnValue(of(drafts))
      .and.callThrough();
    (instructionServiceSpy.getRecentInstructions as jasmine.Spy)
      .withArgs()
      .and.returnValue(of([...favorites, ...drafts]))
      .and.callThrough();
    spyOn(breadcrumbService, 'set');
    spyOn(component, 'getAllFavsDraftsAndRecentIns');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should define varibales & set defaults', () => {
    expect(component.showMore).toBeDefined();
    expect(component.showMore).toBeFalse();
  });

  describe('template', () => {
    it('should contain lables, elements & attributes related to home', () => {
      spyOn(component, 'getBase64Images');
      (component.getAllFavsDraftsAndRecentIns as jasmine.Spy).and.callThrough();
      component.ngOnInit();
      fixture.detectChanges();
      const imgs = homeEl.querySelectorAll('.work-instructions-body img');
      expect(imgs[0].getAttribute('src')).toContain('createwi.svg');
      expect(imgs[1].getAttribute('src')).toContain('dropdown.svg');
      const input = homeEl.querySelectorAll('input');
      expect(input.length).toBe(2);
      expect(input[0].getAttribute('placeholder')).toBe(
        'Search by title or author'
      );
      const matButtonToggle = homeEl.querySelectorAll('mat-button-toggle');
      expect(matButtonToggle.length).toBe(2);
      expect(matButtonToggle[0].textContent).toContain(
        'CREATE WORK INSTRUCTION'
      );
      expect(matButtonToggle[0].getAttribute('routerLink')).toBe(
        '/work-instructions/create'
      );
      (matButtonToggle[1] as HTMLElement).click();
      expect(
        homeDe.query(By.css('#import')).nativeElement.textContent
      ).toContain('Import File');
      expect(homeDe.query(By.css('#copy')).nativeElement.textContent).toContain(
        'Copy Existing'
      );
      expect(
        homeDe.query(By.css('#export')).nativeElement.textContent
      ).toContain('Download Template');
      const buttons = homeEl.querySelectorAll('button');
      expect(buttons[2].getAttribute('ng-reflect-router-link')).toBe(
        '/work-instructions/drafts'
      );
      expect(buttons[3].getAttribute('ng-reflect-router-link')).toBe(
        '/work-instructions/favorites'
      );
      expect(homeEl.querySelectorAll('.drafts-favorites').length).toBe(1);
      expect(
        homeEl.querySelectorAll('.drafts-favorites')[0].textContent
      ).toContain('Drafts');
      expect(
        homeEl.querySelectorAll('.drafts-favorites')[0].textContent
      ).toContain('Favorites');
      expect(
        homeEl.querySelectorAll('.recents-favorites-lst-header').length
      ).toBe(2);
      expect(homeEl.querySelectorAll('.recents-favorites-list').length).toBe(2);
      expect(homeEl.querySelectorAll('.seeall-fixed').length).toBe(2);
      expect(homeEl.querySelectorAll('.seeall-fixed')[0].textContent).toContain(
        'SEE ALL'
      );
      expect(homeEl.querySelectorAll('.seeall-fixed')[1].textContent).toContain(
        'SEE ALL'
      );
      expect(homeEl.querySelectorAll('app-categories').length).toBe(1);
      expect(homeEl.querySelectorAll('router-outlet').length).toBe(1);
      expect(homeEl.querySelectorAll('app-dummy').length).toBe(2);
      expect(component.getBase64Images).toHaveBeenCalledTimes(2);
    });

    it('should display No Drafted/Favorite Instructions found in case of no data', () => {
      (instructionServiceSpy.getFavInstructions as jasmine.Spy)
        .withArgs()
        .and.returnValue(of([]))
        .and.callThrough();
      (instructionServiceSpy.getDraftedInstructions as jasmine.Spy)
        .withArgs()
        .and.returnValue(of([]))
        .and.callThrough();
      (component.getAllFavsDraftsAndRecentIns as jasmine.Spy).and.callThrough();
      component.ngOnInit();
      fixture.detectChanges();
      const imgs = homeEl.querySelectorAll('.work-instructions-body img');
      expect(imgs[0].getAttribute('src')).toContain('createwi.svg');
      expect(imgs[1].getAttribute('src')).toContain('dropdown.svg');
      const input = homeEl.querySelectorAll('input');
      expect(input.length).toBe(2);
      expect(input[0].getAttribute('placeholder')).toBe(
        'Search by title or author'
      );
      const matButtonToggle = homeEl.querySelectorAll('mat-button-toggle');
      expect(matButtonToggle.length).toBe(2);
      expect(matButtonToggle[0].textContent).toContain(
        'CREATE WORK INSTRUCTION'
      );
      expect(matButtonToggle[0].getAttribute('routerLink')).toBe(
        '/work-instructions/create'
      );
      (matButtonToggle[1] as HTMLElement).click();
      expect(
        homeDe.query(By.css('#import')).nativeElement.textContent
      ).toContain('Import File');
      expect(homeDe.query(By.css('#copy')).nativeElement.textContent).toContain(
        'Copy Existing'
      );
      expect(
        homeDe.query(By.css('#export')).nativeElement.textContent
      ).toContain('Download Template');
      expect(homeEl.querySelectorAll('.drafts-favorites').length).toBe(1);
      expect(
        homeEl.querySelectorAll('.drafts-favorites')[0].textContent
      ).toContain('Drafts');
      expect(
        homeEl.querySelectorAll('.drafts-favorites')[0].textContent
      ).toContain('Favorites');
      expect(
        homeEl.querySelectorAll('.recents-favorites-lst-header').length
      ).toBe(2);
      expect(homeEl.querySelectorAll('.recents-favorites-list').length).toBe(2);
      expect(homeEl.querySelectorAll('.no-fav').length).toBe(2);
      expect(homeEl.querySelectorAll('.no-fav')[0].textContent).toContain(
        'No Drafted Instructions found !!'
      );
      expect(homeEl.querySelectorAll('.no-fav')[1].textContent).toContain(
        'No Favorite Instructions found !!'
      );
      expect(homeEl.querySelectorAll('app-categories').length).toBe(1);
    });

    it('should display No Resulst found in case of search term not found in data', () => {
      (component.getAllFavsDraftsAndRecentIns as jasmine.Spy).and.callThrough();
      component.ngOnInit();
      const searchInput = homeEl.querySelector('input');
      searchInput.value = 'testing';
      searchInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      const imgs = homeEl.querySelectorAll('.work-instructions-body img');
      expect(imgs[0].getAttribute('src')).toContain('createwi.svg');
      expect(imgs[1].getAttribute('src')).toContain('dropdown.svg');
      const input = homeEl.querySelectorAll('input');
      expect(input.length).toBe(2);
      expect(input[0].getAttribute('placeholder')).toBe(
        'Search by title or author'
      );
      const matButtonToggle = homeEl.querySelectorAll('mat-button-toggle');
      expect(matButtonToggle.length).toBe(2);
      expect(matButtonToggle[0].textContent).toContain(
        'CREATE WORK INSTRUCTION'
      );
      expect(matButtonToggle[0].getAttribute('routerLink')).toBe(
        '/work-instructions/create'
      );
      (matButtonToggle[1] as HTMLElement).click();
      expect(
        homeDe.query(By.css('#import')).nativeElement.textContent
      ).toContain('Import File');
      expect(homeDe.query(By.css('#copy')).nativeElement.textContent).toContain(
        'Copy Existing'
      );
      expect(
        homeDe.query(By.css('#export')).nativeElement.textContent
      ).toContain('Download Template');
      expect(homeEl.querySelectorAll('.drafts-favorites').length).toBe(1);
      expect(
        homeEl.querySelectorAll('.drafts-favorites')[0].textContent
      ).toContain('Drafts');
      expect(
        homeEl.querySelectorAll('.drafts-favorites')[0].textContent
      ).toContain('Favorites');
      expect(
        homeEl.querySelectorAll('.recents-favorites-lst-header').length
      ).toBe(2);
      expect(homeEl.querySelectorAll('.recents-favorites-list').length).toBe(2);
      expect(homeEl.querySelectorAll('.no-fav').length).toBe(2);
      expect(homeEl.querySelectorAll('.no-fav')[0].textContent).toContain(
        'No Results Found !!'
      );
      expect(homeEl.querySelectorAll('.no-fav')[1].textContent).toContain(
        'No Results Found !!'
      );
      expect(homeEl.querySelectorAll('app-categories').length).toBe(1);
    });

    it('should display three instructions of each darfted/favorites if more then 3 instructions are present', () => {
      const draftsLatest = drafts.map((draft) => ({
        ...draft,
        Id: draft.Id + 10,
        WI_id: draft.Id + 10
      }));
      const favoritesLatest = favorites.map((favorite) => ({
        ...favorite,
        Id: favorite.Id + 10,
        WI_id: favorite.Id + 10
      }));
      const combineDrafts = [...drafts, ...draftsLatest];
      const combineFavorites = [...favorites, ...favoritesLatest];
      (instructionServiceSpy.getFavInstructions as jasmine.Spy)
        .withArgs()
        .and.returnValue(of(combineFavorites))
        .and.callThrough();
      (instructionServiceSpy.getDraftedInstructions as jasmine.Spy)
        .withArgs()
        .and.returnValue(of(combineDrafts))
        .and.callThrough();
      (component.getAllFavsDraftsAndRecentIns as jasmine.Spy).and.callThrough();
      component.ngOnInit();
      fixture.detectChanges();
      expect(homeEl.querySelectorAll('.drafts-favorites').length).toBe(1);
      expect(
        homeEl.querySelectorAll('.drafts-favorites')[0].textContent
      ).toContain('Drafts');
      expect(
        homeEl.querySelectorAll('.drafts-favorites')[0].textContent
      ).toContain('Favorites');
      expect(
        homeEl.querySelectorAll('.recents-favorites-lst-header').length
      ).toBe(2);
      expect(homeEl.querySelectorAll('.recents-favorites-list').length).toBe(2);
      expect(homeEl.querySelectorAll('.recents-favorites-list li').length).toBe(
        6
      );
      expect(
        homeEl.querySelectorAll('.recents-favorites-list li img').length
      ).toBe(6);
      expect(
        homeEl.querySelectorAll('.recents-favorites-list li a').length
      ).toBe(9);
      const li = homeEl.querySelectorAll('.recents-favorites-list li');
      expect(li[0].childNodes.length).toBe(3);
      expect(li[0].textContent).toContain(combineDrafts[1].WI_Name);
      expect(li[0].textContent).toContain(combineDrafts[1].categories.join());
      expect(li[0].textContent).toContain('Edited');
      expect(li[0].textContent).toContain(`by ${combineDrafts[1].EditedBy}`);
      expect(
        (li[0].childNodes[1].childNodes[0] as HTMLElement).getAttribute(
          'ng-reflect-router-link'
        )
      ).toBe(`/work-instructions/edit,${combineDrafts[1].Id}`);
      expect(li[3].childNodes.length).toBe(3);
      expect(li[3].textContent).toContain(combineFavorites[1].WI_Name);
      expect(li[3].textContent).toContain(
        combineFavorites[1].categories.join()
      );
      expect(li[3].textContent).toContain('Edited');
      expect(li[3].textContent).toContain(`by ${combineFavorites[1].EditedBy}`);
      expect(
        (li[3].childNodes[1].childNodes[0] as HTMLElement).getAttribute(
          'ng-reflect-router-link'
        )
      ).toContain(`/work-instructions/edit,${combineFavorites[1].Id}`);
    });

    it('should display work instructions home template if current route url is work instructions', () => {
      (component.getAllFavsDraftsAndRecentIns as jasmine.Spy).and.callThrough();

      component.ngOnInit();
      fixture.detectChanges();

      expect(
        homeEl.querySelector('.work-instructions-header').childNodes.length
      ).not.toBe(0);
    });

    it('should not display work instructions home template if current route url is not work instructions', () => {
      (component.getAllFavsDraftsAndRecentIns as jasmine.Spy).and.callThrough();
      (
        Object.getOwnPropertyDescriptor(
          commonServiceSpy,
          'currentRouteUrlAction$'
        ).get as jasmine.Spy
      ).and.returnValue(of('/work-instructions/drafts/hxhgyHj'));

      component.ngOnInit();
      fixture.detectChanges();

      expect(homeEl.querySelector('.content')).toBeNull();
    });
  });

  describe('getBase64Images', () => {
    it('should define function', () => {
      expect(component.getBase64Images).toBeDefined();
    });

    it('should call getBase64Image if Cover_Image is not from assets', () => {
      const { Id } = favorites[0];
      component.getBase64Images([
        { ...favorites[0], Cover_Image: 'Thumbnail.jpg' }
      ]);
      expect(base64HelperServiceSpy.getBase64ImageData).toHaveBeenCalledWith(
        'Thumbnail.jpg',
        Id
      );
      expect(base64HelperServiceSpy.getBase64ImageData).toHaveBeenCalledTimes(
        1
      );
      expect(base64HelperServiceSpy.getBase64Image).toHaveBeenCalledWith(
        'Thumbnail.jpg',
        Id
      );
      expect(base64HelperServiceSpy.getBase64Image).toHaveBeenCalledTimes(1);
    });
  });

  describe('getAllFavsDraftsAndRecentIns', () => {
    beforeEach(() => {
      (component.getAllFavsDraftsAndRecentIns as jasmine.Spy).and.callThrough();
    });

    it('should define function', () => {
      expect(component.getAllFavsDraftsAndRecentIns).toBeDefined();
    });

    it('should set work instructions observable', () => {
      component.getAllFavsDraftsAndRecentIns();
      fixture.detectChanges();
      expect(instructionServiceSpy.getFavInstructions).toHaveBeenCalledWith();
      expect(
        instructionServiceSpy.getDraftedInstructions
      ).toHaveBeenCalledWith();
      expect(
        instructionServiceSpy.getRecentInstructions
      ).toHaveBeenCalledWith();
      component.workInstructions$.subscribe((workInstructions) => {
        expect(workInstructions.drafts).toEqual(drafts);
        expect(workInstructions.favorites).toEqual(favorites);
        expect(workInstructions.recents).toEqual([...favorites, ...drafts]);
        expect(component.copyInstructionsData.favs).toEqual(favorites);
        expect(component.copyInstructionsData.recents).toEqual([
          ...favorites,
          ...drafts
        ]);
      });
    });
  });

  describe('bulkUploadDialog', () => {
    it('should define function', () => {
      expect(component.bulkUploadDialog).toBeDefined();
    });

    it('should open bulkupload component', () => {
      component.bulkUploadDialog(component.bulkUploadComponent, {
        ...importedWorkInstructions,
        isAudioOrVideoFile: false,
        successUrl: '/work-instructions/drafts',
        failureUrl: '/work-instructions'
      });
      expect(overlayServiceSpy.open).toHaveBeenCalledWith(
        component.bulkUploadComponent,
        {
          ...importedWorkInstructions,
          isAudioOrVideoFile: false,
          successUrl: '/work-instructions/drafts',
          failureUrl: '/work-instructions'
        }
      );
    });
  });

  describe('uploadFile', () => {
    it('should define function', () => {
      expect(component.uploadFile).toBeDefined();
    });

    it('should call uploadFile when click on import and selecting file', () => {
      spyOn(component, 'uploadFile');
      const matButtonToggle = homeEl.querySelectorAll('mat-button-toggle');
      (matButtonToggle[1] as HTMLElement).click();
      const importButton = homeDe.query(By.css('#import'))
        .nativeElement as HTMLElement;
      importButton.click();
      const upload = homeEl.querySelector('#upload');
      upload.dispatchEvent(new Event('change'));
      expect(component.uploadFile).toHaveBeenCalled();
    });

    it('should call bulkUploadDialog function on uploadWIExcel response', () => {
      const formData = new FormData();
      const file = new File([], 'excel-file.xlsx', {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      formData.append('file', file);
      const target = { files: [file] };
      const time = new Date().getTime();
      (instructionServiceSpy.uploadWIExcel as jasmine.Spy)
        .withArgs(formData)
        .and.returnValue(of(importedWorkInstructions))
        .and.callThrough();
      spyOn(component, 'bulkUploadDialog');
      spyOn(component, 'getS3Folder').and.returnValue(`bulkupload/${time}`);
      component.uploadFile({ target });
      expect(component.bulkUploadDialog).toHaveBeenCalledWith(
        component.bulkUploadComponent,
        {
          ...importedWorkInstructions,
          isAudioOrVideoFile: false,
          successUrl: '/work-instructions/drafts',
          failureUrl: '/work-instructions',
          s3Folder: `bulkupload/${time}`
        }
      );
    });

    it('should not call bulkUploadDialog function on uploadWIExcel empty response', () => {
      const formData = new FormData();
      const file = new File([], 'excel-file.xlsx', {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      formData.append('file', file);
      const target = { files: [file] };
      (instructionServiceSpy.uploadWIExcel as jasmine.Spy)
        .withArgs(formData)
        .and.returnValue(of([]))
        .and.callThrough();
      spyOn(component, 'bulkUploadDialog');
      component.uploadFile({ target });
      expect(component.bulkUploadDialog).not.toHaveBeenCalled();
    });
  });

  describe('resetFile', () => {
    it('should define function', () => {
      expect(component.resetFile).toBeDefined();
    });

    it('should call resetFile when click on import', () => {
      spyOn(component, 'resetFile').and.callThrough();
      const matButtonToggle = homeEl.querySelectorAll('mat-button-toggle');
      (matButtonToggle[1] as HTMLElement).click();
      const importButton = homeDe.query(By.css('#import'))
        .nativeElement as HTMLElement;
      importButton.click();
      expect(component.resetFile).toHaveBeenCalled();
    });
  });

  describe('ngOnInit', () => {
    it('should define function', () => {
      expect(component.ngOnInit).toBeDefined();
    });

    it('should call getAllFavsDraftsAndRecentIns', () => {
      component.ngOnInit();
      expect(component.getAllFavsDraftsAndRecentIns).toHaveBeenCalledWith();
    });

    it('should set header title & breadcrumb', () => {
      component.currentRouteUrl$.subscribe((data) => {
        expect(data).toBe(routingUrls.workInstructions.url);
        expect(headerServiceSpy.setHeaderTitle).toHaveBeenCalledWith(
          routingUrls.workInstructions.title
        );
      });
      expect(breadcrumbService.set).toHaveBeenCalledWith(
        routingUrls.workInstructions.url,
        { skip: true }
      );

      (
        Object.getOwnPropertyDescriptor(
          commonServiceSpy,
          'currentRouteUrlAction$'
        ).get as jasmine.Spy
      ).and.returnValue(of('/work-instructions/drafts/hxhgyHj'));

      component.ngOnInit();
      fixture.detectChanges();

      component.currentRouteUrl$.subscribe(() => {
        expect(breadcrumbService.set).toHaveBeenCalledWith(
          routingUrls.workInstructions.url,
          { skip: false }
        );
      });
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

  describe('getS3Folder', () => {
    it('should define function', () => {
      expect(component.getS3Folder).toBeDefined();
    });

    it('should return S3 folder path', () => {
      const time = new Date().getTime();
      expect(component.getS3Folder(time)).toBe(`bulkupload/${time}`);
    });
  });

  describe('ngOnDestroy', () => {
    it('should define function', () => {
      expect(component.ngOnDestroy).toBeDefined();
    });

    it('should unsubscribe subscription', () => {
      spyOn(<any>component['fetchWISubscription'], 'unsubscribe');
      component.ngOnDestroy();
      expect(
        component['fetchWISubscription'].unsubscribe
      ).toHaveBeenCalledWith();
    });
  });
});
