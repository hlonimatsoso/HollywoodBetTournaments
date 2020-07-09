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

  tournaments:Tournament[] = [];
  enableEditing:boolean;

  private orcalePleaseMeGetAllTournamentsSubscription:any;

  constructor(private _ohGreatOracle:TournamentOracleService) { }
  ngOnDestroy(): void {
    console.log(`TournamentCardList.ngOnDestroy() : orcalePleaseMeGetAllTournamentsSubscription.unsubscribe()`);
    this.orcalePleaseMeGetAllTournamentsSubscription.unsubscribe();
  }
 
  ngOnInit(): void {
    
     this.orcalePleaseMeGetAllTournamentsSubscription = this._ohGreatOracle.pleaseMeGetAllTournaments()
                                                        .pipe(
                                                          tap(list => {
                                                            console.log(`TournamentCardList.ngOnInit()._ohGreatOracle.pleaseMeGetAllTournaments().tap(): Result -> ${JSON.stringify(list)}`);
                                                          })
                                                        )
                                                        .subscribe(list => {
                                                          console.log(`TournamentCardList.ngOnInit()._ohGreatOracle.pleaseMeGetAllTournaments().subscribe(): Setting Card-List tournaments with result -> ${JSON.stringify(list)}`);
                                                         this.tournaments = list;
                                                        });
    
  }

  get isTournamentListEmpty(){
   
    let result:Boolean = false;
    if(this.tournaments && this.tournaments.length == 0) 
    result
    return this.tournaments && this.tournaments.length == 0;
  }

}
