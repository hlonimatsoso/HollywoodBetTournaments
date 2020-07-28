import { Component, OnInit ,Input, OnDestroy} from '@angular/core';
import { EventDetail } from '../../../shared/models/EventDetail';
import { EventDetailsOracleService } from '../event-details-oracle.service';
import { tap } from 'rxjs/operators';
import { Validators, FormControl } from '@angular/forms';
import { Animations } from 'src/app/core/shared/models/Animations';
import { TheOracleService } from 'src/app/core/shared/services/the-oracle.service';



@Component({
  selector: 'app-event-card-list',
  templateUrl: './event-details-card-list.component.html',
  styleUrls: ['./event-details-card-list.component.scss'],
  animations:[
    Animations.InOutAnimation(null)
  ]
})
export class EventDetailsCardListComponent implements OnInit,OnDestroy {

  @Input() eventDetails:EventDetail[] = [];
  @Input() isEditingEnabled:boolean;

  private _eventDetails$Subscrioption;
  private _isToolBarEnabled$Subscrioption;
  private _tournamentsToDelete$Subscription;

  oracleDeleteList:EventDetail[];

  _eventDetailName = new FormControl('', [Validators.required]);

  action:string;


  constructor(private _theOracle:TheOracleService) { }

  
  ngOnDestroy(): void {

    console.log(`TournamentCardList.ngOnDestroy() : Unsubscribing from oracle._ready$, oracle.isToolBarEnabled$, oracle.tournamentsToDelete$ & oracle.tournaments$ subscribtions`);
    
    this._isToolBarEnabled$Subscrioption.unsubscribe();
    this._tournamentsToDelete$Subscription.unsubscribe();
    this._eventDetails$Subscrioption.unsubscribe();

  }

  ngOnInit(): void {

    // Bind to oracles is Editing Enabled flag
    this._isToolBarEnabled$Subscrioption =  this._theOracle.eventDetailsOracle.isToolBarEnabled$.subscribe(flag => {
      this.isEditingEnabled = flag;
    });

    // Bind to oracles delete list
    this._tournamentsToDelete$Subscription =  this._theOracle.eventDetailsOracle.eventDetailsToDelete$.subscribe( list => {
      this.oracleDeleteList = list;
    });

    // Bind to oracles list of Event Details
    this._eventDetails$Subscrioption = this._theOracle.eventDetailsOracle.eventDetails$.subscribe( list => {
     this.eventDetails = list;
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
