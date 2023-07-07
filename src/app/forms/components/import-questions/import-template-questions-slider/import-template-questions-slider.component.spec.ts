import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportTemplateQuestionsSliderComponent } from './import-template-questions-slider.component';

describe('ImportTemplateQuestionsSliderComponent', () => {
  let component: ImportTemplateQuestionsSliderComponent;
  let fixture: ComponentFixture<ImportTemplateQuestionsSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportTemplateQuestionsSliderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportTemplateQuestionsSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
