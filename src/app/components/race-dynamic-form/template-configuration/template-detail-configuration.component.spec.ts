import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateDetailConfigurationComponent } from './template-detail-configuration.component';

describe('TemplateConfigurationComponent', () => {
  let component: TemplateDetailConfigurationComponent;
  let fixture: ComponentFixture<TemplateDetailConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TemplateDetailConfigurationComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateDetailConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
