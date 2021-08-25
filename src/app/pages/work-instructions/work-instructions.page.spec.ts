import { HttpErrorResponse } from '@angular/common/http';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from 'ng-mocks';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgpSortModule } from 'ngp-sort-pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';
import { of, throwError } from 'rxjs';
import { ErrorInfo } from '../../interfaces/error-info';
import { AppMaterialModules } from '../../material.module';
import { TimeAgoPipe } from '../../pipes/time-ago.pipe';
import { Base64HelperService } from '../../shared/base64-helper.service';
import { DummyComponent } from '../../shared/components/dummy/dummy.component';
import { ToastService } from '../../shared/components/toast';
import { CategoriesComponent } from './categories/categories.component';
import { InstructionService } from './categories/workinstructions/instruction.service';
import { HomeComponent } from './home.component';

const categoryDetails = [
  {
    Category_Id: '_UnassignedCategory_',
    Category_Name: 'Unassigned',
    Cover_Image: 'assets/svg/Categories/default-category.png',
  },
  {
    Category_Id: 177,
    Category_Name: 'Health-Precautions',
    Cover_Image: 'assets/CoverImages/coverimage2.png',
  },
  {
    Category_Id: 178,
    Category_Name: 'Sample Category',
    Cover_Image: 'assets/CoverImages/coverimage3.png',
  }
];

const [category1, category2, category3] = categoryDetails;
const categories1 = [` ${category1.Category_Name}`];
const categories2 = [` ${category2.Category_Name}`, ` ${category3.Category_Name}`];
const image = '../assets/img/brand/doc-placeholder.png';

const favorites = [
  {
    Id: '2947',
    WI_Id: 9,
    Categories: JSON.stringify([category1]),
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
    categories: categories1
  },
  {
    Id: '2948',
    WI_Id: 10,
    Categories: JSON.stringify([category2, category3]),
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
    categories: categories2
  },
];

const drafts = [
  {
    Id: '2840',
    WI_Id: 3,
    Categories: JSON.stringify([category2, category3]),
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
    categories: categories2
  },
  {
    Id: '2947',
    WI_Id: 9,
    Categories: JSON.stringify([category1]),
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
    categories: categories1
  },
];

const info: ErrorInfo = { displayToast: false, failureResponse: 'throwError' };

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let spinnerSpy: NgxSpinnerService;
  let instructionServiceSpy: InstructionService;
  let toastServiceSpy: ToastService;
  let base64HelperServiceSpy: Base64HelperService;
  let homeDe: DebugElement;
  let homeEl: HTMLElement;

  beforeEach(async(() => {
    spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);
    instructionServiceSpy = jasmine.createSpyObj('InstructionService', [
      'getFavInstructions',
      'getDraftedInstructions',
      'getRecentInstructions',
      'uploadWIExcel',
      'handleError'
    ]);
    toastServiceSpy = jasmine.createSpyObj('ToastService', ['show']);
    base64HelperServiceSpy = jasmine.createSpyObj('Base64HelperService', ['getBase64ImageData', 'getBase64Image']);

    TestBed.configureTestingModule({
      declarations: [
        HomeComponent,
        MockComponent(CategoriesComponent),
        TimeAgoPipe,
        MockComponent(NgxSpinnerComponent),
        DummyComponent
      ],
      imports: [
        NgxPaginationModule,
        NgpSortModule,
        Ng2SearchPipeModule,
        RouterTestingModule,
        AppMaterialModules,
        FormsModule
      ],
      providers: [
        { provide: NgxSpinnerService, useValue: spinnerSpy },
        { provide: InstructionService, useValue: instructionServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: Base64HelperService, useValue: base64HelperServiceSpy },
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    homeDe = fixture.debugElement;
    homeEl = homeDe.nativeElement;
    (instructionServiceSpy.getFavInstructions as jasmine.Spy)
      .withArgs(info)
      .and.returnValue(of(favorites))
      .and.callThrough();
    (instructionServiceSpy.getDraftedInstructions as jasmine.Spy)
      .withArgs(info)
      .and.returnValue(of(drafts))
      .and.callThrough();
    (instructionServiceSpy.getRecentInstructions as jasmine.Spy)
      .withArgs(info)
      .and.returnValue(of([...favorites, ...drafts]))
      .and.callThrough();
    spyOn(component, 'getAllFavsDraftsAndRecentIns');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should define varibales & set defaults', () => {
    expect(component.wiDraftedList).toBeDefined();
    expect(component.wiDraftedList).toEqual([]);
    expect(component.wiFavList).toBeDefined();
    expect(component.wiFavList).toEqual([]);
    expect(component.showMore).toBeDefined();
    expect(component.showMore).toBeFalse();
  });

  describe('template', () => {
    it('should contain lables, elements & attributes related to home', () => {
      spyOn(component, 'getBase64Images');
      (component.getAllFavsDraftsAndRecentIns as jasmine.Spy).and.callThrough();
      component.ngOnInit();
      fixture.detectChanges();
      expect(homeEl.querySelectorAll('ngx-spinner').length).toBe(1);
      expect(homeEl.querySelector('.main-heading').textContent).toContain(
        'Work Instructions'
      );
      const imgs = homeEl.querySelectorAll('img');
      expect(imgs[0].getAttribute('src')).toContain('search.svg');
      expect(imgs[1].getAttribute('src')).toContain('createwi.svg');
      const input = homeEl.querySelectorAll('input');
      expect(input.length).toBe(2);
      expect(input[0].getAttribute('placeholder')).toBe(
        'Search by title or author'
      );
      const buttons = homeEl.querySelectorAll('button');
      expect(buttons.length).toBe(7);
      expect(buttons[0].textContent).toContain('CREATE NEW WORK INSTRUCTION');
      expect(buttons[0].getAttribute('routerLink')).toBe('/add-instruction');
      expect(buttons[1].textContent).toContain('Toggle Dropdown');
      expect(buttons[2].textContent).toContain('Import File');
      expect(buttons[3].textContent).toContain('Copy Existing');
      expect(buttons[4].textContent).toContain('Download Template');
      expect(buttons[5].getAttribute('ng-reflect-router-link')).toBe('/drafts,');
      expect(buttons[6].getAttribute('ng-reflect-router-link')).toBe(
        '/favorites,'
      );
      expect(homeEl.querySelectorAll('.recents-favorites-row').length).toBe(1);
      expect(
        homeEl.querySelectorAll('.recents-favorites-row')[0].textContent
      ).toContain('Drafts');
      expect(
        homeEl.querySelectorAll('.recents-favorites-row')[0].textContent
      ).toContain('Favorites');
      expect(
        homeEl.querySelectorAll('.recents-favorites-lst-header').length
      ).toBe(2);
      expect(homeEl.querySelectorAll('.recents-favorites-list').length).toBe(2);
      expect(homeEl.querySelectorAll('.seeall-fixed').length).toBe(2);
      expect(homeEl.querySelectorAll('.seeall-fixed')[0].textContent).toBe(
        'SEE ALL'
      );
      expect(homeEl.querySelectorAll('.seeall-fixed')[1].textContent).toBe(
        'SEE ALL'
      );
      expect(homeEl.querySelectorAll('app-categories').length).toBe(1);
      expect(homeEl.querySelectorAll('app-dummy').length).toBe(2);
      expect(component.getBase64Images).toHaveBeenCalledTimes(2);
    });

    it('should display No Drafted/Favorite Instructions found in case of no data', () => {
      expect(homeEl.querySelectorAll('ngx-spinner').length).toBe(1);
      expect(homeEl.querySelector('.main-heading').textContent).toContain(
        'Work Instructions'
      );
      const imgs = homeEl.querySelectorAll('img');
      expect(imgs[0].getAttribute('src')).toContain('search.svg');
      expect(imgs[1].getAttribute('src')).toContain('createwi.svg');
      const input = homeEl.querySelectorAll('input');
      expect(input.length).toBe(2);
      expect(input[0].getAttribute('placeholder')).toBe(
        'Search by title or author'
      );
      const buttons = homeEl.querySelectorAll('button');
      expect(buttons.length).toBe(5);
      expect(buttons[0].textContent).toContain('CREATE NEW WORK INSTRUCTION');
      expect(buttons[0].getAttribute('routerLink')).toBe('/add-instruction');
      expect(buttons[1].textContent).toContain('Toggle Dropdown');
      expect(buttons[2].textContent).toContain('Import File');
      expect(buttons[3].textContent).toContain('Copy Existing');
      expect(buttons[4].textContent).toContain('Download Template');
      const images = homeEl.querySelectorAll('button img');
      expect(images[0].getAttribute('src')).toContain('createwi.svg');
      expect(images[1].getAttribute('src')).toContain('save.svg');
      expect(images[2].getAttribute('src')).toContain('copy.svg');
      expect(images[3].getAttribute('src')).toContain('excel1.svg');
      expect(homeEl.querySelectorAll('.recents-favorites-row').length).toBe(1);
      expect(
        homeEl.querySelectorAll('.recents-favorites-row')[0].textContent
      ).toContain('Drafts');
      expect(
        homeEl.querySelectorAll('.recents-favorites-row')[0].textContent
      ).toContain('Favorites');
      expect(
        homeEl.querySelectorAll('.recents-favorites-lst-header').length
      ).toBe(2);
      expect(homeEl.querySelectorAll('.recents-favorites-list').length).toBe(2);
      expect(homeEl.querySelectorAll('app-categories').length).toBe(1);
    });

    it('should display three instructions of each darfted/favorites if more then 3 instructions are present', () => {
      const draftsLatest = drafts.map((draft) => ({
        ...draft,
        Id: draft.Id + 10,
        WI_id: draft.Id + 10,
      }));
      const favoritesLatest = favorites.map((favorite) => ({
        ...favorite,
        Id: favorite.Id + 10,
        WI_id: favorite.Id + 10,
      }));
      const combineDrafts = [...drafts, ...draftsLatest];
      const combineFavorites = [...favorites, ...favoritesLatest];
      (instructionServiceSpy.getFavInstructions as jasmine.Spy)
        .withArgs(info)
        .and.returnValue(of(combineFavorites))
        .and.callThrough();
      (instructionServiceSpy.getDraftedInstructions as jasmine.Spy)
        .withArgs(info)
        .and.returnValue(of(combineDrafts))
        .and.callThrough();
      (component.getAllFavsDraftsAndRecentIns as jasmine.Spy).and.callThrough();
      component.ngOnInit();
      fixture.detectChanges();
      expect(homeEl.querySelectorAll('.recents-favorites-row').length).toBe(1);
      expect(
        homeEl.querySelectorAll('.recents-favorites-row')[0].textContent
      ).toContain('Drafts');
      expect(
        homeEl.querySelectorAll('.recents-favorites-row')[0].textContent
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
      expect(li[0].textContent).toContain(`by ${combineDrafts[1].EditedBy}`);
      expect(
        (li[0].childNodes[1].childNodes[0] as HTMLElement).getAttribute(
          'ng-reflect-router-link'
        )
      ).toBe(`/drafts/add-instruction/,${combineDrafts[1].Id}`);

      expect(li[3].childNodes.length).toBe(3);
      expect(li[3].textContent).toContain(combineFavorites[1].WI_Name);
      expect(li[3].textContent).toContain(combineFavorites[1].categories.join());
      expect(li[3].textContent).toContain('Edited');
      expect(li[3].textContent).toContain(`by ${combineFavorites[1].EditedBy}`);
      expect(
        (li[3].childNodes[1].childNodes[0] as HTMLElement).getAttribute(
          'ng-reflect-router-link'
        )
      ).toContain(
        // `/favorites/add-instruction/,${combineFavorites[1].Id}`
        `/favorites/add-instruction/,`
      );
    });
  });

  describe('getBase64Images', () => {
    it('should define function', () => {
      expect(component.getBase64Images).toBeDefined();
    });

    it('should call getBase64Image if Cover_Image is not from assets', () => {
      component.getBase64Images([{...favorites[0], Cover_Image: 'Thumbnail.jpg' }]);
      expect(base64HelperServiceSpy.getBase64ImageData).toHaveBeenCalledWith('Thumbnail.jpg');
      expect(base64HelperServiceSpy.getBase64ImageData).toHaveBeenCalledTimes(1);
      expect(base64HelperServiceSpy.getBase64Image).toHaveBeenCalledWith('Thumbnail.jpg');
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

    it('should set work instructions favorites and drafts list', () => {
      component.getAllFavsDraftsAndRecentIns();
      fixture.detectChanges();
      expect(instructionServiceSpy.getFavInstructions).toHaveBeenCalledWith(info);
      expect(
        instructionServiceSpy.getDraftedInstructions
      ).toHaveBeenCalledWith(info);
      expect(spinnerSpy.show).toHaveBeenCalledWith();
      expect(spinnerSpy.hide).toHaveBeenCalledWith();
      expect(component.wiFavList).toEqual(favorites);
      expect(component.wiDraftedList).toEqual(drafts);
      expect(component.wiRecentList).toEqual([...favorites, ...drafts]);
    });

    it('should handle error while setting work instructions', () => {
      (instructionServiceSpy.getFavInstructions as jasmine.Spy)
        .withArgs(info)
        .and.returnValue(throwError({message: 'Unable to retrive favorites'}))
        .and.callThrough();
      (instructionServiceSpy.getDraftedInstructions as jasmine.Spy)
        .withArgs(info)
        .and.returnValue(throwError({message: 'Unable to retrive drafts'}))
        .and.callThrough();
      component.getAllFavsDraftsAndRecentIns();
      fixture.detectChanges();
      expect(instructionServiceSpy.getFavInstructions).toHaveBeenCalledWith(info);
      expect(
        instructionServiceSpy.getDraftedInstructions
      ).toHaveBeenCalledWith(info);
      expect(instructionServiceSpy.handleError).toHaveBeenCalledWith({message: 'Unable to retrive favorites'} as HttpErrorResponse);
      expect(spinnerSpy.show).toHaveBeenCalledWith();
      expect(spinnerSpy.hide).toHaveBeenCalledWith();
      expect(component.wiFavList).toEqual([]);
      expect(component.wiDraftedList).toEqual([]);
    });
  });

  describe('ngOnInit', () => {
    it('should define function', () => {
      expect(component.ngOnInit).toBeDefined();
    });

    it('should call getAllFavsDraftsAndRecentIns', () => {
      component.ngOnInit();
      expect(
        component.getAllFavsDraftsAndRecentIns
      ).toHaveBeenCalledWith();
    });
  });

  describe('ngOnDestroy', () => {
    it('should define function', () => {
      expect(component.ngOnDestroy).toBeDefined();
    });

    it('should unsubscribe subscription', () => {
      (component.getAllFavsDraftsAndRecentIns as jasmine.Spy).and.callThrough();
      component.getAllFavsDraftsAndRecentIns();
      spyOn(component['getAllFavAndDraftInstSubscription'], 'unsubscribe');
      component.ngOnDestroy();
      expect(component['getAllFavAndDraftInstSubscription'].unsubscribe).toHaveBeenCalledWith();
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
});
