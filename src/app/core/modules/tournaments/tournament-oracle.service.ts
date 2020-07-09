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

  //private _tournaments_onGetAll = new Subject<Tournament[]>();
  
  constructor(private _service:TournamentService, private _config:ConfigService) { }
  
  ngOnInit(): void {
    //this.getAllTournaments();
  }

  tounaments:Tournament[];

  // get tournaments_onGetAll$(): Observable<Tournament[]> {
  //   return this._tournaments_onGetAll.asObservable();
  // }

  // public tournaments_onGetAll_BroadcastUpdate(updatedList:Tournament[]) {
  //   this._tournaments_onGetAll.next(updatedList);
  //   if(this._config.LoggingSettings.TournamentOracleService_Can_Log)
  //     console.log(`TournamentOracle.tournaments_onGetAll_BroadcastUpdate(): Broadcast -> ${JSON.stringify(updatedList)})`);
  // }

  pleaseMeGetAllTournaments():Observable<Tournament[]>{

    if(this._config.LoggingSettings.TournamentOracleService_Can_Log)
      console.log(`TournamentOracle.GetAllTournaments(): Requesting all tournaments...`);

    return this._service.GetAllTournaments()
                  .pipe(
                    tap(dbList=>{
                      if(this._config.LoggingSettings.TournamentOracleService_Can_Log)
                        console.log(`TournamentOracle.GetAllTournaments().tap(): Setting The Oracles list with the result -> ${JSON.stringify(dbList)}`);
                      this.tounaments = dbList;
                    }),
                    finalize(()=>{
                      if(this._config.LoggingSettings.TournamentOracleService_Can_Log)
                        console.log(`TournamentOracle.GetAllTournaments().finalize(): Requesting all tournaments complete`);
                    }),
                    catchError( val =>{ 
                      var msg:String;
                      msg = "*** \nTournament Oracle CAUGHT sleeping on the job ";
                      console.error(`TournamentOracle.GetAllTournaments().catchError(): !!! ERROR !!! -> ${msg}\n***`);
                      return of(`${msg}: ${val}`)
                    })

                  );

                  // .subscribe(dbList => {
                  //   debugger;
                  //   this.tounaments = dbList;
                  //   //this.tournamentsGetAll_BroadcastUpdate(this.tounaments);
                  //   console.log(`TournamentOracle.GetAllTournaments().subscribe: Requesting all tournaments complete`);
                  // })
    //sub.unsubscribe();

    //return of(this.tounaments)
  }

}


