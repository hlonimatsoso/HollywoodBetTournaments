import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TournamentsModule } from './core/modules/tournaments/tournaments.module';
import { HomeRoutingModule } from './home/home-routing.module';

import { AppComponent } from './app.component';
import {HomeModule} from './home/home.module';
import {CoreModule} from './core/core.module';
import {SharedModule} from './core/shared/shared.module';


import { importType } from '@angular/compiler/src/output/output_ast';



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
    TournamentsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
