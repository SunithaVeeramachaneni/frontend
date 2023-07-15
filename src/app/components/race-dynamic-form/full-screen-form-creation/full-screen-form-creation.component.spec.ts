import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullScreenFormCreationComponent } from './full-screen-form-creation.component';

describe('FullScreenFormCreationComponent', () => {
  let component: FullScreenFormCreationComponent;
  let fixture: ComponentFixture<FullScreenFormCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FullScreenFormCreationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FullScreenFormCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
