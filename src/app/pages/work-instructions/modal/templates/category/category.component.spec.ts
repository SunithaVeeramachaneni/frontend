import { HttpErrorResponse } from '@angular/common/http';
import { DebugElement } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  AbstractControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { ErrorInfo } from '../../../../../interfaces';
import { AppMaterialModules } from '../../../../../material.module';
import { Base64HelperService } from '../../../services/base64-helper.service';
import { CategoryService } from '../../../services/category.service';
import { InstructionService } from '../../../services/instruction.service';
import { COVER_IMAGES } from '../../constants';
import { MyOverlayRef } from '../../myoverlay-ref';
import { CategoryComponent } from './category.component';

interface MockFile {
  name: string;
  body: string;
  mimeType: string;
}

const createFileFromMockFile = (file: MockFile): File => {
  const blob = new Blob([file.body], { type: file.mimeType }) as any;
  blob['lastModifiedDate'] = new Date();
  blob['name'] = file.name;
  return blob as File;
};

const createMockFileList = (files: MockFile[]) => {
  const fileList: FileList = {
    length: files.length,
    item(index: number): File {
      return fileList[index];
    },
  };
  files.forEach(
    (file, index) => (fileList[index] = createFileFromMockFile(file))
  );

  return fileList;
};
const info: ErrorInfo = { displayToast: false, failureResponse: 'throwError' };

describe('CategoryComponent', () => {
  let component: CategoryComponent;
  let fixture: ComponentFixture<CategoryComponent>;
  let categoryDe: DebugElement;
  let categoryEl: HTMLElement;
  let myOverlayRefSpy: MyOverlayRef;
  let spinnerSpy: NgxSpinnerService;
  let instructionServiceSpy: InstructionService;
  let categoryServiceSpy: CategoryService;
  let base64HelperServiceSpy: Base64HelperService;

  beforeEach(waitForAsync(() => {
    myOverlayRefSpy = jasmine.createSpyObj('MyOverlayRef', ['close'], {
      data: {},
    });
    spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);
    instructionServiceSpy = jasmine.createSpyObj('InstructionService', [
      'uploadAttachments',
      'getCategoriesByName',
      'getErrorMessage'
    ]);
    categoryServiceSpy = jasmine.createSpyObj('CategoryService', [
      'setDeleteFiles',
    ]);
    base64HelperServiceSpy = jasmine.createSpyObj('Base64HelperService', ['getBase64ImageData', 'getBase64Image']);

    TestBed.configureTestingModule({
      declarations: [CategoryComponent],
      imports: [ReactiveFormsModule, AppMaterialModules],
      providers: [
        { provide: MyOverlayRef, useValue: myOverlayRefSpy },
        { provide: NgxSpinnerService, useValue: spinnerSpy },
        { provide: InstructionService, useValue: instructionServiceSpy },
        { provide: CategoryService, useValue: categoryServiceSpy },
        { provide: Base64HelperService, useValue: base64HelperServiceSpy },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryComponent);
    component = fixture.componentInstance;
    categoryDe = fixture.debugElement;
    categoryEl = categoryDe.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should define variables & set defaults', () => {
    expect(component.files).toBeDefined();
    expect(component.title).toBeDefined();
    expect(component.frmSubscribe).toBeDefined();
    expect(component.coverImages).toBeDefined();
    expect(component.coverImages).toEqual(COVER_IMAGES);
    expect(component.imageHeight).toBeDefined();
  });

  describe('template', () => {
    it('should contain catgory tempate labels', () => {
      expect(categoryEl.querySelector('.modal-header').textContent).toContain(
        'Add New Category'
      );
      expect(categoryEl.querySelector('.modal-body').textContent).toContain(
        'Title'
      );
      expect(categoryEl.querySelector('.modal-body').textContent).toContain(
        'Cover Image'
      );
      expect(categoryEl.querySelector('.modal-body').textContent).toContain(
        'Upload your own'
      );
      expect(categoryEl.querySelector('.modal-footer').textContent).toContain(
        'SAVE'
      );
      expect(categoryEl.querySelector('img').getAttribute('src')).toContain(
        'upload.svg'
      );
      expect(categoryEl.querySelectorAll('img').length).toBe(
        component.coverImages.length + 1
      );
      component.files = ['s3-coverimage.png'];
      fixture.detectChanges();
      expect(categoryEl.querySelectorAll('img').length).toBe(
        component.coverImages.length + 2
      );
    });

    it('should display error messages based on title errors', () => {
      component.f.title.setValue('');
      component.f.title.markAsDirty();
      component.f.title.markAsTouched();
      fixture.detectChanges();
      expect(categoryEl.querySelector('.invalid-feedback').textContent).toBe(
        'Title is required'
      );

      component.f.title.setValue('a');
      component.f.title.markAsDirty();
      component.f.title.markAsTouched();
      fixture.detectChanges();
      expect(categoryEl.querySelector('.invalid-feedback').textContent).toBe(
        'Title must be at least 3 characters'
      );

      component.f.title.setValue(
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi reiciendis quae, a ratione sint culpa ab perspiciatis odio facere aperiam rerum consequatur tempore consectetur totam adipisci magni quibusdam repellendus. Esse?'
      );
      component.f.title.markAsDirty();
      component.f.title.markAsTouched();
      fixture.detectChanges();
      expect(categoryEl.querySelector('.invalid-feedback').textContent).toBe(
        'Title must be at the max of 48 characters'
      );

      const categoryName = 'TestCategory';
      (instructionServiceSpy.getCategoriesByName as jasmine.Spy)
        .withArgs(categoryName)
        .and.returnValue(of([{ Category_Id: 123, Category_Name: categoryName, Cover_Image: 'image.png' }]));
      component.f.title.setValue(categoryName);
      component.f.title.markAsDirty();
      component.f.title.markAsTouched();
      fixture.detectChanges();
      expect(categoryEl.querySelector('.invalid-feedback').textContent).toBe(
        'Category name already exists'
      );
    });
  });

  describe('ngOnInit', () => {
    it('should define function', () => {
      expect(component.ngOnInit).toBeDefined();
    });

    it('should set default form values for new category', () => {
      component.ngOnInit();
      expect(component.f.cid.value).toBe('');
      expect(component.f.title.value).toBe('');
      expect(component.f.coverImage.value).toBe(component.coverImages[0]);
      expect(component.files).toEqual([]);
      expect(component.title).toBe('Add New Category');
    });

    it('should set form values for edit category', () => {
      const CId = 123;
      const Category_Name = 'Test Category';
      const Cover_Image = component.coverImages[2];
      (Object.getOwnPropertyDescriptor(myOverlayRefSpy, 'data')
        .get as jasmine.Spy).and.returnValue({
        CId,
        Category_Name,
        Cover_Image,
      });
      (instructionServiceSpy.getCategoriesByName as jasmine.Spy)
        .withArgs(Category_Name)
        .and.returnValue(of([{ Category_Id: CId, Category_Name, Cover_Image }]));
      component.ngOnInit();
      expect(component.f.cid.value).toBe(CId);
      expect(component.f.title.value).toBe(Category_Name);
      expect(component.f.coverImage.value).toBe(Cover_Image);
      expect(component.files).toEqual([]);
      expect(component.title).toBe('Edit Category');
      expect(instructionServiceSpy.getCategoriesByName).toHaveBeenCalledWith(
        Category_Name
      );
    });

    it('should set form values & files for edit category', () => {
      const CId = 123;
      const Category_Name = 'Test Category';
      const Cover_Image = 's3-coverimage.jpg';
      (Object.getOwnPropertyDescriptor(myOverlayRefSpy, 'data')
        .get as jasmine.Spy).and.returnValue({
        CId,
        Category_Name,
        Cover_Image,
      });
      (instructionServiceSpy.getCategoriesByName as jasmine.Spy)
        .withArgs(Category_Name)
        .and.returnValue(of([{ Category_Id: CId, Category_Name, Cover_Image }]));
      component.ngOnInit();
      expect(component.f.cid.value).toBe(CId);
      expect(component.f.title.value).toBe(Category_Name);
      expect(component.f.coverImage.value).toBe(Cover_Image);
      expect(component.files).toEqual([Cover_Image]);
      expect(component.title).toBe('Edit Category');
      expect(instructionServiceSpy.getCategoriesByName).toHaveBeenCalledWith(
        Category_Name
      );
    });

    it('should handle coverImage value changes', () => {
      const CId = 123;
      const Category_Name = 'Test Category';
      const Cover_Image = 's3-coverimage.jpg';
      (Object.getOwnPropertyDescriptor(myOverlayRefSpy, 'data')
        .get as jasmine.Spy).and.returnValue({
        CId,
        Category_Name,
        Cover_Image,
      });
      (instructionServiceSpy.getCategoriesByName as jasmine.Spy)
        .withArgs(Category_Name)
        .and.returnValue(of([{ Category_Id: CId, Category_Name, Cover_Image }]));
      component.ngOnInit();
      component.f.coverImage.setValue(component.coverImages[1]);
      expect(component.f.coverImage.value).toBe(Cover_Image);
    });

    it('should handle coverImage value changes in case of existing cover image from assets', () => {
      const CId = 123;
      const Category_Name = 'Test Category';
      const Cover_Image = component.coverImages[2];
      (Object.getOwnPropertyDescriptor(myOverlayRefSpy, 'data')
        .get as jasmine.Spy).and.returnValue({
        CId,
        Category_Name,
        Cover_Image,
      });
      (instructionServiceSpy.getCategoriesByName as jasmine.Spy)
        .withArgs(Category_Name)
        .and.returnValue(of([{ Category_Id: CId, Category_Name, Cover_Image }]));
      component.ngOnInit();
      component.f.coverImage.setValue(component.coverImages[3]);
      expect(component.f.coverImage.value).toBe(component.coverImages[3]);
    });
  });

  describe('ngAfterViewInit', () => {
    it('should define function', () => {
      expect(component.ngAfterViewInit).toBeDefined();
    });

    it('should set imageHeight', () => {
      // expect(component.imageHeight).toBe('67px');
      expect(component.imageHeight).toBeDefined();
    });
  });

  describe('f', () => {
    it('should define variable', () => {
      expect(component.f).toBeDefined();
    });

    it('should has form controls', () => {
      expect(component.f.cid).toBeDefined();
      expect(component.f.title).toBeDefined();
      expect(component.f.coverImage).toBeDefined();
    });
  });

  describe('uploadFile', () => {
    it('should define function', () => {
      expect(component.uploadFile).toBeDefined();
    });

    it('should upload file', () => {
      const image = 'test.jpeg';
      (instructionServiceSpy.uploadAttachments as jasmine.Spy).and.returnValue(
        of({ image })
      );
      spyOn(component.frmSubscribe, 'patchValue');
      const fileList = createMockFileList([
        {
          body: 'test',
          mimeType: 'image/jpeg',
          name: image,
        },
      ]);
      component.uploadFile(fileList);
      expect(spinnerSpy.show).toHaveBeenCalledWith();
      expect(spinnerSpy.hide).toHaveBeenCalledWith();
      expect(instructionServiceSpy.uploadAttachments).toHaveBeenCalled();
      expect(instructionServiceSpy.uploadAttachments).toHaveBeenCalledTimes(1);
      expect(base64HelperServiceSpy.getBase64Image).toHaveBeenCalledWith(image);
      expect(component.files).toEqual([image]);
      expect(component.frmSubscribe.patchValue).toHaveBeenCalledWith({
        coverImage: image,
      });
    });

    it('should handle file upload file error', () => {
      const image = 'test.jpeg';
      (instructionServiceSpy.uploadAttachments as jasmine.Spy).and.returnValue(
        throwError({ message: 'Unable to uplaod file' })
      );
      spyOn(component.frmSubscribe, 'patchValue');
      spyOn(Swal, 'fire');
      const fileList = createMockFileList([
        {
          body: 'test',
          mimeType: 'image/jpeg',
          name: image,
        },
      ]);
      component.uploadFile(fileList);
      expect(spinnerSpy.show).toHaveBeenCalledWith();
      expect(spinnerSpy.hide).toHaveBeenCalledWith();
      expect(instructionServiceSpy.uploadAttachments).toHaveBeenCalled();
      expect(instructionServiceSpy.uploadAttachments).toHaveBeenCalledTimes(1);
      expect(component.files).toEqual([]);
      expect(component.frmSubscribe.patchValue).not.toHaveBeenCalled();
      expect(Swal.fire).toHaveBeenCalled();
      expect(instructionServiceSpy.getErrorMessage).toHaveBeenCalledWith({message: 'Unable to uplaod file'} as HttpErrorResponse);
      // expect(Swal.fire).toHaveBeenCalledWith("Sorry", 'Unable to uplaod file', 'error');
    });
  });

  describe('deleteAttachment', () => {
    it('should define function', () => {
      expect(component.deleteAttachment).toBeDefined();
    });

    it('should delete uploaded attachment', () => {
      spyOn(component, 'deleteAttachment').and.callThrough();
      spyOn(component.frmSubscribe, 'patchValue').and.callThrough();
      const file = 's3-coverimage.jpg';
      component.files = [file];
      fixture.detectChanges();
      categoryEl.querySelector('button').click();
      expect(component.deleteAttachment).toHaveBeenCalledWith(0);
      expect(categoryServiceSpy.setDeleteFiles).toHaveBeenCalledWith(file);
      expect(component.files).toEqual([]);
      expect(component.frmSubscribe.patchValue).toHaveBeenCalledWith({
        coverImage: component.coverImages[0],
      });
    });
  });

  describe('onSubmit', () => {
    it('should define function', () => {
      expect(component.onSubmit).toBeDefined();
    });

    it('should close the modal while submitting valid form', () => {
      const categoryName = 'TestCategory';
      (instructionServiceSpy.getCategoriesByName as jasmine.Spy)
        .withArgs(categoryName)
        .and.returnValue(of([]));
      spyOn(component, 'onSubmit').and.callThrough();
      const inputs = categoryEl.querySelectorAll('input');
      inputs[1].value = categoryName;
      inputs[1].dispatchEvent(new Event('input'));
      categoryEl.querySelector('button').click();
      expect(component.onSubmit).toHaveBeenCalledWith();
      expect(instructionServiceSpy.getCategoriesByName).toHaveBeenCalledWith(
        categoryName
      );
      expect(component.categoryValidatedMsg).toBe('');
      expect(component.frmSubscribe.invalid).toBeFalse();
      expect(myOverlayRefSpy.close).toHaveBeenCalledWith({
        cid: '',
        title: categoryName,
        coverImage: COVER_IMAGES[0],
      });
      expect(component.f.title.errors).toBeNull();
    });

    it('should not close the modal while submitting the invalid form if title is empty', () => {
      const categoryName = '';
      (instructionServiceSpy.getCategoriesByName as jasmine.Spy)
        .withArgs(categoryName)
        .and.returnValue(of([]));
      spyOn(component, 'onSubmit').and.callThrough();
      const inputs = categoryEl.querySelectorAll('input');
      inputs[1].value = categoryName;
      inputs[1].dispatchEvent(new Event('input'));
      categoryEl.querySelector('button').click();
      expect(component.onSubmit).toHaveBeenCalledWith();
      expect(instructionServiceSpy.getCategoriesByName).not.toHaveBeenCalled();
      expect(component.frmSubscribe.invalid).toBeTrue();
      expect(myOverlayRefSpy.close).not.toHaveBeenCalled();
      expect(component.f.title.errors.required).toBeTrue();
    });

    it('should not close the modal while submitting the invalid form if title already exists', () => {
      const categoryName = 'TestCategory';
      (instructionServiceSpy.getCategoriesByName as jasmine.Spy)
        .withArgs(categoryName)
        .and.returnValue(of([{ Category_Id: 123, Category_Name: categoryName, Cover_Image: 'image.png' }]));
      spyOn(component, 'onSubmit').and.callThrough();
      const inputs = categoryEl.querySelectorAll('input');
      inputs[1].value = categoryName;
      inputs[1].dispatchEvent(new Event('input'));
      categoryEl.querySelector('button').click();
      expect(component.onSubmit).toHaveBeenCalledWith();
      expect(instructionServiceSpy.getCategoriesByName).toHaveBeenCalledWith(
        categoryName
      );
      expect(component.frmSubscribe.invalid).toBeTrue();
      expect(myOverlayRefSpy.close).not.toHaveBeenCalled();
      expect(component.f.title.errors.categoryNameExists).toBeTrue();
    });
  });

  describe('cancel', () => {
    it('should define function', () => {
      expect(component.cancel).toBeDefined();
    });

    it('should close the modal', () => {
      spyOn(component, 'cancel').and.callThrough();
      categoryEl.querySelector('a').click();
      expect(component.cancel).toHaveBeenCalledWith();
      expect(myOverlayRefSpy.close).toHaveBeenCalledWith(null);
    });
  });

  describe('getImageSrc', () => {
    it('should define function', () => {
      expect(component.getImageSrc).toBeDefined();
    });

    it('should call getBase64ImageData', () => {
      const src = 'image.jpg';
      component.getImageSrc(src);
      expect(base64HelperServiceSpy.getBase64ImageData).toHaveBeenCalledWith(src);
    });
  });

  describe('getS3CoverImageHeight', () => {
    it('should define function', () => {
      expect(component.getS3CoverImageHeight).toBeDefined();
    });

    it('should return height as imageHeight if imageHeight is set', () => {
      component.imageHeight = '50px';
      expect(component.getS3CoverImageHeight()).toEqual({
        height: '50px',
      });
    });

    it('should return height as 100% if imageHeight is not set', () => {
      component.imageHeight = undefined;
      expect(component.getS3CoverImageHeight()).toEqual({
        height: '100%',
      });
    });
  });

  describe('validateCategoryName', () => {
    it('should define function', () => {
      expect(component.validateCategoryName).toBeDefined();
    });

    it('should validate category name if exists return categoryNameExists value true', () => {
      const categoryName = 'TestCategory';
      (instructionServiceSpy.getCategoriesByName as jasmine.Spy)
        .withArgs(categoryName)
        .and.returnValue(of([{ Category_Id: 123, Category_Name: categoryName, Cover_Image: 'image.png' }]));
      const value = { value: categoryName } as AbstractControl;
      component.validateCategoryName(value).subscribe((data) => {
        expect(data).toEqual({ categoryNameExists: true });
      });
      expect(instructionServiceSpy.getCategoriesByName).toHaveBeenCalledWith(
        categoryName
      );
    });

    it('should validate category name if not exists return null', () => {
      const categoryName = 'LatestTestCategory';
      (instructionServiceSpy.getCategoriesByName as jasmine.Spy)
        .withArgs(categoryName)
        .and.returnValue(of([]));
      const value = { value: categoryName } as AbstractControl;
      component.validateCategoryName(value).subscribe((data) => {
        expect(data).toBeNull();
      });
      expect(instructionServiceSpy.getCategoriesByName).toHaveBeenCalledWith(
        categoryName
      );
    });
  });
});
