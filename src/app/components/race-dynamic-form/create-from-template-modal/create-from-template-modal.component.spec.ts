import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFromTemplateModalComponent } from './create-from-template-modal.component';

describe('CreateFromTemplateModalComponent', () => {
  let component: CreateFromTemplateModalComponent;
  let fixture: ComponentFixture<CreateFromTemplateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateFromTemplateModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateFromTemplateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
