import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule
} from '@ngx-translate/core';
import { of } from 'rxjs';
import { LoginService } from 'src/app/components/login/services/login.service';
import { ImageUtils } from 'src/app/shared/utils/imageUtils';
import {
  getCallLog$,
  mockGetUsers,
  mockUserInfo,
  mockUsers,
  mockUsersMSTeams
} from '../../collaboration-mock';
import { PeopleService } from '../../people/people.service';
import { ChatService } from '../chat.service';
import { CreateGroupComponent } from './create-group.component';

describe('CreateGroupComponent', () => {
  let component: CreateGroupComponent;
  let fixture: ComponentFixture<CreateGroupComponent>;

  let peopleServiceSpy: PeopleService;
  let chatServiceSpy: ChatService;
  let loginServiceSpy: LoginService;
  let imageUtilsSpy: ImageUtils;

  beforeEach(async () => {
    peopleServiceSpy = jasmine.createSpyObj('PeopleService', ['getUsers$'], {
      updateUserPresence$: of({
        action: 'update_user_presence',
        data: ['cbouser1@cbo.com']
      })
    });
    peopleServiceSpy.getUsers$ = jasmine
      .createSpy()
      .and.returnValue(mockGetUsers);
    chatServiceSpy = jasmine.createSpyObj(
      'ChatService',
      ['getCallLog$', 'addMembersToConversation$'],
      {}
    );
    chatServiceSpy.getCallLog$ = jasmine
      .createSpy()
      .and.returnValue(of(getCallLog$));

    loginServiceSpy = jasmine.createSpyObj(
      'LoginService',
      ['getLoggedInUserInfo'],
      {}
    );

    loginServiceSpy.getLoggedInUserInfo = jasmine
      .createSpy()
      .and.returnValue(mockUserInfo);

    imageUtilsSpy = jasmine.createSpyObj('ImageUtils', ['getImageSrc'], {});

    await TestBed.configureTestingModule({
      declarations: [CreateGroupComponent],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useValue: TranslateFakeLoader
          }
        })
      ],
      providers: [
        { provide: PeopleService, useValue: peopleServiceSpy },
        { provide: ChatService, useValue: chatServiceSpy },
        { provide: LoginService, useValue: loginServiceSpy },
        { provide: ImageUtils, useValue: imageUtilsSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateGroupComponent);
    component = fixture.componentInstance;

    component.selectedConversation = {
      topic: 'test group conversation',
      members: [
        { firstName: 'testUser1', email: 'cbouser@cbo.com' },
        { firstName: 'testUser2', email: 'cbouser@@ym27j.onmicrosoft.com' }
      ]
    };

    component.conversationMode = 'ADD_GROUP_MEMBERS';

    fixture.detectChanges();
  });

  describe('ngOnInit()', () => {
    it('should create component', () => {
      component.ngOnInit();
      expect(component).toBeTruthy();
    });

    it('conversationMode=ADD_GROUP_MEMBERS', () => {
      spyOn(component, 'fetchActiveUsers').and.returnValue(of(mockUsers));

      component.conversationMode = 'ADD_GROUP_MEMBERS';
      component.ngOnInit();
      expect(component.groupName).toEqual('test group conversation');
    });

    it('should create component - constructor - searchKeyUpdate', () => {
      spyOn(component, 'fetchActiveUsers').and.returnValue(of(mockUsers));
      component.searchKeyUpdate.next('hello');
      expect(component).toBeTruthy();
    });

    it('should create component - add_people event', () => {
      component.updatePeople$.next({
        data: [{ email: 'addeduser1@cbo.com', firstName: 'addeduser1' }],
        action: 'add_people'
      });
      expect(component).toBeTruthy();
    });

    it('should create component - add_people_search event', () => {
      component.updatePeople$.next({
        data: [{ email: 'addeduser1@cbo.com', firstName: 'addeduser1' }],
        action: 'add_people_search'
      });
      expect(component).toBeTruthy();
    });
  });

  describe('fetchActiveUsers', () => {
    it('fetchActiveUsers without params', () => {
      component.fetchActiveUsers();
      expect(loginServiceSpy.getLoggedInUserInfo).toHaveBeenCalled();
    });

    it('fetchActiveUsers isDebounceSearchEvent=true', () => {
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

  it('switchToConversationsView ', () => {
    const viewChangeListenerSpy = spyOn(component.viewChangeListener, 'emit');
    component.switchToConversationsView();
    expect(viewChangeListenerSpy).toHaveBeenCalledTimes(1);
  });

  it('addParticipant', () => {
    component.addParticipant({ id: 1 });
    expect(component.newUsersAddedToGroup).toBeTrue();
  });

  it('addParticipant - add existing user', () => {
    component.addParticipant({ id: 1 });
    component.addParticipant({ id: 1 });
    expect(component.newUsersAddedToGroup).toBeTrue();
  });

  it('removeParticipant', () => {
    const user = { id: 1, selected: true };
    component.addParticipant(user);
    component.removeParticipant(user);
    expect(user.selected).toBeFalse();
  });

  it('removeParticipant - non existing', () => {
    const user = { id: 5, selected: true };
    component.removeParticipant(user);
    expect(user.selected).toBeFalse();
  });

  it('onGroupCreateEnter', () => {
    const startConvSpy = spyOn(component, 'startConversation');
    const groupName = 'testGroup';
    const selectedUsers = ['user1', 'user2'];
    component.onGroupCreateEnter(groupName, selectedUsers);
    expect(startConvSpy).toHaveBeenCalledTimes(1);
  });

  describe('startConversation', () => {
    it('positive flow', () => {
      chatServiceSpy.createConversation$ = jasmine
        .createSpy()
        .and.returnValue(of({ ok: true }));
      const groupName = 'testGroup';
      component.startConversation(groupName, mockUsers);
      expect(chatServiceSpy.createConversation$).toHaveBeenCalledTimes(1);
    });

    it('createConversation throws error', () => {
      chatServiceSpy.createConversation$ = jasmine
        .createSpy()
        .and.throwError('error occured');
      const groupName = 'testGroup';
      try {
        component.startConversation(groupName, mockUsers);
      } catch (err) {
        expect(chatServiceSpy.createConversation$).toHaveBeenCalledTimes(1);
        expect(err.message).toEqual('error occured');
      }
    });

    it('msteams', () => {
      loginServiceSpy.getLoggedInUserInfo = jasmine
        .createSpy()
        .and.returnValue({
          userInfo: {
            collaborationType: 'msteams'
          }
        });
      chatServiceSpy.createConversation$ = jasmine
        .createSpy()
        .and.returnValue(of({ ok: true }));
      const groupName = 'testGroup';
      component.startConversation(groupName, mockUsers);
      expect(chatServiceSpy.createConversation$).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateGroupMembers', () => {
    it('newUsersAddedToGroup=false', () => {
      component.newUsersAddedToGroup = false;
      const resp = component.updateGroupMembers();
      expect(resp).toBeUndefined();
    });

    it('newUsersAddedToGroup=true', () => {
      chatServiceSpy.addMembersToConversation$ = jasmine
        .createSpy()
        .and.returnValue(of({ ok: true }));
      component.newUsersAddedToGroup = true;
      component.updateGroupMembers();
      expect(chatServiceSpy.addMembersToConversation$).toHaveBeenCalledTimes(1);
    });
  });
});
