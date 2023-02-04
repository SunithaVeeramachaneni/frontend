import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsContainerComponent } from './assets-container.component';

describe('AssetsContainerComponent', () => {
  let component: AssetsContainerComponent;
  let fixture: ComponentFixture<AssetsContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetsContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
