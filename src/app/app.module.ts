import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TournamentsModule } from './core/modules/tournaments/tournaments.module';
import { EventsModule } from './core/modules/events/event.module';
import { HomeRoutingModule } from './home/home-routing.module';

import {HomeModule} from './home/home.module';
import {CoreModule} from './core/core.module';
import {SharedModule} from './core/shared/shared.module';

import { AppComponent } from './app.component';
import { MessageBusService } from './core/shared/services/message-bus.service';
import { NgxSpinnerService } from 'ngx-spinner';

import { MaterialModule } from './core/modules/material/material.module';



@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    SharedModule,
    HomeRoutingModule,
    HomeModule,
    TournamentsModule,
    MaterialModule,
    EventsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { 

  constructor(private _messageBus:MessageBusService, private _spinner: NgxSpinnerService){
    this._messageBus.httpRequest_InProgess$.subscribe(x=>{
      if(x)
        this._spinner.show();
      else
        this._spinner.hide();
    });
  }
}
