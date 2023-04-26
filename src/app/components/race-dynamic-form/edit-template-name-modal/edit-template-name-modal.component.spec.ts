import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTemplateNameModalComponent } from './edit-template-name-modal.component';

describe('EditTemplateNameModalComponent', () => {
  let component: EditTemplateNameModalComponent;
  let fixture: ComponentFixture<EditTemplateNameModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditTemplateNameModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTemplateNameModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
