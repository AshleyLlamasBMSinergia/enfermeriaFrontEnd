import { TestBed } from '@angular/core/testing';

import { AccidentesService } from './accidentes.service';

describe('AccidentesService', () => {
  let service: AccidentesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccidentesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
