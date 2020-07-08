import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home/home/home.component'
import {AppComponent} from './app.component'



const routes: Routes = [
   {
    path: '', 
      component:HomeComponent, 
      loadChildren: () => import('./home/home.module').then(m => m.HomeModule) 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
