import { Component, OnInit , OnDestroy} from '@angular/core';
import { RaceEvent } from '../../../shared/models/Event';
import { EventOracleService } from '../event-oracle.service';
import { tap } from 'rxjs/operators';
import { Animations } from 'src/app/core/shared/models/Animations';
import { TheOracleService } from 'src/app/core/shared/services/the-oracle.service';



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

  constructor(private _oracle:TheOracleService) { }

  
  
  ngOnDestroy(): void {

    console.log(`TournamentCardList.ngOnDestroy() : Unsubscribing from oracle._ready$, oracle.isToolBarEnabled$, oracle.tournamentsToDelete$ & oracle.tournaments$ subscribtions`);
    
    this._isToolBarEnabled$Subscrioption.unsubscribe();
    this._eventsToDelete$Subscription.unsubscribe();
    this._events$Subscrioption.unsubscribe();

  }
 
  ngOnInit(): void {
 
    console.log(`EventCardList.ngOnInit()._ohGreatOracle.ready$.subscribe() : Oracle data ready, binding to the folling streams: 'oracle.events$', 'oracle.isToolBarEnabled$' and 'oracle.eventsToDelete$'`);

    // Bind to oracles list of Events
    this._events$Subscrioption = this._oracle.eventOracle.events$.subscribe( list => {
      this.events = list;
    })
    
    // Bind to oracles is Editing Enabled flag
    this._isToolBarEnabled$Subscrioption =  this._oracle.eventOracle.isToolBarEnabled$.subscribe(flag => {
                                            this.isEditingEnabled = flag;
    });

    // Bind to oracles delete list
    this._eventsToDelete$Subscription =  this._oracle.eventOracle.eventsToDelete$.subscribe( list => {
                                            this.oracleDeleteList = list;
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
