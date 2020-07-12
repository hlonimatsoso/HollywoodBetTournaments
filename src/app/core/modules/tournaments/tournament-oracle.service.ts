import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { TournamentService } from './tournament.service';
import { Tournament } from './../../shared/models/Tournament';
import {Subject,BehaviorSubject,Observable, of} from 'rxjs';
import {ConfigService  } from '../../shared/services/config.service';
import {map, tap,finalize,catchError } from 'rxjs/operators';
import { Constants } from '../../shared/models/constants';


@Injectable({
  providedIn: 'root'
})
export class TournamentOracleService {

  private _tournament_ToolBar_on_Action_Change = new Subject<string>();
  private _tournament_ToolBar_on_Enable_ToolBar_Editing_Options_Change = new Subject<boolean>();
  private _tournament_ToolBar_on_add_Tournament = new Subject<Tournament>();
  private _tournament_card_onEdit_Tournament = new Subject<Tournament>();
  private _tournament_toolBar_onUpdate_Tournament = new Subject<Tournament>();
  private _tournament_card_onDelete_Tournament = new Subject<Tournament>();
  private _tournament_toolBar_onDelete_TournamentList = new Subject<Tournament[]>();

  //private _tournaments:Tournament[];

  tournaments$ = new BehaviorSubject(null);
  ready$ = new BehaviorSubject(this);
  tournamentsToDelete$ = new BehaviorSubject(null);
  currentEditingAction$ = new BehaviorSubject(Constants.toolbar_button_add_action);
  currentEditingTournament$ = new BehaviorSubject(null);
  isToolBarEnabled$ = new BehaviorSubject(false);


  
  constructor(private _service:TournamentService, private _config:ConfigService) {
    console.log(`TournamentOracle.constructor() : Tournament Oracle IN De house !!!`);
    //this.tournamentsToDelete = [];
    this.loadTournaments();
  }

  // ngOnDestroy(): void {
  //   debugger;
  //   console.error(`TournamentOracle.ngOnInit(): And Then I Was NO MORE...`);
  // }
  
  // ngOnInit(): void {

  //   debugger;
  //   console.warn(`TournamentOracle.ngOnInit(): I Was...`);
  // }



  get tournament_ToolBar_onActionChange$(): Observable<string> {
    return this._tournament_ToolBar_on_Action_Change.asObservable();
  }

  get tournament_ToolBar_on_Enable_ToolBar_Editing_Options_Change$(): Observable<boolean> {
    return this._tournament_ToolBar_on_Enable_ToolBar_Editing_Options_Change.asObservable();
  }

  get tournament_ToolBar_on_add_Tournament$(): Observable<Tournament> {
    return this._tournament_ToolBar_on_add_Tournament.asObservable();
  }

  get tournament_card_on_edit_Tournament$(): Observable<Tournament> {
    return this._tournament_card_onEdit_Tournament.asObservable();
  }

  get tournament_toolBar_onUpdate_Tournament$(): Observable<Tournament> {
    return this._tournament_toolBar_onUpdate_Tournament.asObservable();
  }

  get tournament_card_onDelete_Tournament$(): Observable<Tournament> {
    return this._tournament_card_onDelete_Tournament.asObservable();
  }

  get tournament_toolBar_onDelete_TournamentList$(): Observable<Tournament[]> {
    return this._tournament_toolBar_onDelete_TournamentList.asObservable();
  }


  public tournament_toolBar_onActionChange_BroadcastUpdate(action:string) {
    this._tournament_ToolBar_on_Action_Change.next(action);
    if(this._config.LoggingSettings.TournamentOracleService_Can_Log)
      console.log(`TournamentOracle.tournament_toolBar_onActionChange_BroadcastUpdate(): Broadcast -> ${action}`);
  }

  public tournament_ToolBar_onEnableToolBarEditingOptions_Change_BroadcastUpdate(isEnabled:boolean) {
    this._tournament_ToolBar_on_Enable_ToolBar_Editing_Options_Change.next(isEnabled);
    if(this._config.LoggingSettings.TournamentOracleService_Can_Log)
      console.log(`TournamentOracle.tournament_toolBar_onActionChange_BroadcastUpdate(): Broadcast -> ${isEnabled}`);
  }

  public tournament_ToolBar_on_add_Tournament_BroadcastUpdate(tournament:Tournament) {
    this._tournament_ToolBar_on_add_Tournament.next(tournament);
    if(this._config.LoggingSettings.TournamentOracleService_Can_Log)
      console.log(`TournamentOracle._tournament_ToolBar_on_add_Tournament(): Broadcasting new tournament -> ${JSON.stringify(tournament)}`);
  }

  public tournament_card_onEdit_Tournament_BroadcastUpdate(tournament:Tournament) {
    this._tournament_card_onEdit_Tournament.next(tournament);
    if(this._config.LoggingSettings.TournamentOracleService_Can_Log)
      console.log(`TournamentOracle.tournament_card_onEdit_Tournament_BroadcastUpdate(): Broadcasting cards wishes to be edited -> ${JSON.stringify(tournament)}`);
  }

  public tournament_toolBar_onUpdate_Tournament_BroadcastUpdate(tournament:Tournament) {
    this._tournament_toolBar_onUpdate_Tournament.next(tournament);
    if(this._config.LoggingSettings.TournamentOracleService_Can_Log)
      console.log(`TournamentOracle.tournament_toolBar_onUpdate_Tournament_BroadcastUpdate(): Broadcasting updated touranment -> ${JSON.stringify(tournament)}`);
  }

  // public tournament_card_onDelete_Tournament_BroadcastUpdate(tournament:Tournament) {
  //   this.tournamentsToDelete.push(tournament);
  //   this._tournament_card_onDelete_Tournament.next(tournament);
  //   if(this._config.LoggingSettings.TournamentOracleService_Can_Log)
  //     console.log(`TournamentOracle.tournament_card_onDelete_Tournament_BroadcastUpdate(): Broadcasting deleted touranment -> ${JSON.stringify(tournament)}`);
  // }

  public tournament_toolBar_onDelete_TournamentList_BroadcastUpdate(tournament:Tournament[]) {
    this.removefromList(tournament);
    this._tournament_toolBar_onDelete_TournamentList.next(tournament);
    if(this._config.LoggingSettings.TournamentOracleService_Can_Log)
      console.log(`TournamentOracle.tournament_toolBar_onDelete_TournamentList_BroadcastUpdate(): Broadcasting deleted touranment list-> ${JSON.stringify(tournament)}`);
  }

  addToTournamentDeleteList(tournament:Tournament){
    //debugger;
    var currentList:Tournament[] = this.tournamentsToDelete$.getValue();
    
    if(!currentList)
      currentList = [];

    currentList.push(tournament);
    this.tournamentsToDelete$.next(currentList);
    this.currentEditingAction$.next(Constants.toolbar_button_delete_action);
  }

  setActiveTournamentDeleteList(tournament:Tournament){
    this.currentEditingTournament$.next(tournament);
    this.currentEditingAction$.next(Constants.toolbar_button_edit_action);
  }

  removefromList(list:Tournament[]){
    var index;
    for (var t of list) {
      
      // index = this._tournaments.indexOf(t);

      // if (index >= 0) {
      //   this._tournaments.splice(index, 1);
      // }
    }
  }

  onCurrentActionChange(action:string){
    this.currentEditingAction$.next(action);
  }

  onToolBarToggleChange(flag:boolean){
    this.isToolBarEnabled$.next(flag);
  }

  loadTournaments(){

    if(this._config.LoggingSettings.TournamentOracleService_Can_Log)
      console.log(`TournamentOracle.pleaseGetMeGetAllTournaments(): Requesting all tournaments...`);

      this._service.GetAllTournaments()
                .pipe(
                  tap(dbList=>{
                    if(this._config.LoggingSettings.TournamentOracleService_Can_Log)
                      console.log(`TournamentOracle.pleaseGetMeGetAllTournaments().tap(): Setting The Oracles list with the result -> ${JSON.stringify(dbList)}`);
                  }),
                  finalize(()=>{
                    if(this._config.LoggingSettings.TournamentOracleService_Can_Log)
                      console.log(`TournamentOracle.pleaseGetMeGetAllTournaments().finalize(): Requesting all tournaments complete`);
                  }),
                  catchError( val =>{ 
                    var msg:String;
                    msg = "*** \nTournament Oracle CAUGHT sleeping on the job ";
                    console.error(`TournamentOracle.pleaseGetMeGetAllTournaments().catchError(): !!! ERROR !!! -> ${msg}\n***`);
                    return of(`${msg}: ${val}`)
                  })

                ).subscribe(list=>{                  
                  if(list){
                    this.tournaments$ = new BehaviorSubject(list);
                    this.ready$.next(this);
                    console.log(`TournamentOracle.loadTournaments().subscribe() : Tournament Oracle is now ready, tournaments list defaulted to -> ${JSON.stringify(list)}`);
                  }
                });

  }


  pleaseAddATournament(data:Tournament){

    this._service.PostATournament(data)
                  .pipe(
                    tap(tournament => {
                      debugger;
                      if(tournament){
                        if(this._config.LoggingSettings.TournamentOracleService_Can_Log)
                          console.log(`TournamentOracle.pleaseAddATournament().tap(): Tournament added to db -> ${JSON.stringify(tournament)}`);
                        }else
                            console.warn(`TournamentOracle.pleaseAddATournament().tap(): Result is fucked. DB insert probably failed`);
                    }),
                    finalize(()=>{
                      debugger;
                      if(this._config.LoggingSettings.TournamentOracleService_Can_Log)
                        console.log(`TournamentOracle.pleaseAddATournament().finalize(): Request to Add a tournament is complete.`);
                    }),
                    catchError( val =>{ 
                      debugger;
                      var msg:String;
                      msg = "*** \nTournament Oracle CAUGHT sleeping on the job ";
                      console.error(`TournamentOracle.pleaseAddATournament().catchError(): !!! ERROR !!! -> ${msg}\n***`);
                      return of(`${msg}: ${val}`)
                    })

                  ).subscribe(tournament => {
                    debugger;
                    if(tournament){
                      var list:Tournament[] = this.tournaments$.getValue();
                      list.push(tournament);
                      this.tournaments$.next(list);
                      if(this._config.LoggingSettings.TournamentOracleService_Can_Log)
                        console.log(`TournamentOracle.pleaseAddATournament().subscribe() : Addied tournament it to Oracle list and then broadcasted updated list -> ${JSON.stringify(list)}`);
                    }
                    else
                      console.warn(`TournamentOracle.pleaseAddATournament().tap(): Result is fucked. DB insert probably failed`);                    

                  });

  }

  pleaseUpdateATournament(data:Tournament){

    // if(this._config.LoggingSettings.TournamentOracleService_Can_Log)
    //   console.log(`TournamentOracle.pleaseUpdateATournament(): Updating 1 tournament -> ${data}`);

    this._service.UpdateTournament(data)
                  .pipe(
                    tap(result=>{
                      if(this._config.LoggingSettings.TournamentOracleService_Can_Log)
                        console.log(`TournamentOracle.pleaseUpdateATournament().tap(): Result if any -> ${JSON.stringify(result)}`);
                    }),
                    finalize(()=>{
                      if(this._config.LoggingSettings.TournamentOracleService_Can_Log)
                        console.log(`TournamentOracle.pleaseUpdateATournament().finalize(): Request to Update the tournament is complete. About to broadcast the UPDATED tournament -> ${JSON.stringify(data)}`);
                        this.tournament_toolBar_onUpdate_Tournament_BroadcastUpdate(data);
                    }),
                    catchError( val =>{ 
                      var msg:String;
                      msg = "*** \nTournament Oracle CAUGHT sleeping on the job ";
                      console.error(`TournamentOracle.pleaseUpdateATournament().catchError(): !!! ERROR !!! -> ${msg}\n***`);
                      return of(`${msg}: ${val}`)
                    })

                  ).subscribe(tournament => {
                    debugger;
                    if(tournament){
                      var list:Tournament[] = this.tournaments$.getValue();
                      var index = list.indexOf(tournament);
                      if(index >= 0)
                        list[index] = tournament

                     this.tournaments$.next(list);
                      if(this._config.LoggingSettings.TournamentOracleService_Can_Log)
                        console.log(`TournamentOracle.pleaseUpdateTournament().subscribe() : Updated tournament it to Oracle list and then broadcasted updated list -> ${JSON.stringify(list)}`);
                    }
                    else
                      console.warn(`TournamentOracle.pleaseUpdatedTournament().tap(): Result is fucked. DB insert probably failed`);                    
                  });

  }

  pleaseDeleteTheseTournaments(data:Tournament[]){

    if(this._config.LoggingSettings.TournamentOracleService_Can_Log)
      console.log(`TournamentOracle.pleaseUpdateATournament(): Updating 1 tournament -> ${data}`);

     this._service.DeleteTournamentList(data)
                  .pipe(
                    tap(result=>{
                      if(this._config.LoggingSettings.TournamentOracleService_Can_Log)
                        console.log(`TournamentOracle.pleaseUpdateATournament().tap(): Result if any -> ${JSON.stringify(result)}`);
                    }),
                    finalize(()=>{
                      if(this._config.LoggingSettings.TournamentOracleService_Can_Log)
                        console.log(`TournamentOracle.pleaseUpdateATournament().finalize(): Request to Update the tournament is complete. About to broadcast the UPDATED tournament -> ${JSON.stringify(data)}`);
                        //this.tournament_toolBar_onDelete_TournamentList_BroadcastUpdate(data);
                    }),
                    catchError( val =>{ 
                      var msg:String;
                      msg = "*** \nTournament Oracle CAUGHT sleeping on the job ";
                      console.error(`TournamentOracle.pleaseUpdateATournament().catchError(): !!! ERROR !!! -> ${msg}\n***`);
                      return of(`${msg}: ${val}`)
                    })

                  ).subscribe(result => {
                    debugger;
                    var list = this.tournaments$.getValue();
                    var deleteList = [];
                    //deleteList = [];
                    var index;
                    data.forEach(element => {
                      index = list.indexOf(element);
                      if(index >= 0)
                        list.splice(index,1);
                    });

                    this.tournamentsToDelete$.next(deleteList);
                    // data.forEach(element => {
                    //   index = deleteList.indexOf(element);
                    //   if(index >= 0)
                    //     deleteList.splice(index,1);
                    // });
                      //if(result)
                  });

  }

}


