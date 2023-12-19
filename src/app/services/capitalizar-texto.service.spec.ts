import { TestBed } from '@angular/core/testing';

import { CapitalizarTextoService } from './capitalizar-texto.service';

describe('CapitalizarTextoService', () => {
  let service: CapitalizarTextoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CapitalizarTextoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
