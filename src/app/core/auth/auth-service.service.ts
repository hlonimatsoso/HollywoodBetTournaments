import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

import { UserManager, UserManagerSettings, User } from 'oidc-client';
import {ConfigService} from '../shared/services/config.service'
import { BehaviorSubject } from 'rxjs'; 
import { MessageBusService } from '../shared/services/message-bus.service';
import { UserAccess } from '../shared/models/UserAccess';
import { BaseHttpClient } from '../shared/services/baseHttpClient';
import { Constants } from '../shared/models/constants';


@Injectable({
  providedIn: 'root'
})
export class AuthServiceService  extends BaseHttpClient{

private _manager:UserManager;
private _user:User

 // Observable auth source
private _isAuthenticated = new BehaviorSubject<boolean>(false);
private _authenticatedUser = new BehaviorSubject<any>(false);

private _httpErrors = new BehaviorSubject<any>(false);
//private _isBusy = new BehaviorSubject<boolean>(false);


// Observable auth stream for external interested parties to subscribe to
isAuthenticated$ = this._isAuthenticated.asObservable();
authenticatedUser$ = this._authenticatedUser.asObservable();


// Observable stream of http error for any interested parties to subscribe to
httpErrors$ = this._httpErrors.asObservable();

private _headers:HttpHeaders;
public userAccess:UserAccess

  constructor(_settings:ConfigService, _http: HttpClient , _messageBus:MessageBusService) { 
    super(_http,_settings,_messageBus);
    this._manager = new UserManager(_settings.getClientSettings)
    this.setUser();
    this.userAccess = new UserAccess();
  }

  setUser(){
    this._manager.getUser().then(user => {
      this._user = user;
      this._isAuthenticated.next(this.isAuthenticated());
      this._authenticatedUser.next(this._user);     

    });
  }

  isAuthenticated(): boolean {
    return this._user != null && !this._user.expired;
  }

  canView(url:string):boolean{
    let result:boolean;

    if(url.includes(Constants.urls_tournaments)){
      result = this.userAccess.tournaments_read
    } else if(url.includes(Constants.urls_events)){
      result = this.userAccess.events_read
    }else if(url.includes(Constants.urls_horses)){
      result = this.userAccess.horses_read
    }else
      result = false;

    return result;
  }

  canWrite(url:string):boolean{
    let result:boolean;

    if(url.includes(Constants.urls_tournaments)){
      result = this.userAccess.tournaments_write
    } else if(url.includes(Constants.urls_events)){
      result = this.userAccess.events_write
    }else if(url.includes(Constants.urls_horses)){
      result = this.userAccess.horses_write
    }else
      result = false;

    return result;
  }

  canDelete(url:string):boolean{
    let result:boolean;

    if(url.includes(Constants.urls_tournaments)){
      result = this.userAccess.tournaments_delete
    } else if(url.includes(Constants.urls_events)){
      result = this.userAccess.events_delete
    }else if(url.includes(Constants.urls_horses)){
      result = this.userAccess.horses_delete
    }else
      result = false;

    return result;
  }

  login() { 
    
    this._messageBus.httpRequest_InProgess_BroadcastUpdate(true);

    this._manager.signinRedirect()
                        .then(x => {
                          this._messageBus.httpRequest_InProgess_BroadcastUpdate(false);
                          console.log(`Login redirect SUCCESS`);
                        })
                        .catch(error => {
                          this._messageBus.httpRequest_InProgess_BroadcastUpdate(false);
                          this._messageBus.raiseErrorSnack(error,"Login redirect error")
                          console.log(`Login redirect ERROR: ${error}`);
                        });

    
  }

  logOUt() { 
    return this._manager.signoutRedirect();   
  }

  async completeAuthentication() {
    console.log(`Auth Service: completeAuthentication started`);
      this._user = await this._manager.signinRedirectCallback();
      console.log(`Auth Service: completeAuthentication signed in user ${JSON.stringify(this._user)}`);
  
      this.setUserAccess();
      this._isAuthenticated.next(this.isAuthenticated()); 
      this._authenticatedUser.next(this._user);     
  }  

  private setUserAccess(){
    this.getAll(this._config.claimsUrl,"User access",this.authHeaders)
        .subscribe(result => {
          console.log(`AUth-Service.completeAuthentication().setUserAccess()\n User Access: ${JSON.stringify(result)}`);
          this.userAccess = result;
     
    });
  }

  register(userRegistration: any) { 

    return this._http.post(this._config.authApiURI + '/account/register', userRegistration).pipe(catchError(this.handleError));
  }


  get authorizationHeaderValue(): string {

    return `${this._user.token_type} ${this._user.access_token}`;
  }

  get name(): string {
    return this._user != null ? this._user.profile.name : '';
  }

  get authHeaders(){

  let headers = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': this.authorizationHeaderValue
    })
  }

    return headers;
  }

  async signout() {
    await this._manager.signoutRedirect();
  }
  handleError(error: any): any {
    console.log("HTTP request Error: " + error);
    this._httpErrors.next(error);
  }
}
