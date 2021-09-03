import { DebugElement } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MyOverlayRef } from '../../myoverlay-ref';
import { DeleteCategoryComponent } from './delete-category.component';

describe('DeleteCategoryComponent', () => {
  let component: DeleteCategoryComponent;
  let fixture: ComponentFixture<DeleteCategoryComponent>;
  let myOverlayRefSpy: MyOverlayRef;
  let deleteCategoryDe: DebugElement;
  let deleteCategoryEl: HTMLElement;

  beforeEach(waitForAsync(() => {
    myOverlayRefSpy = jasmine.createSpyObj('MyOverlayRef', ['close'], {
      data: {},
    });

    TestBed.configureTestingModule({
      declarations: [DeleteCategoryComponent],
      providers: [{ provide: MyOverlayRef, useValue: myOverlayRefSpy }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteCategoryComponent);
    component = fixture.componentInstance;
    deleteCategoryDe = fixture.debugElement;
    deleteCategoryEl = deleteCategoryDe.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('template', () => {
    it('should contain delete category template labels', () => {
      expect(
        deleteCategoryEl.querySelector('.modal-card-head').textContent
      ).toContain('Delete Category?');
      expect(
        deleteCategoryEl.querySelector('.modal-card-foot').textContent
      ).toContain('No');
      expect(
        deleteCategoryEl.querySelector('.modal-card-foot').textContent
      ).toContain('Yes');
      expect(deleteCategoryEl.querySelectorAll('button').length).toBe(2);

      const categoryName = 'Testing123';
      (Object.getOwnPropertyDescriptor(myOverlayRefSpy, 'data')
        .get as jasmine.Spy).and.returnValue({
        CId: 290,
        Category_Name: categoryName,
        Drafts_Count: 0,
        Published_Count: 0,
        Cover_Image: 'assets/CoverImages/coverimage3.png',
        selectedButton: 'no',
      });
      fixture.detectChanges();
      expect(
        deleteCategoryEl.querySelector('.modal-card-body').textContent
      ).toContain(`Do you want to delete category '${categoryName}' ?`);

      (Object.getOwnPropertyDescriptor(myOverlayRefSpy, 'data')
        .get as jasmine.Spy).and.returnValue({
        CId: 290,
        Category_Name: categoryName,
        Drafts_Count: 5,
        Published_Count: 5,
        Cover_Image: 'assets/CoverImages/coverimage3.png',
        selectedButton: 'no',
      });
      fixture.detectChanges();
      expect(
        deleteCategoryEl.querySelector('.modal-card-body').textContent
      ).toContain(
        `Category '${categoryName}' will be deleted. All work instructions will be available in the 'Unassigned' category. Do you want to continue?`
      );
    });
  });

  describe('close', () => {
    it('should define function', () => {
      expect(component.close).toBeDefined();
    });

    it('should set selectedButton "no" in case of CANCEL button', () => {
      const categoryName = 'Testing123';
      (Object.getOwnPropertyDescriptor(myOverlayRefSpy, 'data')
        .get as jasmine.Spy).and.returnValue({
        CId: 290,
        Category_Name: categoryName,
        Drafts_Count: 0,
        Published_Count: 0,
        Cover_Image: 'assets/CoverImages/coverimage3.png',
        selectedButton: 'no',
      });
      const buttons = deleteCategoryEl.querySelectorAll('button');
      buttons[0].click();
      expect(component.ref.data.selectedButton).toBe('no');
      expect(myOverlayRefSpy.close).toHaveBeenCalledWith(myOverlayRefSpy);
    });

    it('should set selectedButton "yes" in case of DELETE button', () => {
      const categoryName = 'Testing123';
      (Object.getOwnPropertyDescriptor(myOverlayRefSpy, 'data')
        .get as jasmine.Spy).and.returnValue({
        CId: 290,
        Category_Name: categoryName,
        Drafts_Count: 0,
        Published_Count: 0,
        Cover_Image: 'assets/CoverImages/coverimage3.png',
        selectedButton: 'no',
      });
      const buttons = deleteCategoryEl.querySelectorAll('button');
      buttons[1].click();
      expect(component.ref.data.selectedButton).toBe('yes');
      expect(myOverlayRefSpy.close).toHaveBeenCalledWith(myOverlayRefSpy);
    });
  });
});
