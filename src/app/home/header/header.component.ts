import { Component, OnInit } from '@angular/core';
import {AuthServiceService} from '../../core/auth/auth-service.service'
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  name: string;
  isAuthenticated: boolean;
  subscription:Subscription;

  constructor(private _authService:AuthServiceService) { }

  ngOnInit(): void {
    this.subscription = this._authService.isAuthenticated$.subscribe(status => {
      console.log(`Header component: AuthService.isAuthenticated: ${status}`);
      this.isAuthenticated = status
    });
    this.name = this._authService.name;
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
