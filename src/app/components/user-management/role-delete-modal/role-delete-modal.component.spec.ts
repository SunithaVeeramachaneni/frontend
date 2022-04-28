import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { RoleDeleteModalComponent } from './role-delete-modal.component';

describe('RoleDeleteModalComponent', () => {
  let component: RoleDeleteModalComponent;
  let fixture: ComponentFixture<RoleDeleteModalComponent>;
  let dialogRefSpy: MatDialogRef<RoleDeleteModalComponent>;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [RoleDeleteModalComponent],
      providers: [{ provide: MatDialogRef, useValue: dialogRefSpy }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
