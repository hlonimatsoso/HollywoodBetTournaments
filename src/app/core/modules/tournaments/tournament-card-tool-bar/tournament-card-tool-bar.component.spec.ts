import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentCardToolBarComponent } from './tournament-card-tool-bar.component';

describe('TournamentCardToolBarComponent', () => {
  let component: TournamentCardToolBarComponent;
  let fixture: ComponentFixture<TournamentCardToolBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TournamentCardToolBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TournamentCardToolBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
