import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotesShiftLogContainerComponent } from './notes-shift-log-container.component';

describe('NotesShiftLogContainerComponent', () => {
  let component: NotesShiftLogContainerComponent;
  let fixture: ComponentFixture<NotesShiftLogContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotesShiftLogContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotesShiftLogContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
