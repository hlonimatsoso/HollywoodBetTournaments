import { Component, OnInit , OnDestroy} from '@angular/core';
import { RaceEvent } from '../../../shared/models/Event';
import { EventOracleService } from '../event-oracle.service';
import { tap } from 'rxjs/operators';
import { Animations } from 'src/app/core/shared/models/Animations';



@Component({
  selector: 'app-event-card-list',
  templateUrl: './event-card-list.component.html',
  styleUrls: ['./event-card-list.component.scss'],
  animations:[
    Animations.InOutAnimation(null)
   ]
})
export class EventCardListComponent implements OnInit,OnDestroy {

  events:RaceEvent[];
  isEditingEnabled:boolean;
  oracleDeleteList:RaceEvent[];

  private _ready$Subscrioption;
  private _events$Subscrioption;
  private _isToolBarEnabled$Subscrioption;
  private _eventsToDelete$Subscription;

  constructor(private _ohGreatOracle:EventOracleService) { }

  
  
  ngOnDestroy(): void {

    console.log(`TournamentCardList.ngOnDestroy() : Unsubscribing from oracle._ready$, oracle.isToolBarEnabled$, oracle.tournamentsToDelete$ & oracle.tournaments$ subscribtions`);
    
    this._ready$Subscrioption.unsubscribe();
    this._isToolBarEnabled$Subscrioption.unsubscribe();
    this._eventsToDelete$Subscription.unsubscribe();
    this._events$Subscrioption.unsubscribe();

  }
 
  ngOnInit(): void {
    

    console.log(`EventCardList.ngOnInit()._ohGreatOracle.ready$.subscribe() : Oracle data ready, binding to the folling streams: 'oracle.events$', 'oracle.isToolBarEnabled$' and 'oracle.eventsToDelete$'`);

    this._ready$Subscrioption = this._ohGreatOracle.ready$.subscribe( oracle => {

                                // Bind to oracles list of Events
                                this._events$Subscrioption = oracle.events$.subscribe( list => {
                                                                  this.events = list;
                                })
                                
                                // Bind to oracles is Editing Enabled flag
                                this._isToolBarEnabled$Subscrioption =  oracle.isToolBarEnabled$.subscribe(flag => {
                                                                        this.isEditingEnabled = flag;
                                });

                                // Bind to oracles delete list
                                this._eventsToDelete$Subscription =  oracle.eventsToDelete$.subscribe( list => {
                                  debugger;
                                                                          this.oracleDeleteList = list;
                                });
    });


        
  }

  removefromList(list:RaceEvent[]){
    var index;
    for (var t of list) {
      
      index = this.events.indexOf(t);

      if (index >= 0) {
        this.events.splice(index, 1);
      }
    }
  }

  get isEventListEmpty(){
   
    let result:Boolean = false;
    if(this.events && this.events.length == 0) 
    result
    return this.events && this.events.length == 0;
  }

}
