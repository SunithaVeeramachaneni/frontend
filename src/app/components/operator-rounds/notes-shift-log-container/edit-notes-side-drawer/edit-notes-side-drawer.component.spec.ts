import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditNotesSideDrawerComponent } from './edit-notes-side-drawer.component';

describe('EditNotesSideDrawerComponent', () => {
  let component: EditNotesSideDrawerComponent;
  let fixture: ComponentFixture<EditNotesSideDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditNotesSideDrawerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditNotesSideDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
