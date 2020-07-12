import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';


import { TournamentRoutingModule } from './tournament-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { ConfigService } from '../../shared/services/config.service';
import { TournamentService } from './tournament.service';
import { TournamentOracleService } from './tournament-oracle.service';

import { MaterialModule } from '../material/material.module';
import { TournamentCardComponent } from './tournament-card/tournament-card.component';
import { TournamentCardListComponent } from './tournament-card-list/tournament-card-list.component';
import { TournamentCardToolBarComponent } from './tournament-card-tool-bar/tournament-card-tool-bar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//import { MaterialModule } from '../material/material.module';




@NgModule({
  declarations: [TournamentCardComponent, TournamentCardListComponent, TournamentCardToolBarComponent],
  imports: [
    CommonModule,
    TournamentRoutingModule,
    SharedModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule    
  ],providers:[
    TournamentService,
    TournamentOracleService,
    ConfigService
  ]
})
export class TournamentsModule { }
