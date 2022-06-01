import { TestBed, async } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { ChatService } from './chat.service';
import { AppService } from 'src/app/shared/services/app.services';

describe('ChatService', () => {
  let service: ChatService;
  let httpTestingController: HttpTestingController;
  let appServiceSpy: AppService;

  beforeEach(async () => {
    appServiceSpy = jasmine.createSpyObj('AppService', [
      '_getResp',
      '_postData',
      'uploadFile',
      '_downloadFile',
      'patchData'
    ]);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ChatService, { provide: AppService, useValue: appServiceSpy }]
    });
    service = TestBed.inject(ChatService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
