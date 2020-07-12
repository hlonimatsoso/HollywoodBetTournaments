import { Component, OnInit , OnDestroy} from '@angular/core';
import { Tournament } from '../../../shared/models/Tournament';
import { TournamentOracleService } from '../tournament-oracle.service';
import { tap } from 'rxjs/operators';



@Component({
  selector: 'app-tournament-card-list',
  templateUrl: './tournament-card-list.component.html',
  styleUrls: ['./tournament-card-list.component.scss']
})
export class TournamentCardListComponent implements OnInit,OnDestroy {

  tournaments:Tournament[];
  enableEditing:boolean;

  constructor(private _ohGreatOracle:TournamentOracleService) { }

  ngOnDestroy(): void {
    console.log(`TournamentCardList.ngOnDestroy() : orcalePleaseMeGetAllTournamentsSubscription.unsubscribe()`);
 }
 
  ngOnInit(): void {

    this._ohGreatOracle.ready$.subscribe(oracle => {
      console.log(`TournamentCardList.ngOnInit()._ohGreatOracle.ready$.subscribe() : Ready to receive list update from the oracle`);
      this.tournaments = oracle.tournaments$.getValue();    
    });

    // this._ohGreatOracle.tournament_ToolBar_on_add_Tournament$.subscribe((tournament)=>{
    //   console.log(`TournamentCardList.ngOnInit().tournament_ToolBar_on_add_Tournament$.subscribe() : Thank you oracle the new tournament -> ${JSON.stringify(tournament)}`);
    //   this.tournaments.push(tournament);
    // });

    this._ohGreatOracle.tournament_ToolBar_on_Enable_ToolBar_Editing_Options_Change$.subscribe((setting)=>{
      console.log(`TournamentCardList.ngOnInit().tournament_ToolBar_on_Enable_ToolBar_Editing_Options_Change$.subscribe() : Updating this.enableEditng to -> ${JSON.stringify(setting)}`);
      this.enableEditing = setting;
    });

    this._ohGreatOracle.tournament_toolBar_onUpdate_Tournament$.subscribe((tournament)=>{
      //console.log(`Tournament List: _messageBus.tournamentToolBox_updatedTournament$ : ${value}`);
      const index = this.tournaments.findIndex(t => t.tournamentID == tournament.tournamentID);
      //console.log(`Tournament List: Before update: (${this._tournaments[index].tournamentID}) ${this._tournaments[index].tournamentName} `);
      this.tournaments[index] = tournament;
      //console.log(`Tournament List: After update: (${this._tournaments[index].tournamentID}) ${this._tournaments[index].tournamentName} `);

    });

    this._ohGreatOracle.tournament_toolBar_onDelete_TournamentList$.subscribe((tournamentList)=>{
     this.removefromList(tournamentList)
    });
        
  }

  removefromList(list:Tournament[]){
    var index;
    for (var t of list) {
      
      index = this.tournaments.indexOf(t);

      if (index >= 0) {
        this.tournaments.splice(index, 1);
      }
    }
  }

  get isTournamentListEmpty(){
   
    let result:Boolean = false;
    if(this.tournaments && this.tournaments.length == 0) 
    result
    return this.tournaments && this.tournaments.length == 0;
  }

}
