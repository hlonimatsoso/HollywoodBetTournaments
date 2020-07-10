import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';


import { EventDetailsRoutingModule } from './event-details-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { ConfigService } from '../../shared/services/config.service';
import { EventDetailsService } from './event-details.service';
import { EventDetailsOracleService } from './event-details-oracle.service';

import { MaterialModule } from '../material/material.module';
import { EventDetailsCardComponent } from './event-details-card/event-details-card.component';
import { EventDetailsCardListComponent } from './event-card-list/event-details-card-list.component';
import { EventDetailsCardToolBarComponent } from './event-details-card-tool-bar/event-details-card-tool-bar.component';
//import { MaterialModule } from '../material/material.module';




@NgModule({
  declarations: [EventDetailsCardListComponent, EventDetailsCardComponent, EventDetailsCardToolBarComponent],
  imports: [
    CommonModule,
    EventDetailsRoutingModule,
    SharedModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule    
  ],providers:[
    EventDetailsService,
    EventDetailsOracleService,
    ConfigService
  ]
})
export class EventDetailsModule { }
