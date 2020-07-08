import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './index/index.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import {HomeRoutingModule} from './home-routing.module'
import {MaterialModule} from '../core/modules/material/material.module'



@NgModule({
  declarations: [IndexComponent, HeaderComponent, FooterComponent, AboutComponent, HomeComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    MaterialModule
  ],exports:[
    HeaderComponent, FooterComponent, AboutComponent
  ]
})
export class HomeModule { }
