import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MdmDetailViewComponent } from './mdm-detail-view.component';

describe('MdmDetailViewComponent', () => {
  let component: MdmDetailViewComponent;
  let fixture: ComponentFixture<MdmDetailViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MdmDetailViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MdmDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
