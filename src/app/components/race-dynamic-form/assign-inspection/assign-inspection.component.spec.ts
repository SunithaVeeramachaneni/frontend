import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignInspectionComponent } from './assign-inspection.component';

describe('AssignInspectionComponent', () => {
  let component: AssignInspectionComponent;
  let fixture: ComponentFixture<AssignInspectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignInspectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignInspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
