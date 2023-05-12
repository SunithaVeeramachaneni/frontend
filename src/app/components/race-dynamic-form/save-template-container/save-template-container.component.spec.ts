import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveTemplateContainerComponent } from './save-template-container.component';

describe('SaveTemplateContainerComponent', () => {
  let component: SaveTemplateContainerComponent;
  let fixture: ComponentFixture<SaveTemplateContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveTemplateContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveTemplateContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
