import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportQuestionsSliderComponent } from './import-questions-slider.component';

describe('ImportQuestionsSliderComponent', () => {
  let component: ImportQuestionsSliderComponent;
  let fixture: ComponentFixture<ImportQuestionsSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportQuestionsSliderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportQuestionsSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
