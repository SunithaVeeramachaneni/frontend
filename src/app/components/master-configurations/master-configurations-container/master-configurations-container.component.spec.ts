import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterConfigurationsContainerComponent } from './master-configurations-container.component';

describe('MasterCongigurationsContainerComponent', () => {
  let component: MasterConfigurationsContainerComponent;
  let fixture: ComponentFixture<MasterConfigurationsContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MasterConfigurationsContainerComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterConfigurationsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
