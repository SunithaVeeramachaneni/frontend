import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RdfSchedulerComponent } from './rdf-scheduler.component';

describe('RdfSchedulerComponent', () => {
  let component: RdfSchedulerComponent;
  let fixture: ComponentFixture<RdfSchedulerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RdfSchedulerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RdfSchedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
