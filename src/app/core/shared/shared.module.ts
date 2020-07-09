import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigService } from './services/config.service';
import { HttpClientModule } from '@angular/common/http';
import { MessageBusService } from './services/message-bus.service';




@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers:[
    ConfigService,
    MessageBusService
  ]
})
export class SharedModule { }
