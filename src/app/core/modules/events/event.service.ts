import { Injectable } from '@angular/core';
import { BaseHttpClient } from '../../shared/services/baseHttpClient';
import {ConfigService  } from '../../shared/services/config.service';
import {Observable, of, throwError as observableThrowError, from} from 'rxjs';

import {  LoggingSettings } from '../../shared/models/LoggingSettings';
import {  MessageBusService } from '../../shared/services/message-bus.service'
import { HttpClient } from '@angular/common/http';
import { RaceEvent } from '../../shared/models/Event';

@Injectable({
  providedIn: 'root'
})
export class EventService extends BaseHttpClient {

  constructor( _http:HttpClient,  _config:ConfigService,  _messageBus:MessageBusService) { 
    super(_http,_config,_messageBus);
  }

  GetAllEvents():Observable<any>{
    return this.getAll(this._configService.eventsUrl);
  }
  
  PostAEvent(data:any){
    return this.Post(this._configService.eventsUrl,data);
  }

  UpdateEvent(data:any){
    /*
      I post cause the API's POST method checks for a ID on the incomming Event,  
      if it finds it, it run an update against that ID
    */ 
    return this.Post(this._configService.eventsUrl,data);
  }

  DeleteEventList(data:any[]){
    return this.Delete(this._configService.eventsUrl,data);
  }
}