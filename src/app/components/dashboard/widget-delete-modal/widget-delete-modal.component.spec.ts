import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { widget } from '../widget/widget.component.mock';

import {
  WidgetDeleteModalComponent,
  WidgetDeleteModalData
} from './widget-delete-modal.component';

describe('WidgetDeleteModalComponent', () => {
  let component: WidgetDeleteModalComponent;
  let fixture: ComponentFixture<WidgetDeleteModalComponent>;
  let dialogRefSpy: MatDialogRef<WidgetDeleteModalComponent>;
  let widgetDeleteModalData: WidgetDeleteModalData;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    widgetDeleteModalData = {
      widget
    };

    await TestBed.configureTestingModule({
      declarations: [WidgetDeleteModalComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: widgetDeleteModalData }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
