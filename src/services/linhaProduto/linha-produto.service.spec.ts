import { TestBed } from '@angular/core/testing';

import { LinhaProdutoService } from './linha-produto.service';

describe('LinhaProdutoService', () => {
  let service: LinhaProdutoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LinhaProdutoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
