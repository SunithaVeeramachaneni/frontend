import { waitForAsync, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgpSortModule } from 'ngp-sort-pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSpinnerService } from 'ngx-spinner';
import { AppMaterialModules } from '../../../../../material.module';
import { ToastService } from '../../../../../shared/toast';
import { InstructionService } from '../../../services/instruction.service';
import { MyOverlayRef } from '../../myoverlay-ref';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CopyInstructionComponent } from './copy-instruction.component';
import {of} from "rxjs";
import {DebugElement} from "@angular/core";
import { CustomPaginationControlsComponent } from '../../../../../shared/components/custom-pagination-controls/custom-pagination-controls.component';
import { FormsModule } from '@angular/forms';
import { Base64HelperService } from '../../../services/base64-helper.service';
import { DummyComponent } from '../../../../../shared/components/dummy/dummy.component';
import { DropDownFilterPipe } from '../../../../../shared/pipes/dropdown-filter.pipe';

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

const recentsAndFavsObject = {
  recents: [
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
      categories: categories1
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
      categories: categories2
    }
  ]
};

describe('CopyInstructionComponent', () => {
  let component: CopyInstructionComponent;
  let fixture: ComponentFixture<CopyInstructionComponent>;
  let copyInstructionDe: DebugElement;
  let copyInstructionEl: HTMLElement;
  let myOverlayRefSpy: MyOverlayRef;
  let spinnerSpy: NgxSpinnerService;
  let toastServiceSpy: ToastService;
  let instructionServiceSpy: InstructionService;
  let base64HelperServiceSpy: Base64HelperService;

  const title = 'sample1';
  const user = 'author';

  beforeEach(waitForAsync(() => {
    myOverlayRefSpy = jasmine.createSpyObj('MyOverlayRef', ['close'], {
      data: {},
    });
    spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'close']);
    toastServiceSpy = jasmine.createSpyObj('ToastService', ['show']);
    instructionServiceSpy = jasmine.createSpyObj('InstructionService', ['copyWorkInstruction', 'getUsers']);
    base64HelperServiceSpy = jasmine.createSpyObj('Base64HelperService', ['getBase64ImageData', 'getBase64Image']);

    TestBed.configureTestingModule({
      declarations: [ CopyInstructionComponent, CustomPaginationControlsComponent, DummyComponent, DropDownFilterPipe ],
      imports: [
        NgxPaginationModule,
        NgpSortModule,
        Ng2SearchPipeModule,
        AppMaterialModules,
        BrowserAnimationsModule,
        FormsModule
      ],
      providers: [
        { provide: MyOverlayRef, useValue: myOverlayRefSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: InstructionService, useValue: instructionServiceSpy },
        { provide: Base64HelperService, useValue: base64HelperServiceSpy }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyInstructionComponent);
    component = fixture.componentInstance;
    copyInstructionDe = fixture.debugElement;
    copyInstructionEl = copyInstructionDe.nativeElement;
    (instructionServiceSpy.getUsers as jasmine.Spy)
      .withArgs()
      .and.returnValue(of(users))
      .and.callThrough();
    (instructionServiceSpy.copyWorkInstruction as jasmine.Spy)
      .withArgs()
      .and.returnValue(of(recentsAndFavsObject.recents))
      .and.callThrough();
   });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should define function', () => {
    expect(component.filterByAuthors).toBeDefined();
  });

  it('should define and call copy work instruction function', () => {
    expect(component.copyInstruction).toBeDefined();
    component.ngOnInit();
    expect(copyInstructionEl.querySelectorAll('button span').length).toBe(1);
  });

  it('should define copyWorkInstruction method in service', fakeAsync(() => {
    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();
    fixture.detectChanges();
    tick();
    expect(instructionServiceSpy.copyWorkInstruction).toBeDefined();
  }));

  it('should set author details', () => {
    const authors = users.map(
      (userData) => `${userData.first_name} ${userData.last_name}`
    );
    component.filterByAuthors();
    expect(instructionServiceSpy.getUsers).toHaveBeenCalledWith();
    expect(component.authors).toEqual(authors);
  });

  it('should define recents and favs object', () => {
    (Object.getOwnPropertyDescriptor(myOverlayRefSpy, 'data')
      .get as jasmine.Spy).and.returnValue(recentsAndFavsObject);
    fixture.detectChanges();
    expect(component.recentsAndFavsObject).toBeDefined();
  });

  describe('template', () => {
    it('should contain Copy Work Instruction title in Header', () => {
      const { recents } = recentsAndFavsObject;
      const [recent, fav] = recents;
      (Object.getOwnPropertyDescriptor(myOverlayRefSpy, 'data')
        .get as jasmine.Spy).and.returnValue({
          recents: [{...recent, Cover_Image: 'Thumbnail.jpg'}],
          favs: [{...fav, Cover_Image: 'Thumbnail.jpg', IsFavorite: true}]
        });
      fixture.detectChanges();
      expect(
        copyInstructionEl.querySelector('.modal-header').textContent
      ).toContain('Copy Work Instructions');
      expect(copyInstructionEl.querySelectorAll('app-dummy').length).toBe(1);
    });
    it('should define close function', () => {
      expect(component.close).toBeDefined();
    });

    it('should call getBase64Image if Cover_Image is not from assets', () => {
      const { recents } = recentsAndFavsObject;
      const [recent, fav] = recents;
      (Object.getOwnPropertyDescriptor(myOverlayRefSpy, 'data')
        .get as jasmine.Spy).and.returnValue({
          recents: [{...recent, Cover_Image: 'Thumbnail.jpg'}],
          favs: [{...fav, Cover_Image: 'Thumbnail.jpg', IsFavorite: true}]
        });
      fixture.detectChanges();
      expect(base64HelperServiceSpy.getBase64ImageData).toHaveBeenCalledWith('Thumbnail.jpg');
      expect(base64HelperServiceSpy.getBase64Image).toHaveBeenCalledWith('Thumbnail.jpg');
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
