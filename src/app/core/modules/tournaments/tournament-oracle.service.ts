import { Injectable, OnInit } from '@angular/core';
import { TournamentService } from './tournament.service';
import { Tournament } from './../../shared/models/Tournament';
import {Subject,Observable, of} from 'rxjs';
import {ConfigService  } from '../../shared/services/config.service';
import {map, tap,finalize,catchError } from 'rxjs/operators';




@Injectable({
  providedIn: 'root'
})
export class TournamentOracleService implements OnInit {

  private _tournament_ToolBar_on_Action_Change = new Subject<string>();
  private _tournament_ToolBar_on_Enable_ToolBar_Editing_Options_Change = new Subject<boolean>();
  private _tournament_ToolBar_on_add_Tournament = new Subject<Tournament>();
  private _tournament_card_onEdit_Tournament = new Subject<Tournament>();
  private _tournament_toolBar_onUpdate_Tournament = new Subject<Tournament>();



  
  constructor(private _service:TournamentService, private _config:ConfigService) { }
  
  ngOnInit(): void {
    //this.getAllTournaments();
  }

  tounaments:Tournament[];

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


  public tournament_toolBar_onActionChange_BroadcastUpdate(action:string) {
    this._tournament_ToolBar_on_Action_Change.next(action);
    if(this._config.LoggingSettings.TournamentOracleService_Can_Log)
      console.log(`TournamentOracle.tournament_toolBar_onActionChange_BroadcastUpdate(): Broadcast -> ${action})`);
  }

  public tournament_ToolBar_onEnableToolBarEditingOptions_Change_BroadcastUpdate(isEnabled:boolean) {
    this._tournament_ToolBar_on_Enable_ToolBar_Editing_Options_Change.next(isEnabled);
    if(this._config.LoggingSettings.TournamentOracleService_Can_Log)
      console.log(`TournamentOracle.tournament_toolBar_onActionChange_BroadcastUpdate(): Broadcast -> ${isEnabled})`);
  }

  public tournament_ToolBar_on_add_Tournament_BroadcastUpdate(tournament:Tournament) {
    this._tournament_ToolBar_on_add_Tournament.next(tournament);
    if(this._config.LoggingSettings.TournamentOracleService_Can_Log)
      console.log(`TournamentOracle._tournament_ToolBar_on_add_Tournament(): Broadcasting new tournament -> ${JSON.stringify(tournament)})`);
  }

  public tournament_card_onEdit_Tournament_BroadcastUpdate(tournament:Tournament) {
    this._tournament_card_onEdit_Tournament.next(tournament);
    if(this._config.LoggingSettings.TournamentOracleService_Can_Log)
      console.log(`TournamentOracle.tournament_card_onEdit_Tournament_BroadcastUpdate(): Broadcasting cards wishes to be edited -> ${JSON.stringify(tournament)})`);
  }

  public tournament_toolBar_onUpdate_Tournament_BroadcastUpdate(tournament:Tournament) {
    this._tournament_toolBar_onUpdate_Tournament.next(tournament);
    if(this._config.LoggingSettings.TournamentOracleService_Can_Log)
      console.log(`TournamentOracle.tournament_toolBar_onUpdate_Tournament_BroadcastUpdate(): Broadcasting updated touranment -> ${JSON.stringify(tournament)})`);
  }

  pleaseGetMeGetAllTournaments():Observable<Tournament[]>{

    if(this._config.LoggingSettings.TournamentOracleService_Can_Log)
      console.log(`TournamentOracle.pleaseGetMeGetAllTournaments(): Requesting all tournaments...`);

    return this._service.GetAllTournaments()
                  .pipe(
                    tap(dbList=>{
                      if(this._config.LoggingSettings.TournamentOracleService_Can_Log)
                        console.log(`TournamentOracle.pleaseGetMeGetAllTournaments().tap(): Setting The Oracles list with the result -> ${JSON.stringify(dbList)}`);
                      this.tounaments = dbList;
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

                  );

  }

  pleaseAddATournament(data:Tournament):Observable<any>{

    if(this._config.LoggingSettings.TournamentOracleService_Can_Log)
      console.log(`TournamentOracle.pleaseAddATournaments(): Adding 1 tournament -> ${data}`);

    return this._service.PostATournament(data)
                  .pipe(
                    tap(dbList=>{
                      if(this._config.LoggingSettings.TournamentOracleService_Can_Log)
                        console.log(`TournamentOracle.pleaseAddATournament().tap(): Result if any -> ${JSON.stringify(dbList)}`);
                    }),
                    finalize(()=>{
                      if(this._config.LoggingSettings.TournamentOracleService_Can_Log)
                        console.log(`TournamentOracle.pleaseAddATournament().finalize(): Request to Add a tournament is complete. About to broadcast new tournament -> ${JSON.stringify(data)}`);
                        this.tournament_ToolBar_on_add_Tournament_BroadcastUpdate(data);
                    }),
                    catchError( val =>{ 
                      var msg:String;
                      msg = "*** \nTournament Oracle CAUGHT sleeping on the job ";
                      console.error(`TournamentOracle.pleaseAddATournament().catchError(): !!! ERROR !!! -> ${msg}\n***`);
                      return of(`${msg}: ${val}`)
                    })

                  );

  }

  pleaseUpdateATournament(data:Tournament):Observable<any>{

    if(this._config.LoggingSettings.TournamentOracleService_Can_Log)
      console.log(`TournamentOracle.pleaseUpdateATournament(): Updating 1 tournament -> ${data}`);

    return this._service.UpdateTournament(data)
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

                  );

  }

}


