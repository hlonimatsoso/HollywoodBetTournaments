import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';


import { EventRoutingModule } from './event-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { ConfigService } from '../../shared/services/config.service';
import { EventService } from './event.service';
import { EventOracleService } from './event-oracle.service';

import { MaterialModule } from '../material/material.module';
import { EventCardComponent } from './event-card/event-card.component';
import { EventCardListComponent } from './event-card-list/event-card-list.component';
import { EventCardToolBarComponent } from './event-card-tool-bar/event-card-tool-bar.component';
//import { MaterialModule } from '../material/material.module';




@NgModule({
  declarations: [EventCardComponent, EventCardListComponent, EventCardToolBarComponent],
  imports: [
    CommonModule,
    EventRoutingModule,
    SharedModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule    
  ],providers:[
    EventService,
    EventOracleService,
    ConfigService
  ]
})
export class EventsModule { }
