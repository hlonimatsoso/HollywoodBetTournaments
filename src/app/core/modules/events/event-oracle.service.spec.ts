import { TestBed } from '@angular/core/testing';

import { EventOracleService } from './event-oracle.service';

describe('EventOracleService', () => {
  let service: EventOracleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventOracleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
