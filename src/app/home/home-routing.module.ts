import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home/home.component'
import {IndexComponent} from './index/index.component'
import {AuthCallbackComponent} from '../core/auth/auth-callback/auth-callback.component'



const routes: Routes = [
  { path: 'auth-callback', component: AuthCallbackComponent  },
  {
  path: '', 
    component:HomeComponent, 
    children:[
      {
        path:'',
        component:IndexComponent,
        pathMatch:'full',
        redirectTo:''
        
      }
    ]
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
