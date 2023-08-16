import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateHeaderConfigurationComponent } from './template-header-configuration.component';

describe('TemplateHeaderConfigurationComponent', () => {
  let component: TemplateHeaderConfigurationComponent;
  let fixture: ComponentFixture<TemplateHeaderConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TemplateHeaderConfigurationComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateHeaderConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
