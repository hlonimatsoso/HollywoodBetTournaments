import { Component, OnInit,Input } from '@angular/core';
import { Tournament } from '../../../shared/models/Tournament';
import { MessageBusService } from '../../../shared/services/message-bus.service';



@Component({
  selector: 'app-tournament-card',
  templateUrl: './tournament-card.component.html',
  styleUrls: ['./tournament-card.component.scss']
})
export class TournamentCardComponent implements OnInit {

  @Input() tournament: Tournament;
  @Input() enableEditing:boolean;
  //_isEditing:boolean;

  constructor(private _messageBus:MessageBusService) { }

  ngOnInit(): void {
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
    
    console.log(`TournamentCard.onEdit(): Editing this tournament -> ${JSON.stringify(this.tournament)}`);

    this._messageBus.tournamentCard_onEdit_BroadcastUpdate(this.tournament);
  }

  onDelete(eventArgument){
   
    console.log(`TournamentCard.onDelete(): Javascript event argument : ${JSON.stringify(eventArgument)}`);

    var id:number = eventArgument.currentTarget.attributes.getNamedItem("data-tournamentID").value;
    var name:string = eventArgument.currentTarget.attributes.getNamedItem("data-tournamentName").value;
    var tournament = new Tournament(id,name);
    tournament.tournamentID = id;
    tournament.tournamentName = name;

    console.log(`TournamentCard.onDelete(): Marking tournament for deletion -> ${JSON.stringify(tournament)}`);

    this._messageBus.tournamentCard_onDelete_BroadcastUpdate(tournament);
  }

}
