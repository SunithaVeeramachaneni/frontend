import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicLibraryComponent } from './public-library.component';

describe('PublicLibraryComponent', () => {
  let component: PublicLibraryComponent;
  let fixture: ComponentFixture<PublicLibraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicLibraryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
