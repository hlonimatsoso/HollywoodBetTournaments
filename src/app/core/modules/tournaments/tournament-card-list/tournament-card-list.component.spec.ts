import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentCardListComponent } from './tournament-card-list.component';

describe('TournamentCardListComponent', () => {
  let component: TournamentCardListComponent;
  let fixture: ComponentFixture<TournamentCardListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TournamentCardListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TournamentCardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
