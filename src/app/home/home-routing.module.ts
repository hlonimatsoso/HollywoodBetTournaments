import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home/home.component'
import {IndexComponent} from './index/index.component'



const routes: Routes = [{
  path: '', 
    component:HomeComponent, 
    children:[
      {
        path:'',
        component:IndexComponent,
        pathMatch:'full'
      }
    ]
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
