import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { HomeRoutingModule } from './home/home-routing.module';

import { AppComponent } from './app.component';
import {HomeModule} from './home/home.module'
import {CoreModule} from './core/core.module'

import { importType } from '@angular/compiler/src/output/output_ast';



@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CoreModule,
    HomeRoutingModule,
    HomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
