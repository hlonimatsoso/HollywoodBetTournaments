import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeService} from '../../../home/home.service'
import {TournamentCardListComponent} from '../../modules/tournaments/tournament-card-list/tournament-card-list.component'



export const routes: Routes = [
  HomeService.childRoutes([
    { path: 'tournaments', component:TournamentCardListComponent, pathMatch: 'full'}
  ])
  
  // { path: 'items', loadChildren: () => import('./items/items.module').then(m => m.ItemsModule) },
  // { path: 'customers', loadChildren: () => import('./customers/customers.module').then(m => m.CustomersModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TournamentRoutingModule { }
