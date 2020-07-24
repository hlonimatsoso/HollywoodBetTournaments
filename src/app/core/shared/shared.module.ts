import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigService } from './services/config.service';
import { HttpClientModule } from '@angular/common/http';
import { AnimationsService } from '../shared/services/animations.service';
import { MessageBusService } from './services/message-bus.service';
import { SnackBarPopUpComponent } from './components/snack-bar-pop-up/snack-bar-pop-up.component';




@NgModule({
  declarations: [SnackBarPopUpComponent],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers:[
    ConfigService,
    MessageBusService,
    AnimationsService
  ]
})
export class SharedModule { }
