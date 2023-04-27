import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveTemplateNamingModalComponent } from './save-template-naming-modal.component';

describe('SaveTemplateModalComponent', () => {
  let component: SaveTemplateNamingModalComponent;
  let fixture: ComponentFixture<SaveTemplateNamingModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SaveTemplateNamingModalComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveTemplateNamingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
