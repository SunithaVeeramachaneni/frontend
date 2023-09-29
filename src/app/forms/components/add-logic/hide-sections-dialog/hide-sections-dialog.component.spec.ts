import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HideSectionsDialogComponent } from './hide-sections-dialog.component';

describe('HideSectionsDialogComponent', () => {
  let component: HideSectionsDialogComponent;
  let fixture: ComponentFixture<HideSectionsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HideSectionsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HideSectionsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
