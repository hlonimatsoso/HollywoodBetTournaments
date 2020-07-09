import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TournamentRoutingModule } from './tournament-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { ConfigService } from '../../shared/services/config.service';
import { TournamentService } from './tournament.service';
import { TournamentOracleService } from './tournament-oracle.service';

import { MaterialModule } from '../material/material.module';
import { TournamentCardComponent } from './tournament-card/tournament-card.component';
import { TournamentCardListComponent } from './tournament-card-list/tournament-card-list.component';



@NgModule({
  declarations: [TournamentCardComponent, TournamentCardListComponent],
  imports: [
    CommonModule,
    TournamentRoutingModule,
    SharedModule,
    MaterialModule
  ],providers:[
    TournamentService,
    TournamentOracleService,
    ConfigService
  ]
})
export class TournamentsModule { }
