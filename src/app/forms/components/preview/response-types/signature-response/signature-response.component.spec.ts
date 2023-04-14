import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignatureResponseComponent } from './signature-response.component';

describe('SignatureResponseComponent', () => {
  let component: SignatureResponseComponent;
  let fixture: ComponentFixture<SignatureResponseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignatureResponseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignatureResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
