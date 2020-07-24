import { Injectable } from '@angular/core';
import { BaseHttpClient } from '../../shared/services/baseHttpClient';
import {ConfigService  } from '../../shared/services/config.service';
import {Observable, of, throwError as observableThrowError, from} from 'rxjs';

import {  LoggingSettings } from '../../shared/models/LoggingSettings';
import {  MessageBusService } from '../../shared/services/message-bus.service'
import { HttpClient } from '@angular/common/http';
import { Tournament } from '../../shared/models/Tournament';

/**
 * Tournament Service will soon _support_ [Markdown](https://marked.js.org/)
 * @description Messenger of the Oracle, handles all the HTTP traffic that Runs CRUD operations on the DB. 
 * @NB : Shoulld only be consumed by the Tournament Oracle   
 */
@Injectable({
  providedIn: 'root'
})
export class TournamentService extends BaseHttpClient {

  constructor( _http:HttpClient,  _config:ConfigService,  _messageBus:MessageBusService) { 
    super(_http,_config,_messageBus);
  }

  
/**
* @ngdoc function
* @name getAllTournaments
* @methodOf Tournament Service
* @normallyExecutedBy The Oracle
* @description Gets all tournaments
* @param NONE
* @returns Observable<Tournament>
*/
  getAllTournaments():Observable<any>{
    return this.getAll(this._configService.tournamentsUrl,"tournamnets");
  }
  
/**
* @ngdoc function
* @name postATournament
* @methodOf Tournament Service
* @normallyExecutedBy The Oracle
* @description Inserts a tournament into the DB
* @param tournament Tournament
* @returns {Observable<Tournament>} Observable<Tournament>
*/
  postATournament(tournament:Tournament){
    return this.Post(this._configService.tournamentsUrl,tournament);
  }

  /**
* @ngdoc function
* @name updateTournament
* @methodOf Tournament Service
* @normallyExecutedBy The Oracle
* @description Updates a tournament in the DB
* @param tournament Tournament
* @returns Tournament
*/
  updateTournament(tournament:Tournament){
    /*
      I post cause the API's POST method checks for a ID on the incomming tournament,  
      if it finds it, it run an update against that ID
    */ 
    return this.Post(this._configService.tournamentsUrl,tournament);
  }

/**
* @ngdoc function
* @name deleteTournamentList
* @methodOf Tournament Service
* @normallyExecutedBy The Oracle
* @description Deletes a list tournaments in the DB all in shot
* @param tournamentList Tournament[]
* @returns Tournament
*/
  deleteTournamentList(tournamentList:Tournament[]){
    return this.Delete(this._configService.tournamentsUrl,tournamentList);
  }
}