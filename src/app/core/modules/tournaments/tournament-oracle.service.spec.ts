import { TestBed } from '@angular/core/testing';

import { TournamentOracleService } from './tournament-oracle.service';

describe('TournamentOracleService', () => {
  let service: TournamentOracleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TournamentOracleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
