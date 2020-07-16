import { TestBed } from '@angular/core/testing';

import { TheOracleService } from './the-oracle.service';

describe('TheOracleService', () => {
  let service: TheOracleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TheOracleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
