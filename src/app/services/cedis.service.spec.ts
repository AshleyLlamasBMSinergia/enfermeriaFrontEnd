import { TestBed } from '@angular/core/testing';

import { CedisService } from './cedis.service';

describe('CedisService', () => {
  let service: CedisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CedisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
