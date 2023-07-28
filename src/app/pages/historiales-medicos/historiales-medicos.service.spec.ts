import { TestBed } from '@angular/core/testing';

import { HistorialesMedicosService } from './historiales-medicos.service';

describe('HistorialesMedicosService', () => {
  let service: HistorialesMedicosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistorialesMedicosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
