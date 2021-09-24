import { TestBed } from '@angular/core/testing';

import { NavigationDelayResolverService } from './navigation-delay-resolver.service';

describe('NavigationDelayResolverService', () => {
  let service: NavigationDelayResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NavigationDelayResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
