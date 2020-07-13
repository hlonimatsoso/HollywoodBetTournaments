import { Component, OnInit,Input, OnDestroy } from '@angular/core';
import { Tournament } from '../../../shared/models/Tournament';
import { TournamentOracleService } from '../tournament-oracle.service';
import { Animations } from 'src/app/core/shared/models/Animations';



@Component({
  selector: 'app-tournament-card',
  templateUrl: './tournament-card.component.html',
  styleUrls: ['./tournament-card.component.scss'],
  animations:[
    Animations.fadeAnimation(null)
  ]
})
export class TournamentCardComponent{

  @Input() tournament: Tournament;
  @Input() isEditingEnabled:boolean;
  @Input() oracleDeleteList:Tournament[];

  constructor(private _ohGreatOracle:TournamentOracleService) { }

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
