import { Component, OnInit } from '@angular/core';
import {AuthServiceService} from '../../core/auth/auth-service.service'
import { Subscription } from 'rxjs';
import { TournamentOracleService } from 'src/app/core/modules/tournaments/tournament-oracle.service';
import { User } from 'oidc-client';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  name: string;
  isAuthenticated: boolean;
  subscription:Subscription;
  user:User;

  constructor(private _authService:AuthServiceService) { }

  ngOnInit(): void {
    console.log(`Header component: User ${this.user}`);


    this.subscription = this._authService.isAuthenticated$.subscribe(status => {
      console.log(`Header component: AuthService.isAuthenticated: ${status}`);
      this.isAuthenticated = status
    });

    this._authService.authenticatedUser$.subscribe(user => {
      this.user = user;
      console.log(user);
    });

  }

  logIn(){
    console.log("Logging in");
    this._authService.login();
  }

  logOut(){
    console.log("Logging out");
    this._authService.logOUt();
  }

  register(){
    console.log("Registering");
    this._authService.login();
  }

}
