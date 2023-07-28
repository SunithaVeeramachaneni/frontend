import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteTemplateModalComponent } from './delete-template-modal.component';

describe('DeleteTemplateModalComponent', () => {
  let component: DeleteTemplateModalComponent;
  let fixture: ComponentFixture<DeleteTemplateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteTemplateModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteTemplateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
