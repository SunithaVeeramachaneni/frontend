import { ComponentFixture, TestBed } from '@angular/core/testing';
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
  getCallLog$,
  mockUserInfo,
  mockUsers,
  mockUsersMSTeams
} from '../collaboration-mock';
import { CallsComponent } from './calls.component';

describe('CallsComponent', () => {
  let component: CallsComponent;
  let fixture: ComponentFixture<CallsComponent>;

  let chatServiceSpy: ChatService;
  let loginServiceSpy: LoginService;
  let imageUtilsSpy: ImageUtils;

  beforeEach(async () => {
    chatServiceSpy = jasmine.createSpyObj('ChatService', ['getCallLog$'], {});
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
      declarations: [CallsComponent],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useValue: TranslateFakeLoader
          }
        })
      ],
      providers: [
        { provide: ChatService, useValue: chatServiceSpy },
        { provide: LoginService, useValue: loginServiceSpy },
        { provide: ImageUtils, useValue: imageUtilsSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CallsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component - ngOnInit()', () => {
    const fetchcallListSpy = spyOn(component, 'fetchcallList').and.returnValue(
      of([])
    );
    component.ngOnInit();
    expect(component).toBeTruthy();
    expect(fetchcallListSpy).toHaveBeenCalledTimes(1);
  });

  xit('should create component - ngOnInit() - catchError', () => {
    const fetchcallListSpy = spyOn(
      component,
      'fetchcallList'
    ).and.callThrough();

    component.ngOnInit();
    expect(component).toBeTruthy();
    expect(fetchcallListSpy).toHaveBeenCalledTimes(1);
  });

  it('should create component - ngOnInit() "add_call" event', () => {
    const fetchcallListSpy = spyOn(component, 'fetchcallList').and.returnValue(
      of({ data: [] })
    );
    component.ngOnInit();
    component.updateCallList$.next({
      data: { callType: 'audio', sender: '', receiver: '' },
      action: 'add_call'
    });
    expect(component).toBeTruthy();
    expect(fetchcallListSpy).toHaveBeenCalledTimes(1);
  });

  it('should create component - ngOnInit() "add_call_search" event', () => {
    const fetchcallListSpy = spyOn(component, 'fetchcallList').and.returnValue(
      of({ data: [] })
    );
    component.ngOnInit();
    component.updateCallList$.next({
      data: [{ callType: 'audio', sender: '', receiver: '' }],
      action: 'add_call_search'
    });
    expect(component).toBeTruthy();
    expect(fetchcallListSpy).toHaveBeenCalledTimes(1);
  });

  it('should create component - ngOnInit() "add_call_search" event empty data', () => {
    const fetchcallListSpy = spyOn(component, 'fetchcallList').and.returnValue(
      of({ data: [] })
    );
    component.ngOnInit();
    component.updateCallList$.next({
      data: undefined,
      action: 'add_call_search'
    });
    expect(component).toBeTruthy();
    expect(fetchcallListSpy).toHaveBeenCalledTimes(1);
  });

  it('fetchcallList', () => {
    component.fetchcallList();
    expect(loginServiceSpy.getLoggedInUserInfo).toHaveBeenCalled();
  });

  it('fetchcallList isDebounceSearchEvent=true', () => {
    component.fetchcallList(true);
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
    component.callListLoadedCount = 10;
    component.callListTotalCount = 8;
    component.onPeopleListScrolled({ target: mockTargetElementBottomReached });
  });

  it('onPeopleListScrolled - bottomReached and fetchcallListInprogress', () => {
    const mockTargetElementBottomReached = {
      scrollHeight: 120,
      scrollTop: 100,
      clientHeight: 20,
      scrollLeft: 0
    };
    component.fetchcallListInprogress = true;
    component.onPeopleListScrolled({ target: mockTargetElementBottomReached });
  });
});
