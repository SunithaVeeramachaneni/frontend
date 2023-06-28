import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IphoneForEmbeddedFormsComponent } from './iphone-for-embedded-forms.component';

describe('IphoneForEmbeddedFormsComponent', () => {
  let component: IphoneForEmbeddedFormsComponent;
  let fixture: ComponentFixture<IphoneForEmbeddedFormsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IphoneForEmbeddedFormsComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IphoneForEmbeddedFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
