import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponseDrawer } from './response.drawer.component';

describe('ResponseDrawer', () => {
  let component: ResponseDrawer;
  let fixture: ComponentFixture<ResponseDrawer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResponseDrawer]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponseDrawer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
