import { TestBed } from '@angular/core/testing';

import { TemplateResolverService } from './template-resolver.service';

describe('TemplateResolverService', () => {
  let service: TemplateResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TemplateResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
