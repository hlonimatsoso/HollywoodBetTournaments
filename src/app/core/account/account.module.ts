import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule ,ReactiveFormsModule}   from '@angular/forms'; // ReactiveFormsModule
import { RegisterComponent } from './register/register.component';
import { SharedModule }   from '../shared/shared.module';
import {MaterialModule} from '../modules/material/material.module'
import { AccountRoutingModule } from './account.routing-module';
//import { AuthServiceService }  from '../../core/auth/auth-service.service';

@NgModule({
  declarations: [ RegisterComponent],
  providers: [],
  imports: [
    CommonModule,
    FormsModule,
    AccountRoutingModule,
    SharedModule ,
    ReactiveFormsModule,
    MaterialModule 
  ]
})
export class AccountModule { }
