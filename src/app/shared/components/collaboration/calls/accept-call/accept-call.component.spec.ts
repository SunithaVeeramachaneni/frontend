import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule
} from '@ngx-translate/core';
import { ChatService } from '../../chats/chat.service';
import { mockAcceptCallDialogData } from '../../collaboration-mock';
import { AcceptCallComponent } from './accept-call.component';

describe('AcceptCallComponent', () => {
  let component: AcceptCallComponent;
  let fixture: ComponentFixture<AcceptCallComponent>;

  let chatServiceSpy: ChatService;
  let dialogRefSpy: MatDialogRef<AcceptCallComponent>;
  let dialogSpy: MatDialog;
  let collabDialogData: any;

  beforeEach(async () => {
    collabDialogData = mockAcceptCallDialogData;
    chatServiceSpy = jasmine.createSpyObj(
      'ChatService',
      ['acceptCallWindowAction'],
      {}
    );
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close'], {});
    dialogSpy = jasmine.createSpyObj('MatDialog', ['close'], {
      open: () => {}
    });

    await TestBed.configureTestingModule({
      declarations: [AcceptCallComponent],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useValue: TranslateFakeLoader
          }
        })
      ],
      providers: [
        MatDialog,
        { provide: ChatService, useValue: chatServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        {
          provide: MAT_DIALOG_DATA,
          useValue: collabDialogData
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptCallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component - ngOnInit()', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('should create component - ngOnInit() - empty roomName', () => {
    component.data.meetingEvent.metadata.subject = null;
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('rejectIncomingCall', () => {
    const audioPauseSpy = spyOn(component.data.audio, 'pause');
    component.rejectIncomingCall();
    expect(chatServiceSpy.acceptCallWindowAction).toHaveBeenCalledOnceWith({
      isOpen: false
    });
    expect(audioPauseSpy).toHaveBeenCalledTimes(1);
  });

  it('acceptIncomingCall', () => {
    const audioPauseSpy = spyOn(component.data.audio, 'pause');
    component.acceptIncomingCall();
    expect(chatServiceSpy.acceptCallWindowAction).toHaveBeenCalledOnceWith({
      isOpen: false
    });
    expect(audioPauseSpy).toHaveBeenCalledTimes(1);
  });
});
