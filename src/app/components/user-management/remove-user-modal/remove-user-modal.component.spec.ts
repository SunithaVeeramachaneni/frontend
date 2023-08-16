import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveUserModalComponent } from './remove-user-modal.component';

describe('RemoveUserModalComponent', () => {
  let component: RemoveUserModalComponent;
  let fixture: ComponentFixture<RemoveUserModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemoveUserModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveUserModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
