import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveTemplateConfirmModalComponent } from './save-template-confirm-modal.component';

describe('SaveTemplateConfirmModalComponent', () => {
  let component: SaveTemplateConfirmModalComponent;
  let fixture: ComponentFixture<SaveTemplateConfirmModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveTemplateConfirmModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveTemplateConfirmModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
