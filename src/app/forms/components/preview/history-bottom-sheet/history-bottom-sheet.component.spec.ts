import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryBottomSheetComponent } from './history-bottom-sheet.component';

describe('HistoryBottomSheetComponent', () => {
  let component: HistoryBottomSheetComponent;
  let fixture: ComponentFixture<HistoryBottomSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoryBottomSheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryBottomSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
