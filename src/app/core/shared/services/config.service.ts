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
        client_id: 'hollywoodbet_ui',
        redirect_uri: 'http://localhost:12000/auth-callback',
        post_logout_redirect_uri: 'http://localhost:12000/',
        response_type:"id_token token",
        scope:"openid profile email",
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

  get LoggingSettings():LoggingSettings{
    
    var result:LoggingSettings;

    result = new LoggingSettings();
    
    result.BaseHttpClient_Detele_Can_Log = true;
    result.BaseHttpClient_Post_Can_Log = true;
    result.BaseHttpClient_Put_Can_Log = true;
    result.BaseHttpClient_Detele_Can_Log = true;

    result.TournamentOracleService_Can_Log = true;
    result.EventOracleService_Can_Log = true;
    result.EventDetailsOracleService_Can_Log = true;
    
    return result;
  }
}
