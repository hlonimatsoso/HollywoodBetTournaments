import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MaterialModule} from './modules/material/material.module'
import {AccountModule} from './account/account.module'
import {AuthModule} from './auth/auth.module'
import {DataModule} from './data/data.module'
import {SharedModule} from './shared/shared.module'
//import {MaterialModule} from './modules/material/material.module'


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MaterialModule,
    AccountModule,
    AuthModule,
    DataModule,
    SharedModule
  ]
})
export class CoreModule { }
