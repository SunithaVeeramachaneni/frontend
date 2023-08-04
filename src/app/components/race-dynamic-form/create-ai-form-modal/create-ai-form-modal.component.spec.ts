import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAiFormModalComponent } from './create-ai-form-modal.component';

describe('CreateAiFormModalComponent', () => {
  let component: CreateAiFormModalComponent;
  let fixture: ComponentFixture<CreateAiFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateAiFormModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAiFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
