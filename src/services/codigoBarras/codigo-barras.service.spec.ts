import { TestBed } from '@angular/core/testing';

import { CodigoBarrasService } from './codigo-barras.service';

describe('CodigoBarrasService', () => {
  let service: CodigoBarrasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CodigoBarrasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
