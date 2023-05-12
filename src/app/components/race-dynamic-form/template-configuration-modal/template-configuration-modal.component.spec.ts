import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateConfigurationModalComponent } from './template-configuration-modal.component';

describe('TemplateConfigurationModalComponent', () => {
  let component: TemplateConfigurationModalComponent;
  let fixture: ComponentFixture<TemplateConfigurationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TemplateConfigurationModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateConfigurationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
