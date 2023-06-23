import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewForEmbeddedFormsComponent } from './preview-for-embedded-forms.component';

describe('PreviewForEmbeddedFormsComponent', () => {
  let component: PreviewForEmbeddedFormsComponent;
  let fixture: ComponentFixture<PreviewForEmbeddedFormsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewForEmbeddedFormsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewForEmbeddedFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
