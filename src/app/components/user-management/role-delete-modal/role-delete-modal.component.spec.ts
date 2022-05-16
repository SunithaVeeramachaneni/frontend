import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';

import { RoleDeleteModalComponent } from './role-delete-modal.component';

describe('RoleDeleteModalComponent', () => {
  let component: RoleDeleteModalComponent;
  let fixture: ComponentFixture<RoleDeleteModalComponent>;
  let dialogRefSpy: MatDialogRef<RoleDeleteModalComponent>;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [RoleDeleteModalComponent],
      imports: [MatDialogModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: dialogRefSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });

  // it('it should close modal', () => {
  //   component.cancelRole('yes');
  //   //expect(dialogRefSpy.close).toHaveBeenCalled();
  // });
});
