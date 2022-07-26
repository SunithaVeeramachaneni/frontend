import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionsRevokeInfoModalComponent } from './permissions-revoke-info-modal.component';

describe('PermissionsRevokeInfoModalComponent', () => {
  let component: PermissionsRevokeInfoModalComponent;
  let fixture: ComponentFixture<PermissionsRevokeInfoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PermissionsRevokeInfoModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PermissionsRevokeInfoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
