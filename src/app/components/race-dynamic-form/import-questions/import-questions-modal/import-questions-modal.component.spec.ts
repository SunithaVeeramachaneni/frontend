import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportQuestionsModalComponent } from './import-questions-modal.component';

describe('ImportQuestionsModalComponent', () => {
  let component: ImportQuestionsModalComponent;
  let fixture: ComponentFixture<ImportQuestionsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportQuestionsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportQuestionsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
