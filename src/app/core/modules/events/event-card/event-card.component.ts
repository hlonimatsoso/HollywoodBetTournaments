import { Component, OnInit,Input } from '@angular/core';
import { RaceEvent } from '../../../shared/models/Event';
import { EventOracleService } from '../event-oracle.service';
import { TournamentOracleService } from '../../tournaments/tournament-oracle.service';
import { Tournament } from 'src/app/core/shared/models/Tournament';
import { debug } from 'console';



@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss']
})
export class EventCardComponent implements OnInit {

  @Input() event: RaceEvent;
  @Input() isEditingEnabled:boolean;
  @Input() oracleDeleteList:RaceEvent[];

  tournament:Tournament;

  get isMarkedForDeletion(){
    if(!this.oracleDeleteList)
      return false;
    const index = this.oracleDeleteList.findIndex(t => t.eventID == this.event.eventID);

    return index > -1;
  }
  constructor(private _ohGreatOracle:EventOracleService,private _ohGreatTournamentOracle:TournamentOracleService) {
    this.oracleDeleteList = [];
   }

  ngOnInit(): void {
    this.tournament = this._ohGreatTournamentOracle.getTournamentByID(this.event.tournamentID);
    debugger;
  }

  onEdit(eventArgument){
    
    console.log(`EventCard.onEdit(): Javascript event argument : ${JSON.stringify(eventArgument)}`);
    this._ohGreatOracle.setCurrentEditingEvent(this.event);
  }

  onDelete(eventArgument){
    console.log(`EventCard.onDelete(): Javascript event argument : ${JSON.stringify(eventArgument)}`);
    this._ohGreatOracle.addToEventDeleteList(this.event);
  }

}
