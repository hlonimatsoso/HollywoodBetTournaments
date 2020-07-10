import { TestBed } from '@angular/core/testing';

import { EventDetailsOracleService } from './event-details-oracle.service';

describe('EventOracleService', () => {
  let service: EventDetailsOracleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventDetailsOracleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
