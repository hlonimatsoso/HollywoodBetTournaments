import { Component, OnInit,Input } from '@angular/core';
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
export class TournamentCardComponent implements OnInit {

  @Input() tournament: Tournament;
  @Input() enableEditing:boolean;
  //_isEditing:boolean;

  private _oracleDeleteLost:Tournament[];

  get isMarkedForDeletion(){
    if(!this._oracleDeleteLost)
      return false;

    const index = this._oracleDeleteLost.findIndex(t => t.tournamentID == this.tournament.tournamentID);

    return index > -1;
  }
  constructor(private _ohGreatOracle:TournamentOracleService) { }

  ngOnInit(): void {
    this._ohGreatOracle.ready$.subscribe(oracle => {
      oracle.tournamentsToDelete$.subscribe(deleteList => {
        this._oracleDeleteLost = deleteList;
      });
    });
  }

  onEdit(eventArgument){
    
    console.log(`TournamentCard.onEdit(): Javascript event argument : ${JSON.stringify(eventArgument)}`);
   
    // var id:number = eventArgument.currentTarget.attributes.getNamedItem("data-tournamentID").value;
    // var name:string = eventArgument.currentTarget.attributes.getNamedItem("data-tournamentName").value;
    // var previouseTournament = new Tournament(id,name);

    // console.log(`TournamentCard.onEdit(): Editing this Tournament : ${JSON.stringify(previouseTournament)}`);
    
    // this.tournament.tournamentID = id;
    // this.tournament.tournamentName = name;
    // var tournament = new Tournament(this.tournament.tournamentID,this.tournament.tournamentName);
    
    //console.log(`TournamentCard.onEdit(): Editing this tournament -> ${JSON.stringify(this.tournament)}`);
    this._ohGreatOracle.setActiveTournamentDeleteList(this.tournament);
    //this._ohGreatOracle.tournament_card_onEdit_Tournament_BroadcastUpdate(this.tournament);
  }

  onDelete(eventArgument){
   
    // console.log(`TournamentCard.onDelete(): Javascript event argument : ${JSON.stringify(eventArgument)}`);

    // var id:number = eventArgument.currentTarget.attributes.getNamedItem("data-tournamentID").value;
    // var name:string = eventArgument.currentTarget.attributes.getNamedItem("data-tournamentName").value;
    // var tournament = new Tournament(id,name);
    // tournament.tournamentID = id;
    // tournament.tournamentName = name;

    // console.log(`TournamentCard.onDelete(): Marking tournament for deletion -> ${JSON.stringify(tournament)}`);
    
    this._ohGreatOracle.addToTournamentDeleteList(this.tournament);
    //this._ohGreatOracle.tournament_toolBar_onActionChange_BroadcastUpdate("Delete");
    //this._messageBus.tournamentCard_onDelete_BroadcastUpdate(tournament);
  }

  get getIsEnabledState(){
    return this.enableEditing ? "on":"off";
  }

}
