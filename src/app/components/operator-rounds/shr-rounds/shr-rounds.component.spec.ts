import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShrRoundsComponent } from './shr-rounds.component';

describe('ShrRoundsComponent', () => {
  let component: ShrRoundsComponent;
  let fixture: ComponentFixture<ShrRoundsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShrRoundsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShrRoundsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
