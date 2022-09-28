import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule
} from '@ngx-translate/core';
import { of } from 'rxjs';
import { LoginService } from 'src/app/components/login/services/login.service';
import { ImageUtils } from 'src/app/shared/utils/imageUtils';
import { ChatService } from '../chats/chat.service';
import {
  mockGetUsers,
  mockUserInfo,
  mockUsers,
  mockUsersMSTeams
} from '../collaboration-mock';
import { PeopleComponent } from './people.component';
import { PeopleService } from './people.service';

describe('PeopleComponent', () => {
  let component: PeopleComponent;
  let fixture: ComponentFixture<PeopleComponent>;

  let dialogSpy: MatDialog;
  let peopleServiceSpy: PeopleService;
  let imageUtilsSpy: ImageUtils;
  let loginServiceSpy: LoginService;
  let chatServiceSpy: ChatService;

  beforeEach(async () => {
    dialogSpy = jasmine.createSpyObj('MatDialog', ['close'], {
      open: () => {}
    });
    peopleServiceSpy = jasmine.createSpyObj('PeopleService', ['getUsers$'], {
      updateUserPresence$: of({
        action: 'update_user_presence',
        data: ['cbouser1@cbo.com']
      })
    });
    peopleServiceSpy.getUsers$ = jasmine
      .createSpy()
      .and.returnValue(mockGetUsers);
    imageUtilsSpy = jasmine.createSpyObj('ImageUtils', ['getImageSrc'], {});
    loginServiceSpy = jasmine.createSpyObj(
      'LoginService',
      ['getLoggedInUserInfo'],
      {}
    );
    loginServiceSpy.getLoggedInUserInfo = jasmine
      .createSpy()
      .and.returnValue(mockUserInfo);
    chatServiceSpy = jasmine.createSpyObj(
      'ChatService',
      ['getAVConfWindowStatus'],
      {}
    );

    await TestBed.configureTestingModule({
      declarations: [PeopleComponent],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useValue: TranslateFakeLoader
          }
        })
      ],
      providers: [
        { provide: MatDialog, useValue: dialogSpy },
        { provide: PeopleService, useValue: peopleServiceSpy },
        { provide: ImageUtils, useValue: imageUtilsSpy },
        { provide: LoginService, useValue: loginServiceSpy },
        { provide: ChatService, useValue: chatServiceSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeopleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('should create component', () => {
    it('ngOnInit()', () => {
      component.ngOnInit();
      expect(component).toBeTruthy();
    });

    it('constructor - searchKeyUpdate', () => {
      const fetchActiveUsersSpy = spyOn(
        component,
        'fetchActiveUsers'
      ).and.returnValue(of([]));
      component.searchKeyUpdate.next('hello');
      expect(component).toBeTruthy();
    });

    it('add_people event', () => {
      component.updatePeople$.next({
        data: [{ email: 'addeduser1@cbo.com', firstName: 'addeduser1' }],
        action: 'add_people'
      });
      expect(component).toBeTruthy();
    });

    it('add_people_search event', () => {
      component.updatePeople$.next({
        data: [{ email: 'addeduser1@cbo.com', firstName: 'addeduser1' }],
        action: 'add_people_search'
      });
      expect(component).toBeTruthy();
    });

    it('update_user_presence event', () => {
      component.updateUserPresence$.next({
        data: ['addeduser1@cbo.com', 'addeduser2@cbo.com'],
        action: 'update_user_presence'
      });
      expect(component).toBeTruthy();
    });
  });

  describe('fetchActiveUsers', () => {
    it('fetchActiveUsers', () => {
      component.fetchActiveUsers();
      expect(loginServiceSpy.getLoggedInUserInfo).toHaveBeenCalled();
    });

    it('isDebounceSearchEvent=true', () => {
      const fetchActiveUsersSpy = spyOn(
        component,
        'fetchActiveUsers'
      ).and.returnValue(mockGetUsers);

      component.fetchActiveUsers(true);
      expect(loginServiceSpy.getLoggedInUserInfo).toHaveBeenCalled();
    });
  });

  describe('formatUsers', () => {
    it('slack', () => {
      imageUtilsSpy.getImageSrc = jasmine.createSpy().and.returnValue('');
      const validUsers = component.formatUsers(mockUsers);
      expect(loginServiceSpy.getLoggedInUserInfo).toHaveBeenCalled();
      expect(imageUtilsSpy.getImageSrc).toHaveBeenCalledTimes(3);
      expect(validUsers.length).toEqual(3);
    });

    it('msteams', () => {
      imageUtilsSpy.getImageSrc = jasmine.createSpy().and.returnValue('');
      const mockUserInfoMSTeams = {
        ...mockUserInfo,
        collaborationType: 'msteams'
      };
      loginServiceSpy.getLoggedInUserInfo = jasmine
        .createSpy()
        .and.returnValue(mockUserInfoMSTeams);
      const validUsers = component.formatUsers(mockUsersMSTeams);
      expect(loginServiceSpy.getLoggedInUserInfo).toHaveBeenCalled();
      expect(imageUtilsSpy.getImageSrc).toHaveBeenCalledTimes(2);
      expect(validUsers.length).toEqual(2);
    });
  });

  describe('onPeopleListScrolled', () => {
    it('scrollLeft is not same', () => {
      const fetchActiveUsersSpy = spyOn(
        component,
        'fetchActiveUsers'
      ).and.returnValue(of([]));
      const mockTargetElementBottomReached = {
        scrollHeight: 120,
        scrollTop: 100,
        clientHeight: 20,
        scrollLeft: 0
      };
      component.lastScrollLeft = 10;
      component.onPeopleListScrolled({
        target: mockTargetElementBottomReached
      });
      expect(fetchActiveUsersSpy).toHaveBeenCalledTimes(0);
    });

    it('isBottomReached', () => {
      const fetchActiveUsersSpy = spyOn(
        component,
        'fetchActiveUsers'
      ).and.returnValue(of([]));
      const mockTargetElementBottomReached = {
        scrollHeight: 120,
        scrollTop: 100,
        clientHeight: 20,
        scrollLeft: 0
      };
      component.onPeopleListScrolled({
        target: mockTargetElementBottomReached
      });
      expect(fetchActiveUsersSpy).toHaveBeenCalledTimes(1);
    });

    it('callList Loaded minimum records', () => {
      const fetchActiveUsersSpy = spyOn(
        component,
        'fetchActiveUsers'
      ).and.returnValue(of([]));
      const mockTargetElementBottomReached = {
        scrollHeight: 120,
        scrollTop: 100,
        clientHeight: 20,
        scrollLeft: 0
      };
      component.peopleLoadedCount = 10;
      component.peopleTotalCount = 8;
      component.onPeopleListScrolled({
        target: mockTargetElementBottomReached
      });
      expect(fetchActiveUsersSpy).toHaveBeenCalledTimes(0);
    });

    it('bottomReached and fetchcallListInprogress', () => {
      const fetchActiveUsersSpy = spyOn(
        component,
        'fetchActiveUsers'
      ).and.returnValue(of([]));
      const mockTargetElementBottomReached = {
        scrollHeight: 120,
        scrollTop: 100,
        clientHeight: 20,
        scrollLeft: 0
      };
      component.fetchActiveUsersInprogress = true;
      component.onPeopleListScrolled({
        target: mockTargetElementBottomReached
      });
      expect(fetchActiveUsersSpy).toHaveBeenCalledTimes(0);
    });
  });

  it('onTextMessageClick', () => {
    const handlTextMsgSpy = spyOn(component.handleTextMessaging, 'emit');
    component.onTextMessageClick({
      firstName: 'testuser',
      email: 'testuser@cbo.com'
    });
    expect(handlTextMsgSpy).toHaveBeenCalled();
  });

  describe('openAudioVideoCallDialog', () => {
    it('isOpen=true', () => {
      chatServiceSpy.getAVConfWindowStatus = jasmine
        .createSpy()
        .and.returnValue({ isOpen: true });
      const user = { firstName: 'testuser1', email: 'testuser.cbo@cbo.com' };
      component.openAudioVideoCallDialog(user, 'audio');
      expect(chatServiceSpy.getAVConfWindowStatus).toHaveBeenCalled();
    });

    xit('isOpen=false', () => {
      chatServiceSpy.getAVConfWindowStatus = jasmine
        .createSpy()
        .and.returnValue({ isOpen: false });
      dialogSpy.open = jasmine.createSpy().and.returnValue({ ok: true });
      const user = { firstName: 'testuser1', email: 'testuser.cbo@cbo.com' };
      component.openAudioVideoCallDialog(user, 'audio');
      expect(chatServiceSpy.getAVConfWindowStatus).toHaveBeenCalled();
      expect(dialogSpy.open).toHaveBeenCalled();
    });
  });
});
