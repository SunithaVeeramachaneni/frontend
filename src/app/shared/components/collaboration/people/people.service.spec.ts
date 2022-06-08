import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { PeopleService } from './people.service';

describe('PeopleService', () => {
  let service: PeopleService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PeopleService]
    });
    service = TestBed.inject(PeopleService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
