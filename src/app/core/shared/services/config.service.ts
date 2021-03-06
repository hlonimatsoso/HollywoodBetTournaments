import { Injectable } from '@angular/core';
import {  UserManagerSettings } from 'oidc-client';
import {  LoggingSettings } from '../models/LoggingSettings';


@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor() { }

   get getClientSettings(): UserManagerSettings {
    return {
        authority: 'https://localhost:10000',
        client_id: 'hollywoodbet',
        redirect_uri: 'http://localhost:12000/auth-callback',
        post_logout_redirect_uri: 'http://localhost:12000/',
        response_type:"id_token token",
        scope:"openid profile email role custom tournaments events horses",
        filterProtocolClaims: true,
        loadUserInfo: true,
        automaticSilentRenew: true,
        silent_redirect_uri: 'http://localhost:12000/silent-refresh.html'
    };
  }

  get authApiURI() {
      return 'https://localhost:11000/api';
  }    
  
  get resourceApiURI() {
      return 'http://localhost:11000/api';
  }  

  get tournamentsUrl(){
    return "https://localhost:11000/api/Tournaments";
  }

  get eventsUrl(){
    return "https://localhost:11000/api/Events";
  }

  get eventDetailUrl(){
    return "https://localhost:11000/api/EventDetail";
  }

  get eventDetailStatusUrl(){
    return "https://localhost:11000/api/EventDetailStatus";
  }

  get claimsUrl(){
    return "https://localhost:11000/api/auth/claims";
  }
 
  get LoggingSettings():LoggingSettings{
    
    var result:LoggingSettings;

    result = new LoggingSettings();
    
    result.BaseHttpClient_Delete_Can_Log = true;
    result.BaseHttpClient_Post_Can_Log = true;
    result.BaseHttpClient_Put_Can_Log = true;
    result.BaseHttpClient_Delete_Can_Log = true;

    result.TournamentOracleService_Can_Log = true;
    result.EventOracleService_Can_Log = true;
    result.EventDetailsOracleService_Can_Log = true;

    result.Tournament_ToolBar_Can_Log = true;
    result.Events_ToolBar_Can_Log = true;
    result.Detail_Events_ToolBar_Can_Log = true;
  
    return result;
  }
  
}
