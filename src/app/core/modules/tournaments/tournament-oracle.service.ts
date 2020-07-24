import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { TournamentService } from './tournament.service';
import { Tournament } from './../../shared/models/Tournament';
import {Subject,BehaviorSubject,Observable, of, throwError} from 'rxjs';
import {ConfigService  } from '../../shared/services/config.service';
import {map, tap,finalize,catchError } from 'rxjs/operators';
import { Constants } from '../../shared/models/constants';
import { Action } from 'rxjs/internal/scheduler/Action';
import { OracleBase } from '../../shared/models/OracleBase';
import { EventOracleService } from '../events/event-oracle.service';
import { RaceEvent } from '../../shared/models/Event';

/**
 * Tournament Oracle Service will soon _support_ [Markdown](https://marked.js.org/)
 * @description The co-rodinator for all things Tournaments, from CRUD to facilitating comms between other oracles.
 * @NB : All components subscribe _ONLY_ to the _ONLY_ orcale within their module. Any comms required from other module s
 * should go though from 1 oracle to another and back to the component   
 */
@Injectable({
  providedIn: 'root'
})
export class TournamentOracleService implements OracleBase {

  ready$ = new BehaviorSubject(this);
  tournaments$ = new BehaviorSubject(null);
  allEvents$ = new BehaviorSubject<RaceEvent[]>(null);
  tournamentsToDelete$ = new BehaviorSubject(null);
  currentEditingAction$ = new BehaviorSubject(Constants.toolbar_button_add_action);
  currentEditingTournament$ = new BehaviorSubject(null);
  isToolBarEnabled$ = new BehaviorSubject(false);
  

  constructor(private _service:TournamentService, private _config:ConfigService,private _ohGreatEventOracle:EventOracleService) {
    console.log(`TournamentOracle.constructor() : Loading tournaments...`);
    
    this.loadTournaments();

    this._ohGreatEventOracle.ready$.subscribe(oracle => {
      oracle.events$.subscribe(events => {
        this.allEvents$.next(events);
      });
    });
  }
 
/**
* @ngdoc function
* @name getTournamentByID
* @methodOf Tournament Oracle Service
* @normallyExecutedBy Those want a Tournament, but only have the ID
* @description Returns the Tournament with the argument ID
* @param tournamentID Number
* @returns Tournament 
*/
getTournamentByID(tournamentID:number):Tournament{
  var result = this.tournaments$.getValue();

  if(!result)
    return new Tournament(0,"");

  return result.find( x => x.tournamentID == tournamentID);
}

/**
* @ngdoc function
* @name addToTournamentDeleteList
* @methodOf Tournament Oracle Service
* @normallyExecutedBy The "Tournament Card" component
* @description Soft deletes an item on the screen before the db update
* @param {Tournament=} tournament tournament to mark for deletion
* @returns {void} no return
*/
  addToTournamentDeleteList(tournament:Tournament){
   var currentList:Tournament[] = this.tournamentsToDelete$.getValue();
    
    if(!currentList)
      currentList = [];

    currentList.push(tournament);
    this.tournamentsToDelete$.next(currentList);
    this.currentEditingAction$.next(Constants.toolbar_button_delete_action);
  }

  /**
* @ngdoc function
* @name getEventsForTournamentID
* @methodOf Tournament Oracle Service
* @normallyExecutedBy Those want a list of Events that belong to a particular tournament ID
* @description Returns a list of Events with the argument ID
* @param tournamentID Number
* @returns RaceEvent[] 
*/
getEventsForTournamentID(tournamentID:number):RaceEvent[]{
  var list = this.allEvents$.getValue();
  if(list == null)
    return null;

  return list.filter( x => x.tournamentID == tournamentID);
}

/**
* @ngdoc function
* @name setCurrentEditingTournament
* @methodOf Tournament Oracle Service
* @normallyExecutedBy The "Tournament Card" component
* @description Sets tournament for editing, and eventually to be updated
* @param {Tournament=} tournament tournament to mark for editing
* @returns {void} no return
*/
  setCurrentEditingTournament(tournament:Tournament){
    this.currentEditingTournament$.next(tournament);
    this.currentEditingAction$.next(Constants.toolbar_button_edit_action);
  }

/**
* @ngdoc function
* @name onCurrentActionChange
* @methodOf Tournament Oracle Service
* @normallyExecutedBy The "Tournament Tool Bar" component
* @description Broadcasts the change of the Action state of the Oracle.
* @param {action=} string Either "Add", "Edit" or "Delete"
* @returns {void} no return
*/
  onCurrentActionChange(action:string){
    this.currentEditingAction$.next(action);
    if(action == Constants.toolbar_button_add_action)
      this.currentEditingAction$.next(Constants.toolbar_button_add_action);
  }

/**
* @ngdoc function
* @name onIsToolBarEnabledChange
* @methodOf Tournament Oracle Service
* @normallyExecutedBy The "Tournament Tool Bar" component
* @description Broadcasts the change of the Tournaments ToolBar's "On" & "Off" state
* @param {action=} string Either "Add", "Edit" or "Delete"
* @returns {void} no return
*/
  onIsToolBarEnabledChange(flag:boolean){
    this.isToolBarEnabled$.next(flag);
  }

/**
* @ngdoc function
* @name loadTournaments
* @methodOf Tournament Oracle Service
* @normallyExecutedBy The Oracle himeself, in his constructor
* @description Loads all the required tournaments, then broadcasts an updated version of it's self for binding
* @param NONE
* @returns void
*/
  private loadTournaments(){

    if(this._config.LoggingSettings.TournamentOracleService_Can_Log)
      console.log(`TournamentOracle.pleaseGetMeGetAllTournaments(): Requesting all tournaments...`);

      this._service.getAllTournaments()
                .pipe(
                  tap(dbList=>{
                    if(this._config.LoggingSettings.TournamentOracleService_Can_Log)
                      console.log(`TournamentOracle.pleaseGetMeGetAllTournaments().tap(): Setting The Oracles list with the result -> ${JSON.stringify(dbList)}`);
                  }),
                  finalize(()=>{
                    if(this._config.LoggingSettings.TournamentOracleService_Can_Log)
                      console.log(`TournamentOracle.pleaseGetMeGetAllTournaments().finalize(): Requesting all tournaments complete`);
                  }),
                  catchError( error =>{ 
                    var msg:String;
                    msg = `TournamentOracle.loadTournaments().catchError()\nFailed to load tournaments\n${error}`;
                    console.error(`${msg}`);
                    return throwError(`${msg}`)
                  })

                ).subscribe(list=>{                  
                  if(list){
                    this.tournaments$ = new BehaviorSubject(list);
                    this.ready$.next(this);
                    this.tournaments$.next(list);
                    console.log(`TournamentOracle.loadTournaments().subscribe()  : Tournament Oracle is now ready, tournaments list defaulted to -> ${JSON.stringify(list)}`);
                  }
                });

  }

/**
* @ngdoc function
* @name pleaseAddATournament
* @methodOf Tournament Oracle Service
* @normallyExecutedBy The "Tournament Tool Bar" component
* @description Inserts a Tournament in the databse 
* @param {action=} Tournament
* @returns {Tournament}
*/
  pleaseAddATournament(data:Tournament){

    this._service.postATournament(data)
                  .pipe(
                    tap(tournament => {
                     if(tournament){
                        if(this._config.LoggingSettings.TournamentOracleService_Can_Log)
                          console.log(`TournamentOracle.pleaseAddATournament().tap(): Tournament added to db -> ${JSON.stringify(tournament)}`);
                        }
                      else
                          console.warn(`TournamentOracle.pleaseAddATournament().tap(): Result is fucked. DB insert probably failed, check logs!!!`);
                    }),
                    finalize(()=>{
                      if(this._config.LoggingSettings.TournamentOracleService_Can_Log)
                        console.log(`TournamentOracle.pleaseAddATournament().finalize(): Request to Add a tournament is complete.`);
                    }),
                    catchError( error => { 
                      var msg = "*** TournamentOracle.pleaseAddATournament().catchError(): \nTournament Oracle CAUGHT sleeping on the job ***\n";
                      console.error(`${msg} : ${error}`);
                      return of(`${msg} : ${error}`)
                    })
                 ).subscribe(tournament => {
                      if(tournament){
                          // Add new tournament to orcale list
                          var list:Tournament[] = this.tournaments$.getValue();
                          list.push(tournament);

                          // Broadcast updated list of tournaments
                          this.tournaments$.next(list);
                          if(this._config.LoggingSettings.TournamentOracleService_Can_Log)
                            console.log(`TournamentOracle.pleaseAddATournament().subscribe() : Added tournament to Oracle list and then broadcasted updated list -> ${JSON.stringify(list)}`);
                        }
                        else
                          console.warn(`TournamentOracle.pleaseAddATournament().subscribe(): Result is fucked. DB insert probably failed, check them logs playa`);                    
                 });

  }

/**
* @ngdoc function
* @name pleaseUpdateATournament
* @methodOf Tournament Oracle Service
* @normallyExecutedBy The "Tournament Tool Bar" component
* @description Updates a Tournament in the databse 
* @param {action=} Tournament
* @returns {Tournament}
*/
  pleaseUpdateATournament(data:Tournament){

      this._service.updateTournament(data)
                    .pipe(
                      tap(result => {
                        if(this._config.LoggingSettings.TournamentOracleService_Can_Log)
                          console.log(`TournamentOracle.pleaseUpdateATournament().tap(): Result if any -> ${JSON.stringify(result)}`);
                      }),
                      finalize(() => {
                        if(this._config.LoggingSettings.TournamentOracleService_Can_Log)
                          console.log(`TournamentOracle.pleaseUpdateATournament().finalize(): Request to Update the tournament is complete. About to broadcast the UPDATED tournament -> ${JSON.stringify(data)}`);
                      }),
                      catchError( error => { 
                        var msg = "*** TournamentOracle.pleaseAddATournament().catchError(): \nTournament Oracle CAUGHT sleeping on the job ***\n";
                        console.error(`${msg} : ${error}`);
                        return of(`${msg} : ${error}`)
                      })
                    ).subscribe(tournament => {

                        // update orcale tournament (after sucessfull delete)
                        if(tournament){
                          var list:Tournament[] = this.tournaments$.getValue();
                          list.forEach(element => {
                            if(element.tournamentID == tournament.tournamentID)
                                element.tournamentName = tournament.tournamentName;
                          });

                          // braoadcast update
                          this.tournaments$.next(list);
                          if(this._config.LoggingSettings.TournamentOracleService_Can_Log)
                            console.log(`TournamentOracle.pleaseUpdateTournament().subscribe() : Updated tournament it to Oracle list and then broadcasted updated list -> ${JSON.stringify(list)}`);
                        }
                        else
                          console.warn(`TournamentOracle.pleaseUpdatedTournament().tap(): Result is fucked. DB insert probably failed`);                    
                    });

  }


/**
* @ngdoc function
* @name pleaseDeleteTheseTournaments
* @methodOf Tournament Oracle Service
* @normallyExecutedBy The "Tournament Tool Bar" component
* @description Deletes mnultiple Tournaments in the databse at once
* @param {action=} Tournament
* @returns {Tournament}
*/
  pleaseDeleteTheseTournaments(data:Tournament[]){

     this._service.deleteTournamentList(data)
                  .pipe(
                    tap( result => {
                      if(this._config.LoggingSettings.TournamentOracleService_Can_Log)
                        console.log(`TournamentOracle.pleaseDeleteTheseTournaments().tap(): Result if any -> ${JSON.stringify(result)}`);
                    }),
                    finalize(() => {
                      if(this._config.LoggingSettings.TournamentOracleService_Can_Log)
                        console.log(`TournamentOracle.pleaseDeleteTheseTournaments().finalize(): Request to Update the tournament is complete. About to broadcast the UPDATED tournament -> ${JSON.stringify(data)}`);
                    }),
                    catchError( error => { 
                      var msg = "*** TournamentOracle.pleaseDeleteTheseTournaments().catchError(): \nTournament Oracle CAUGHT sleeping on the job ***\n";
                      console.error(`${msg} : ${error}`);
                      return of(`${msg} : ${error}`)
                    })

                  ).subscribe(result => {
                    var list = this.tournaments$.getValue();
                    var deleteList = [];
                    var index;

                    // loop delete list and remove each item from the current list
                    data.forEach(element => {
                      index = list.indexOf(element);
                      if(index >= 0)
                        list.splice(index,1);
                        // abouve action updates the actual list, thus updadting those already bound to it. need to confirm this officially
                    });

                    this.tournamentsToDelete$.next(deleteList);
                  });

  }

}


