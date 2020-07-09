import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

import { UserManager, UserManagerSettings, User } from 'oidc-client';
import {ConfigService} from '../shared/services/config.service'
import { BehaviorSubject } from 'rxjs'; 


@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

private _manager:UserManager;
private _user:User

 // Observable auth source
private _isAuthenticated = new BehaviorSubject<boolean>(false);
private _httpErrors = new BehaviorSubject<any>(false);
//private _isBusy = new BehaviorSubject<boolean>(false);


// Observable auth stream for external interested parties to subscribe to
isAuthenticated$ = this._isAuthenticated.asObservable();

// Observable stream of http error for any interested parties to subscribe to
httpErrors$ = this._httpErrors.asObservable();

  constructor(private _config:ConfigService, private _http: HttpClient ) { 
    this._manager = new UserManager(_config.getClientSettings)
    this.setUser();
  }

  setUser(){
    this._manager.getUser().then(user => {
      this._user = user;
      this._isAuthenticated.next(this.isAuthenticated());

    });
  }

  isAuthenticated(): boolean {
    return this._user != null && !this._user.expired;
  }

  login() { 
    return this._manager.signinRedirect();   
  }

  logOUt() { 
    return this._manager.signoutRedirect();   
  }

  async completeAuthentication() {
    console.log(`Auth Service: completeAuthentication started`);
      this._user = await this._manager.signinRedirectCallback();
    console.log(`Auth Service: completeAuthentication signed in user ${JSON.stringify(this._user)}`);

      this._isAuthenticated.next(this.isAuthenticated());      
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

  async signout() {
    await this._manager.signoutRedirect();
  }
  handleError(error: any): any {
    console.log("HTTP request Error: " + error);
    this._httpErrors.next(error);
  }
}
