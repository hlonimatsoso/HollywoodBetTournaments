import { Component, OnInit,Input, OnDestroy } from '@angular/core';
import { Tournament } from '../../../shared/models/Tournament';
import { TournamentOracleService } from '../tournament-oracle.service';
import { Animations } from 'src/app/core/shared/models/Animations';
import { RaceEvent } from 'src/app/core/shared/models/Event';
import { EventOracleService } from '../../events/event-oracle.service';



@Component({
  selector: 'app-tournament-card',
  templateUrl: './tournament-card.component.html',
  styleUrls: ['./tournament-card.component.scss'],
  animations:[
    Animations.fadeAnimation(null)
  ]
})
export class TournamentCardComponent implements OnInit{

  @Input() tournament: Tournament;
  @Input() isEditingEnabled:boolean;
  @Input() oracleDeleteList:Tournament[];

  events:RaceEvent[];

  constructor(private _ohGreatOracle:TournamentOracleService,private _ohGreatEventOracle:EventOracleService) {
    this.oracleDeleteList = [];
    this.events = [];
   }
  ngOnInit(): void {
      this.events = this._ohGreatOracle.getEventsForTournamentID(this.tournament.tournamentID);
  }

  get isMarkedForDeletion(){
    if(!this.oracleDeleteList)
      return false;

    const index = this.oracleDeleteList.findIndex(t => t.tournamentID == this.tournament.tournamentID);

    return index > -1;

  }


  onEdit(eventArgument){

    console.log(`TournamentCard.onEdit(): Javascript event argument : ${JSON.stringify(eventArgument)}`);
    this._ohGreatOracle.setCurrentEditingTournament(this.tournament);

  }


  onDelete(eventArgument){
   
    console.log(`TournamentCard.onDelete(): Javascript event argument : ${JSON.stringify(eventArgument)}`);
    this._ohGreatOracle.addToTournamentDeleteList(this.tournament);
 }


  get getYingYangState(){

    return this.isEditingEnabled ? "on":"off";

  }

}
