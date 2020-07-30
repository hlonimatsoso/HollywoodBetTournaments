import { Component, OnInit,Input, OnDestroy } from '@angular/core';
import { Tournament } from '../../../shared/models/Tournament';
import { TournamentOracleService } from '../tournament-oracle.service';
import { Animations } from 'src/app/core/shared/models/Animations';
import { RaceEvent } from 'src/app/core/shared/models/Event';
import { EventOracleService } from '../../events/event-oracle.service';
import { TheOracleService } from 'src/app/core/shared/services/the-oracle.service';



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
  canDelete:boolean;

  constructor(private _oracle:TheOracleService) {
    this.oracleDeleteList = [];
    this.events = [];
   }
  ngOnInit(): void {
      this._oracle.eventOracle.events$.subscribe(e =>{
      this.events = e.filter(x => x.tournamentID == this.tournament.tournamentID);
      this.canDelete = this._oracle.authService.canDelete("tournaments");

      });
  }

  get isMarkedForDeletion(){
    if(!this.oracleDeleteList)
      return false;

    const index = this.oracleDeleteList.findIndex(t => t.tournamentID == this.tournament.tournamentID);

    return index > -1;

  }


  onEdit(eventArgument){

    console.log(`TournamentCard.onEdit(): Javascript event argument : ${JSON.stringify(eventArgument)}`);
    this._oracle.tournamentOracle.setCurrentEditingTournament(this.tournament);

  }


  onDelete(eventArgument){
   
    console.log(`TournamentCard.onDelete(): Javascript event argument : ${JSON.stringify(eventArgument)}`);
    this._oracle.tournamentOracle.addToTournamentDeleteList(this.tournament);
 }


  get getYingYangState(){

    return this.isEditingEnabled ? "on":"off";

  }

}
