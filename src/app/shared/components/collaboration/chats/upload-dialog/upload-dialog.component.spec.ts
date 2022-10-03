import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule
} from '@ngx-translate/core';
import { UploadDialogComponent } from './upload-dialog.component';

describe('UploadDialogComponent', () => {
  let component: UploadDialogComponent;
  let fixture: ComponentFixture<UploadDialogComponent>;

  let dialogRefSpy: MatDialogRef<UploadDialogComponent>;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    await TestBed.configureTestingModule({
      declarations: [UploadDialogComponent],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useValue: TranslateFakeLoader
          }
        })
      ],
      providers: [{ provide: MatDialogRef, useValue: dialogRefSpy }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component - ngOnInit()', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('onFileSelect', () => {
    const event = {
      target: {
        files: ['file1', 'file2']
      }
    };
    component.onFileSelect(event);
    expect(component.attachment).toEqual('file1');
  });

  it('uploadFile', () => {
    dialogRefSpy.close = jasmine.createSpy().and.returnValue({ ok: true });
    component.uploadFile();
    expect(dialogRefSpy.close).toHaveBeenCalledTimes(1);
  });

  it('closeUploadDialog', () => {
    dialogRefSpy.close = jasmine.createSpy().and.returnValue({ ok: true });
    component.closeUploadDialog();
    expect(dialogRefSpy.close).toHaveBeenCalledTimes(1);
  });
});
