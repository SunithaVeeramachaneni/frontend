import { DebugElement } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MyOverlayRef } from '../myoverlay-ref';
import { DeleteCategoryComponent } from '../templates/delete-category/delete-category.component';

import { OverlayComponent } from './overlay.component';

describe('OverlayComponent', () => {
  let component: OverlayComponent;
  let fixture: ComponentFixture<OverlayComponent>;
  let myOverlayRefSpy: MyOverlayRef;
  let overlayComponentDe: DebugElement;
  let overlayComponentEl: HTMLElement;

  beforeEach(waitForAsync(() => {
    myOverlayRefSpy = jasmine.createSpyObj('MyOverlayRef', ['close'], {
      content: "string data",
      data: {}
    });

    TestBed.configureTestingModule({
      declarations: [ OverlayComponent ],
      imports: [ ReactiveFormsModule ],
      providers: [
        { provide: MyOverlayRef, useValue: myOverlayRefSpy }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverlayComponent);
    component = fixture.componentInstance;
    overlayComponentDe = fixture.debugElement;
    overlayComponentEl = overlayComponentDe.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('template', () => {
    it('should render for contentType string', () => {
      expect(overlayComponentEl.querySelector('div')).toHaveClass('modal-content');
      expect(overlayComponentEl.querySelectorAll('div').length).toBe(3);
    });

    it('should render for contentType component', () => {
      const delCatSubscribeComponent = DeleteCategoryComponent;
      (Object.getOwnPropertyDescriptor(myOverlayRefSpy, 'content')
        .get as jasmine.Spy).and.returnValue(delCatSubscribeComponent);
        const categoryName = 'Testing123';
      (Object.getOwnPropertyDescriptor(myOverlayRefSpy, 'data')
        .get as jasmine.Spy).and.returnValue({
        CId: 290,
        Category_Name: categoryName,
        WI_Count: 0,
        Cover_Image: 'assets/work-instructions-icons/CoverImages/coverimage3.png',
        selectedButton: 'no',
      });
      component.ngOnInit();
      fixture.detectChanges();
      expect(overlayComponentEl.querySelector('div')).toHaveClass('modal-content');
    });
  });

  describe('close', () => {
    it('should define function', () => {
      expect(component.close).toBeDefined();
    });

    it('should call close method on overlay ref', () => {
      component.close();
      expect(myOverlayRefSpy.close).toHaveBeenCalledWith(null);
    });
  });

  describe('ngOnInit', () => {
    it('should define function', () => {
      expect(component.ngOnInit).toBeDefined();
    });

    it('should set contentType to string if content is of type string', () => {
      expect(component.contentType).toBe('string');
    });

    it('should set contentType to component if content is of type neither string nor TemplateRef', () => {
      const delCatSubscribeComponent = DeleteCategoryComponent;
      (Object.getOwnPropertyDescriptor(myOverlayRefSpy, 'content')
        .get as jasmine.Spy).and.returnValue(delCatSubscribeComponent);
      component.ngOnInit();
      expect(component.contentType).toBe('component');
    });

    xit('should set contentType & context if content is of type TemplateRef', () => {
      // need to add code for test
    });
  });

});
