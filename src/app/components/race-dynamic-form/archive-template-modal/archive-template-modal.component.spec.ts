import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchiveTemplateModalComponent } from './archive-template-modal.component';

describe('ArchiveTemplateModalComponent', () => {
  let component: ArchiveTemplateModalComponent;
  let fixture: ComponentFixture<ArchiveTemplateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArchiveTemplateModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchiveTemplateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
