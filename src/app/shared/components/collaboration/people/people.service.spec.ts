/* eslint-disable no-underscore-dangle */
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { PeopleService } from './people.service';
import { AppService } from 'src/app/shared/services/app.services';
import { of } from 'rxjs';
import { mockUsers } from '../collaboration-mock';

describe('PeopleService', () => {
  let service: PeopleService;
  let appServiceSpy: AppService;

  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    appServiceSpy = jasmine.createSpyObj(
      'AppService',
      ['_getRespFromGateway', 'prepareUrl'],
      {}
    );
    appServiceSpy._getResp = jasmine.createSpy().and.returnValue(of(mockUsers));

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PeopleService,
        { provide: AppService, useValue: appServiceSpy }
      ]
    });
    service = TestBed.inject(PeopleService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
  it('getUsers$', () => {
    const users = service.getUsers$({ isActive: true }, false);
    users.subscribe((resp) => {
      expect(resp[0].email).toEqual('cbouser@cbo.com');
    });
  });
  it('updateUserPresence ', () => {
    service.updateUserPresence({ ok: true });
    service.updateUserPresence$.subscribe((presence) =>
      expect(presence.ok).toBeTrue()
    );
  });
});
