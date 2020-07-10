import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventDetailsCardListComponent } from '../event-card-list/event-card-list.component';

describe('EventDetailsCardListComponent', () => {
  let component: EventDetailsCardListComponent;
  let fixture: ComponentFixture<EventDetailsCardListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventDetailsCardListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventDetailsCardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
