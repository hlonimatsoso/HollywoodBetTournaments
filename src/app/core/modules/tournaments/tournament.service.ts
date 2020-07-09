import { Injectable } from '@angular/core';
import { BaseHttpClient } from '../../shared/services/baseHttpClient';
import {ConfigService  } from '../../shared/services/config.service';
import {Observable, of, throwError as observableThrowError, from} from 'rxjs';

import {  LoggingSettings } from '../../shared/models/LoggingSettings';
import {  MessageBusService } from '../../shared/services/message-bus.service'
import { HttpClient } from '@angular/common/http';
import { Tournament } from '../../shared/models/Tournament';

@Injectable({
  providedIn: 'root'
})
export class TournamentService extends BaseHttpClient {

  constructor( _http:HttpClient,  _config:ConfigService,  _messageBus:MessageBusService) { 
    super(_http,_config,_messageBus);
  }

  GetAllTournaments():Observable<any>{
    return this.getAll(this._configService.tournamentsUrl);
  }
  
  PostATournament(data:any){
    return this.Post(this._configService.tournamentsUrl,data);
  }
}