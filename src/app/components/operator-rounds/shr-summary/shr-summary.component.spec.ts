import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShrSummaryComponent } from './shr-summary.component';

describe('ShrSummaryComponent', () => {
  let component: ShrSummaryComponent;
  let fixture: ComponentFixture<ShrSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShrSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShrSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
