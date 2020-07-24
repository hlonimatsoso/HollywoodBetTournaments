import { Injectable } from '@angular/core';
import { BaseHttpClient } from '../../shared/services/baseHttpClient';
import {ConfigService  } from '../../shared/services/config.service';
import {Observable, of, throwError as observableThrowError, from} from 'rxjs';

import {  LoggingSettings } from '../../shared/models/LoggingSettings';
import {  MessageBusService } from '../../shared/services/message-bus.service'
import { HttpClient } from '@angular/common/http';
import { EventDetail } from '../../shared/models/EventDetail';

@Injectable({
  providedIn: 'root'
})
export class EventDetailsService extends BaseHttpClient {

  constructor( _http:HttpClient,  _config:ConfigService,  _messageBus:MessageBusService) { 
    super(_http,_config,_messageBus);
  }

  GetAllEventDetails():Observable<any>{
    return this.getAll(this._configService.eventDetailUrl,"event details");
  }
  
  GetAllEventDetailStatuses():Observable<any>{
    return this.getAll(this._configService.eventDetailStatusUrl,"event details status");
  }

  PostAEventDetail(data:any){
    return this.Post(this._configService.eventDetailUrl,data);
  }

  UpdateEventDetail(data:any){
    /*
      I post cause the API's POST method checks for a ID on the incomming EventDetail,  
      if it finds it, it run an update against that ID
    */ 
    return this.Post(this._configService.eventDetailUrl,data);
  }

  DeleteEventDetailList(data:any[]){
    return this.Delete(this._configService.eventDetailUrl,data);
  }
}