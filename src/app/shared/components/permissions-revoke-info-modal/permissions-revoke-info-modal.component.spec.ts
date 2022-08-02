import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';

import { PermissionsRevokeInfoModalComponent } from './permissions-revoke-info-modal.component';

describe('PermissionsRevokeInfoModalComponent', () => {
  let component: PermissionsRevokeInfoModalComponent;
  let fixture: ComponentFixture<PermissionsRevokeInfoModalComponent>;
  let matDialogRefSpy: MatDialogRef<PermissionsRevokeInfoModalComponent>;
  let permissionDe: DebugElement;
  let permissionEl: HTMLElement;

  beforeEach(async () => {
    matDialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [PermissionsRevokeInfoModalComponent],
      providers: [{ provide: MatDialogRef, useValue: matDialogRefSpy }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PermissionsRevokeInfoModalComponent);
    component = fixture.componentInstance;
    permissionDe = fixture.debugElement;
    permissionEl = permissionDe.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('close', () => {
    it('should define function', () => {
      expect(component.close).toBeDefined();
    });

    it('should close permissions revoke modal', () => {
      permissionEl.querySelector('button').click();

      expect(matDialogRefSpy.close).toHaveBeenCalledWith();
    });
  });
});
