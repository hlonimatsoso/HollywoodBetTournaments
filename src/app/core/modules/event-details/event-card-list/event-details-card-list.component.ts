import { Component, OnInit ,Input, OnDestroy} from '@angular/core';
import { EventDetail } from '../../../shared/models/EventDetail';
import { EventDetailsOracleService } from '../event-details-oracle.service';
import { tap } from 'rxjs/operators';
import { Validators, FormControl } from '@angular/forms';



@Component({
  selector: 'app-event-card-list',
  templateUrl: './event-details-card-list.component.html',
  styleUrls: ['./event-details-card-list.component.scss']
})
export class EventDetailsCardListComponent implements OnInit,OnDestroy {

  @Input() eventDetails:EventDetail[] = [];
  @Input() isEditingEnabled:boolean;

  private _ready$Subscrioption;
  private _tournaments$Subscrioption;
  private _isToolBarEnabled$Subscrioption;
  private _tournamentsToDelete$Subscription;

  oracleDeleteList:EventDetail[];

  _eventDetailName = new FormControl('', [Validators.required]);

  action:string;


  constructor(private _ohGreatOracle:EventDetailsOracleService) { }

  
  ngOnDestroy(): void {

    console.log(`TournamentCardList.ngOnDestroy() : Unsubscribing from oracle._ready$, oracle.isToolBarEnabled$, oracle.tournamentsToDelete$ & oracle.tournaments$ subscribtions`);
    
    this._ready$Subscrioption.unsubscribe();
    this._isToolBarEnabled$Subscrioption.unsubscribe();
    this._tournamentsToDelete$Subscription.unsubscribe();
    this._tournaments$Subscrioption.unsubscribe();

  }

  ngOnInit(): void {
    this._ready$Subscrioption = this._ohGreatOracle.ready$.subscribe( oracle => {

      // Bind to oracles list of Event Details
      this._tournaments$Subscrioption = oracle.eventDetails$.subscribe( list => {
                                        this.eventDetails = list;
      })
      
      // Bind to oracles is Editing Enabled flag
      this._isToolBarEnabled$Subscrioption =  oracle.isToolBarEnabled$.subscribe(flag => {
                                              this.isEditingEnabled = flag;
      });

      // Bind to oracles delete list
      this._tournamentsToDelete$Subscription =  oracle.eventDetailsToDelete$.subscribe( list => {
                                                this.oracleDeleteList = list;
      });
});
   
        
  }

  removefromList(list:EventDetail[]){
    var index;
    for (var t of list) {
      
      index = this.eventDetails.indexOf(t);

      if (index >= 0) {
        this.eventDetails.splice(index, 1);
      }
    }
  }

  get isEventDetailsListEmpty(){
   
    let result:Boolean = false;
    if(this.eventDetails && this.eventDetails.length == 0) 
    result
    return this.eventDetails && this.eventDetails.length == 0;
  }

}
