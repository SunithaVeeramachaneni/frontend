import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, NgControl, ReactiveFormsModule } from '@angular/forms';

import { QuillMaterialComponent } from './quill-material.component';

xdescribe('QuillMaterialComponent', () => {
  let component: QuillMaterialComponent;
  let fixture: ComponentFixture<QuillMaterialComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QuillMaterialComponent ],
      imports: [ReactiveFormsModule, FormsModule],
      providers: [
        { provide: NgControl, useValue: new FormControl() }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuillMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
