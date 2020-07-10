import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventCardListComponent } from './event-card-list.component';

describe('EventCardListComponent', () => {
  let component: EventCardListComponent;
  let fixture: ComponentFixture<EventCardListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventCardListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventCardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
