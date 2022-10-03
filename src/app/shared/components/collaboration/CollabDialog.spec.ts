import { ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule
} from '@ngx-translate/core';
import { of } from 'rxjs';
import { ChatService } from './chats/chat.service';

import { CollabDialogComponent } from './CollabDialog';
import {
  meeting$,
  openCollabWindow$,
  mockElementRef
} from './collaboration-mock';

describe('CollabDialogComponent', () => {
  let component: CollabDialogComponent;
  let fixture: ComponentFixture<CollabDialogComponent>;

  let chatServiceSpy: ChatService;
  let dialogRefSpy: MatDialogRef<CollabDialogComponent>;
  let collabDialogData: any;

  let elementRef: ElementRef;

  beforeEach(async () => {
    elementRef = mockElementRef;
    collabDialogData = { positionRelativeToElement: elementRef };
    chatServiceSpy = jasmine.createSpyObj(
      'ChatService',
      [
        'collaborationWindowAction',
        'acceptCallWindowAction',
        'getCollaborationWindowStatus',
        'getAVConfWindowStatus',
        'getConferenceDetails$'
      ],
      {
        meeting$,
        unreadCount$: of(true),
        openCollabWindow$,
        collabWindowCollapseExpandAction$: of({ expand: true })
      }
    );
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', [
      'close',
      'updatePosition',
      'updateSize',
      'removePanelClass',
      'addPanelClass'
    ]);

    await TestBed.configureTestingModule({
      declarations: [CollabDialogComponent],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useValue: TranslateFakeLoader
          }
        })
      ],
      providers: [
        MatIconModule,
        MatDividerModule,
        { provide: ChatService, useValue: chatServiceSpy },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        {
          provide: MAT_DIALOG_DATA,
          useValue: collabDialogData
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollabDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create component - ngOnInit()', () => {
    chatServiceSpy.getCollaborationWindowStatus = jasmine
      .createSpy()
      .and.returnValue({ isOpen: true, isCollapsed: false });
    const minimizeSpy = spyOn(component, 'minimizeCollabDialog');

    component.ngOnInit();
    expect(component).toBeTruthy();
    expect(minimizeSpy).toHaveBeenCalledTimes(1);
    expect(chatServiceSpy.getCollaborationWindowStatus).toHaveBeenCalled();
  });
  it('handleViewChange - hideButtonGroup=false', () => {
    component.handleViewChange({ hideButtonGroup: false });
    expect(component.hideButtonGroup).toBeFalsy();
  });
  it('handleViewChange - hideButtonGroup=true', () => {
    component.handleViewChange({ hideButtonGroup: true });
    expect(component.hideButtonGroup).toBeTruthy();
  });
  it('handleTextMessaging', () => {
    component.handleTextMessaging({ firstName: 'cboUser' });
    expect(component.selectedTab).toEqual('chats');
    expect(component.selectedUser.firstName).toEqual('cboUser');
  });
  it('handleAudioMessaging', () => {
    component.handleAudioMessaging({ firstName: 'cboUser' });
    expect(component.selectedTab).toEqual('calls');
    expect(component.selectedUser.firstName).toEqual('cboUser');
  });
  it('handleVideoMessaging', () => {
    component.handleVideoMessaging({ firstName: 'cboUser' });
    expect(component.selectedTab).toEqual('calls');
    expect(component.selectedUser.firstName).toEqual('cboUser');
  });

  it('setSelectedTab', () => {
    component.setSelectedTab('tabName');
    expect(component.selectedTab).toEqual('tabName');
  });

  it('closeCollabDialog', () => {
    component.closeCollabDialog();
    expect(dialogRefSpy.close).toHaveBeenCalledTimes(1);
  });

  it('collapseCollabDialog isCollapsed=true', () => {
    chatServiceSpy.getAVConfWindowStatus = jasmine
      .createSpy()
      .and.returnValue({ isCollapsed: true });

    component.collapseCollabDialog();
    expect(component.isMaximized).toBeFalse();
    expect(component.dialogCollapsed).toBeTrue();
    expect(dialogRefSpy.updateSize).toHaveBeenCalledTimes(1);
    expect(dialogRefSpy.removePanelClass).toHaveBeenCalledTimes(2);
    expect(chatServiceSpy.getAVConfWindowStatus).toHaveBeenCalledTimes(1);
    expect(dialogRefSpy.addPanelClass).toHaveBeenCalledTimes(1);
    expect(chatServiceSpy.collaborationWindowAction).toHaveBeenCalledTimes(1);
  });

  it('collapseCollabDialog isCollapsed=false', () => {
    chatServiceSpy.getAVConfWindowStatus = jasmine
      .createSpy()
      .and.returnValue({ isCollapsed: false });

    component.collapseCollabDialog();
    expect(component.isMaximized).toBeFalse();
    expect(component.dialogCollapsed).toBeTrue();
    expect(dialogRefSpy.updateSize).toHaveBeenCalledTimes(1);
    expect(dialogRefSpy.removePanelClass).toHaveBeenCalledTimes(2);
    expect(chatServiceSpy.getAVConfWindowStatus).toHaveBeenCalledTimes(1);
    expect(dialogRefSpy.addPanelClass).toHaveBeenCalledTimes(1);
    expect(chatServiceSpy.collaborationWindowAction).toHaveBeenCalledTimes(1);
  });

  it('maximizeCollabDialog', () => {
    component.maximizeCollabDialog();
    expect(component.dialogCollapsed).toBeFalse();
    expect(component.isMaximized).toBeTrue();
    expect(dialogRefSpy.updateSize).toHaveBeenCalledTimes(1);
    expect(dialogRefSpy.removePanelClass).toHaveBeenCalledTimes(3);
    expect(dialogRefSpy.addPanelClass).toHaveBeenCalledTimes(1);
    expect(chatServiceSpy.collaborationWindowAction).toHaveBeenCalledTimes(1);
  });

  it('minimizeCollabDialog', () => {
    component.minimizeCollabDialog();
    expect(component.dialogCollapsed).toBeFalse();
    expect(component.isMaximized).toBeFalse();
    expect(dialogRefSpy.updateSize).toHaveBeenCalledTimes(1);
    expect(dialogRefSpy.removePanelClass).toHaveBeenCalledTimes(3);
    expect(dialogRefSpy.addPanelClass).toHaveBeenCalledTimes(1);
    expect(chatServiceSpy.collaborationWindowAction).toHaveBeenCalledTimes(1);
  });
});
