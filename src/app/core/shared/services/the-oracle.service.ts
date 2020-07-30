import { Injectable } from '@angular/core';
import { TournamentOracleService } from '../../modules/tournaments/tournament-oracle.service';
import { EventOracleService } from '../../modules/events/event-oracle.service';
import { EventDetailsOracleService } from '../../modules/event-details/event-details-oracle.service';
import { Tournament } from '../models/Tournament';
import { RaceEvent } from '../models/Event';
import { AuthServiceService } from '../../auth/auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class TheOracleService {

  // t_tournaments:Tournament[]
  // t_tournamentDeleteList:Tournament[]

  // e_events:RaceEvent[]
  // e_eventDeleteList:RaceEvent[]
  // e_editingAction:string;
  // e_editingEvent:RaceEvent;
  // e_isToolBarEnabled:true;


  
  constructor(public tournamentOracle:TournamentOracleService,
              public eventOracle:EventOracleService,
              public eventDetailsOracle:EventDetailsOracleService,
              public authService: AuthServiceService) { 

    // this.configureTournaments(_tournamentOracle);
    // this.configureEvents(_eventOracle);
  }

/*
configureTournaments(_oracle: TournamentOracleService) {
    
    _oracle.ready$.subscribe(me => {

      // Tournaments
      me.tournaments$.subscribe(tournaments => {
        this.t_tournaments = tournaments;
      });

      // Tournaments Delete List
      me.tournamentsToDelete$.subscribe(deleteList => {
        this.t_tournamentDeleteList = deleteList;
      });

    });


  }


  configureEvents(_oracle: EventOracleService) {
    _oracle.ready$.subscribe(me => {

      // Events
      me.events$.subscribe(events => {
        this.e_events = events;
      });

      // Events Delete List
      me.eventsToDelete$.subscribe(deleteList => {
        this.e_eventDeleteList = deleteList;
      });

      // Editing action
      me.currentEditingAction$.subscribe(action => {
        this.e_eventDeleteList = deleteList;
      });

    });
  }
*/
  

}
