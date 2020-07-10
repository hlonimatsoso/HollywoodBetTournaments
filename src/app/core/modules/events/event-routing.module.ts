import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeService} from '../../../home/home.service'
import {EventCardListComponent} from '../../modules/events/event-card-list/event-card-list.component'



export const routes: Routes = [
  HomeService.childRoutes([
    { path: 'events', component:EventCardListComponent, pathMatch: 'full'}
  ])
  
  // { path: 'items', loadChildren: () => import('./items/items.module').then(m => m.ItemsModule) },
  // { path: 'customers', loadChildren: () => import('./customers/customers.module').then(m => m.CustomersModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventRoutingModule { }
