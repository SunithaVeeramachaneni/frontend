import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateAffectedFormsModalComponent } from './template-affected-forms-modal.component';

describe('TemplateAffectedFormsModalComponent', () => {
  let component: TemplateAffectedFormsModalComponent;
  let fixture: ComponentFixture<TemplateAffectedFormsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TemplateAffectedFormsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateAffectedFormsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
