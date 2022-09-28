import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';
import { BehaviorSubject, of, ReplaySubject } from 'rxjs';
import { LoginService } from 'src/app/components/login/services/login.service';
import {
  userAuthData$,
  userInfo$
} from 'src/app/components/login/services/login.service.mock';
import { AppMaterialModules } from 'src/app/material.module';
import { BreadcrumbModule } from 'xng-breadcrumb';
import { CommonService } from '../../services/common.service';
import { HeaderService } from '../../services/header.service';
import { ChatService } from '../collaboration/chats/chat.service';

import { HeaderComponent } from './header.component';

import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule
} from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';

const unreadCountSubject: BehaviorSubject<any> = new BehaviorSubject<any>(0);
const meetingSubject: BehaviorSubject<any> = new BehaviorSubject<any>({});
const openCollabWindowSubject: BehaviorSubject<any> = new BehaviorSubject<any>({
  open: false
});

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let headerServiceSpy: HeaderService;
  let commonServiceSpy: CommonService;
  let loginServiceSpy: LoginService;
  let oidcSecurityServiceSpy: OidcSecurityService;
  let chatServiceSpy: ChatService;
  let dialogSpy: MatDialog;

  beforeEach(async () => {
    const dialogOpenResp = {
      afterOpened: () => of({ ok: true }),
      afterClosed: () => of({ ok: true })
    };
    dialogSpy = jasmine.createSpyObj('MatDialog', ['close'], {
      open: () => dialogOpenResp
    });

    commonServiceSpy = jasmine.createSpyObj('CommonService', [
      'setCurrentRouteUrl',
      'setTranslateLanguage'
    ]);

    headerServiceSpy = jasmine.createSpyObj('HeaderService', [
      'getInstallationURL$'
    ]);
    oidcSecurityServiceSpy = jasmine.createSpyObj('OidcSecurityService', [], {
      userData$: userAuthData$
    });
    chatServiceSpy = jasmine.createSpyObj(
      'ChatService',
      [
        'collaborationWindowAction',
        'acceptCallWindowAction',
        'getCollaborationWindowStatus',
        'expandCollaborationWindow'
      ],
      {
        unreadCount$: unreadCountSubject,
        meeting$: meetingSubject,
        openCollabWindow$: openCollabWindowSubject
      }
    );
    chatServiceSpy.getCollaborationWindowStatus = jasmine
      .createSpy()
      .and.returnValue({ isOpen: true, isCollapsed: true });
    loginServiceSpy = jasmine.createSpyObj('LoginService', [], {
      loggedInUserInfo$: userInfo$,
      userInfo$
    });

    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [
        BrowserAnimationsModule,
        AppMaterialModules,
        BreadcrumbModule,
        RouterTestingModule,
        HttpClientTestingModule,
        NgxShimmerLoadingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useValue: TranslateFakeLoader
          }
        })
      ],
      providers: [
        { provide: MatDialog, useValue: dialogSpy },
        { provide: HeaderService, useValue: headerServiceSpy },
        { provide: OidcSecurityService, useValue: oidcSecurityServiceSpy },
        { provide: ChatService, useValue: chatServiceSpy },
        { provide: CommonService, useValue: commonServiceSpy },
        { provide: LoginService, useValue: loginServiceSpy }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    (headerServiceSpy.getInstallationURL$ as jasmine.Spy).and.returnValue(
      of({ dummy: 'dummyvalue' })
    );

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('openDialog', () => {
    it('window is already open', () => {
      const expandCollaborationWindowSpy = spyOn(
        chatServiceSpy,
        'expandCollaborationWindow'
      );
      component.openDialog();
      expect(chatServiceSpy.getCollaborationWindowStatus).toHaveBeenCalledTimes(
        1
      );
      expect(expandCollaborationWindowSpy).toHaveBeenCalledTimes(1);
    });
    it('collaboration window is not open', () => {
      chatServiceSpy.getCollaborationWindowStatus = jasmine
        .createSpy()
        .and.returnValue({ isOpen: false, isCollapsed: false });

      component.openDialog();
      expect(component.unreadMessageCount).toEqual(0);
    });
  });
  it('connectToSlack', () => {
    const verification = { installationURL: '' };
    const tSpy = spyOn(window, 'open');
    component.connectToSlack(verification);
    expect(tSpy).toHaveBeenCalledTimes(1);
  });
  describe('ngOnInit()', () => {
    it('subscribe to unreadCount$', () => {
      component.ngOnInit();
      unreadCountSubject.next(5);
      expect(component.unreadMessageCount).toEqual(5);
    });

    it('subscribe to openCollabWindow$', () => {
      const openDialogSpy = spyOn(component, 'openDialog');
      component.ngOnInit();
      openCollabWindowSubject.next({ open: true });
      expect(openDialogSpy).toHaveBeenCalledTimes(2);
    });

    it('subscribe to meeting$', () => {
      const playIncomingCallAudioSpy = spyOn(
        component,
        'playIncomingCallAudio'
      );
      component.ngOnInit();
      meetingSubject.next({ ok: true });
      expect(playIncomingCallAudioSpy).toHaveBeenCalledTimes(3);
      expect(chatServiceSpy.acceptCallWindowAction).toHaveBeenCalledWith({
        isOpen: true
      });
    });
  });
});
