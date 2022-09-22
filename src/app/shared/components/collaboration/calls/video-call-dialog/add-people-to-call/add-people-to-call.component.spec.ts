import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule
} from '@ngx-translate/core';
import { of } from 'rxjs';
import { LoginService } from 'src/app/components/login/services/login.service';
import { AuthHeaderService } from 'src/app/shared/services/authHeader.service';
import { ImageUtils } from 'src/app/shared/utils/imageUtils';
import {
  mockGetUsers,
  mockUserInfo,
  mockUsers,
  mockUsersMSTeams
} from '../../../collaboration-mock';
import { PeopleService } from '../../../people/people.service';

import { AddPeopleToCallComponent } from './add-people-to-call.component';
import { EventSourcePolyfill } from 'event-source-polyfill';

describe('AddPeopleToCallComponent', () => {
  let component: AddPeopleToCallComponent;
  let fixture: ComponentFixture<AddPeopleToCallComponent>;

  let peopleServiceSpy: PeopleService;
  let authHeaderServiceSpy: AuthHeaderService;
  let loginServiceSpy: LoginService;
  let imageUtilsSpy: ImageUtils;

  beforeEach(async () => {
    loginServiceSpy = jasmine.createSpyObj(
      'LoginService',
      ['getLoggedInUserInfo'],
      {}
    );
    peopleServiceSpy = jasmine.createSpyObj('PeopleService', ['getUsers$'], {
      updateUserPresence$: of({
        action: 'update_user_presence',
        data: ['cbouser1@cbo.com']
      })
    });
    peopleServiceSpy.getUsers$ = jasmine
      .createSpy()
      .and.returnValue(mockGetUsers);

    authHeaderServiceSpy = jasmine.createSpyObj(
      'AuthHeaderService',
      ['getAuthHeaders'],
      {}
    );
    authHeaderServiceSpy.getAuthHeaders = jasmine.createSpy().and.returnValue({
      authorization: 'authorizationHeader',
      tenantid: 'tenantID1'
    });

    loginServiceSpy.getLoggedInUserInfo = jasmine
      .createSpy()
      .and.returnValue(mockUserInfo);

    imageUtilsSpy = jasmine.createSpyObj('ImageUtils', ['getImageSrc'], {});

    await TestBed.configureTestingModule({
      declarations: [AddPeopleToCallComponent],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useValue: TranslateFakeLoader
          }
        })
      ],
      providers: [
        { provide: AuthHeaderService, useValue: authHeaderServiceSpy },
        { provide: PeopleService, useValue: peopleServiceSpy },
        { provide: LoginService, useValue: loginServiceSpy },
        { provide: ImageUtils, useValue: imageUtilsSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPeopleToCallComponent);
    component = fixture.componentInstance;
    component.joinedUsers = [
      { firstName: 'firstname1', email: 'user1email@cbo.com' },
      { firstName: 'firstname2', email: 'user2email@cbo.com' }
    ];

    fixture.detectChanges();
  });

  it('should create component - constructor - searchKeyUpdate', () => {
    const fetchActiveUsersSpy = spyOn(
      component,
      'fetchActiveUsers'
    ).and.returnValue(of([]));
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

  it('should create component - update_user_presence event', () => {
    component.updateUserPresence$.next({
      data: ['addeduser1@cbo.com', 'addeduser2@cbo.com'],
      action: 'update_user_presence'
    });
    expect(component).toBeTruthy();
  });

  it('fetchcallList', () => {
    component.fetchActiveUsers();
    expect(loginServiceSpy.getLoggedInUserInfo).toHaveBeenCalled();
  });

  it('fetchcallList isDebounceSearchEvent=true', () => {
    const fetchActiveUsersSpy = spyOn(
      component,
      'fetchActiveUsers'
    ).and.returnValue(mockGetUsers);

    component.fetchActiveUsers(true);
    expect(loginServiceSpy.getLoggedInUserInfo).toHaveBeenCalled();
  });

  it('formatUsers - slack', () => {
    imageUtilsSpy.getImageSrc = jasmine.createSpy().and.returnValue('');
    const validUsers = component.formatUsers(mockUsers);
    expect(loginServiceSpy.getLoggedInUserInfo).toHaveBeenCalled();
    expect(imageUtilsSpy.getImageSrc).toHaveBeenCalledTimes(3);
    expect(validUsers.length).toEqual(3);
  });

  it('formatUsers - msteams', () => {
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

  it('onPeopleListScrolled - scrollLeft is not same', () => {
    const mockTargetElementBottomReached = {
      scrollHeight: 120,
      scrollTop: 100,
      clientHeight: 20,
      scrollLeft: 0
    };
    component.lastScrollLeft = 10;
    component.onPeopleListScrolled({ target: mockTargetElementBottomReached });
  });

  it('onPeopleListScrolled - isBottomReached', () => {
    const mockTargetElementBottomReached = {
      scrollHeight: 120,
      scrollTop: 100,
      clientHeight: 20,
      scrollLeft: 0
    };
    component.onPeopleListScrolled({ target: mockTargetElementBottomReached });
  });

  it('onPeopleListScrolled - callList Loaded completely', () => {
    const mockTargetElementBottomReached = {
      scrollHeight: 120,
      scrollTop: 100,
      clientHeight: 20,
      scrollLeft: 0
    };
    component.peopleLoadedCount = 10;
    component.peopleTotalCount = 8;
    component.onPeopleListScrolled({ target: mockTargetElementBottomReached });
  });

  it('onPeopleListScrolled - bottomReached and fetchcallListInprogress', () => {
    const mockTargetElementBottomReached = {
      scrollHeight: 120,
      scrollTop: 100,
      clientHeight: 20,
      scrollLeft: 0
    };
    component.fetchActiveUsersInprogress = true;
    component.onPeopleListScrolled({ target: mockTargetElementBottomReached });
  });

  it('toggleUserSelection user.isSelected=true', () => {
    const user = {
      firstName: 'user1',
      email: 'cbouser1@cbo.com',
      isSelected: true
    };
    component.selectedUsers = ['cbouser1@cbo.com', 'cbouser2@cbo.com'];
    component.toggleUserSelection(user);
  });
  it('toggleUserSelection user.isSelected=false', () => {
    const user = {
      firstName: 'user1',
      email: 'cbouser3@cbo.com',
      isSelected: false
    };
    component.selectedUsers = ['cbouser1@cbo.com', 'cbouser2@cbo.com'];
    component.toggleUserSelection(user);
  });

  it('onUserSelectionChange event.checked=true', () => {
    const event = {
      checked: true
    };
    const user = {
      firstName: 'user1',
      email: 'cbouser3@cbo.com'
    };
    component.selectedUsers = ['cbouser1@cbo.com', 'cbouser2@cbo.com'];
    component.onUserSelectionChange(event, user);
  });

  it('onUserSelectionChange event.checked=false', () => {
    const event = {
      checked: false
    };
    const user = {
      firstName: 'user1',
      email: 'cbouser3@cbo.com'
    };
    component.selectedUsers = ['cbouser1@cbo.com', 'cbouser3@cbo.com'];
    component.onUserSelectionChange(event, user);
  });

  it('addPeople', () => {
    const closeSpy = spyOn(component.sideNavCloseHandler, 'emit');
    component.addPeople();
    expect(closeSpy).toHaveBeenCalled();
  });
  it('cancel', () => {
    const closeSpy = spyOn(component.sideNavCloseHandler, 'emit');
    component.cancel();
    expect(component.selectedUsers.length).toEqual(0);
    expect(closeSpy).toHaveBeenCalled();
  });
});
