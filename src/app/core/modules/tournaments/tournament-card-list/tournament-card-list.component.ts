import { Component, OnInit , OnDestroy} from '@angular/core';
import { Tournament } from '../../../shared/models/Tournament';
import { TournamentOracleService } from '../tournament-oracle.service';
import { tap } from 'rxjs/operators';
import { Animations } from 'src/app/core/shared/models/Animations';
import { TheOracleService } from 'src/app/core/shared/services/the-oracle.service';


/**
 * Tournament Card List component will soon _support_ [Markdown](https://marked.js.org/)
 * @description Container of Tournament Oracle subscribtions for Tournament Cards to bind to. Amounts to less subscribtions overall.
 * @NB : All Tournament Cards SHOULD bind to the lists options & NOT subscribe to the oracle, if not needed to. 
 */
@Component({
  selector: 'app-tournament-card-list',
  templateUrl: './tournament-card-list.component.html',
  styleUrls: ['./tournament-card-list.component.scss'],
  animations:[
   Animations.InOutAnimation(null)
  ]
})
export class TournamentCardListComponent implements OnInit,OnDestroy {

  tournaments:Tournament[];
  isEditingEnabled:boolean;
  oracleDeleteList:Tournament[];

  private _ready$Subscrioption;
  private _tournaments$Subscrioption;
  private _isToolBarEnabled$Subscrioption;
  private _tournamentsToDelete$Subscription;

  constructor(private _oracle:TheOracleService) { 

    //this.oracleDeleteList = [];
  }
 
  ngOnInit(): void {

    console.log(`TournamentCardList.ngOnInit()._ohGreatOracle.ready$.subscribe() : Oracle data ready, binding to the folling streams: 'oracle.tournaments$', 'oracle.isToolBarEnabled$' and 'oracle.tournamentsToDelete$'`);

    // Bind to oracles list of Tournaments
    this._tournaments$Subscrioption = this._oracle.tournamentOracle.tournaments$.subscribe( list => {
      this.tournaments = list;
    })

    // Bind to oracles is Editing Enabled flag
    this._isToolBarEnabled$Subscrioption =  this._oracle.tournamentOracle.isToolBarEnabled$.subscribe(flag => {
            this.isEditingEnabled = flag;
    });

    // Bind to oracles delete list
    this._tournamentsToDelete$Subscription =  this._oracle.tournamentOracle.tournamentsToDelete$.subscribe( list => {
              this.oracleDeleteList = list;
    });
  }

  ngOnDestroy(): void {

    console.log(`TournamentCardList.ngOnDestroy() : Unsubscribing from oracle._ready$, oracle.isToolBarEnabled$, oracle.tournamentsToDelete$ & oracle.tournaments$ subscribtions`);
    
    this._isToolBarEnabled$Subscrioption.unsubscribe();
    this._tournamentsToDelete$Subscription.unsubscribe();
    this._tournaments$Subscrioption.unsubscribe();

  }
 
  
  get isTournamentListEmpty() {
   
    let result:Boolean = false;

    if(this.tournaments && this.tournaments.length == 0) 
      result

    return this.tournaments && this.tournaments.length == 0;

  }

}
