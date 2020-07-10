import { TestBed } from '@angular/core/testing';

import {EventDetailsService } from './event-details.service';

describe('EventService', () => {
  let service:EventDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
