import { Component, OnInit ,Input, OnDestroy} from '@angular/core';
import { EventDetail } from '../../../shared/models/EventDetail';
import { EventDetailsOracleService } from '../event-details-oracle.service';
import { tap } from 'rxjs/operators';



@Component({
  selector: 'app-event-card-list',
  templateUrl: './event-details-card-list.component.html',
  styleUrls: ['./event-details-card-list.component.scss']
})
export class EventDetailsCardListComponent implements OnInit,OnDestroy {

  @Input() events:EventDetail[] = [];
  @Input() enableEditing:boolean;

  private orcalePleaseMeGetAllEventsSubscription:any;

  constructor(private _ohGreatOracle:EventDetailsOracleService) { }
  ngOnDestroy(): void {
    console.log(`RaceEventCardList.ngOnDestroy() : orcalePleaseMeGetAllEventsSubscription.unsubscribe()`);
    this.orcalePleaseMeGetAllEventsSubscription.unsubscribe();
  }
 
  ngOnInit(): void {
    
     this.orcalePleaseMeGetAllEventsSubscription = this._ohGreatOracle.pleaseGetMeGetAllEvents()
                                                        .pipe(
                                                          tap(list => {
                                                            console.log(`RaceEventCardList.ngOnInit()._ohGreatOracle.pleaseMeGetAllEvents().tap(): Result -> ${JSON.stringify(list)}`);
                                                          })
                                                        )
                                                        .subscribe(list => {
                                                          console.log(`RaceEventCardList.ngOnInit()._ohGreatOracle.pleaseMeGetAllEvents().subscribe(): Setting Card-List events with result -> ${JSON.stringify(list)}`);
                                                         //this.events = list;
                                                         this.events = list
                                                        });
    

    this._ohGreatOracle.event_details_ToolBar_on_add_Event$.subscribe((events)=>{
      console.log(`RaceEventCardList.ngOnInit().events_ToolBar_on_add_RaceEvent$.subscribe() : Thank you oracle the new events -> ${JSON.stringify(events)}`);
      this.events.push(events);
    });

    this._ohGreatOracle.event_details_ToolBar_on_Enable_ToolBar_Editing_Options_Change$.subscribe((setting)=>{
      console.log(`RaceEventCardList.ngOnInit().events_ToolBar_on_Enable_ToolBar_Editing_Options_Change$.subscribe() : Updating this.enableEditng to -> ${JSON.stringify(setting)}`);
      this.enableEditing = setting;
    });

    this._ohGreatOracle.event_details_toolBar_onUpdate_Event$.subscribe((events)=>{
      //console.log(`RaceEvent List: _mesageBus.eventsToolBox_updatedRaceEvent$ : ${value}`);
      const index = this.events.findIndex(t => t.eventID == events.eventID);
      //console.log(`RaceEvent List: Before update: (${this._events[index].eventsID}) ${this._events[index].eventsName} `);
      this.events[index] = events;
      //console.log(`RaceEvent List: After update: (${this._events[index].eventsID}) ${this._events[index].eventsName} `);

    });

    this._ohGreatOracle.event_details_toolBar_onDelete_EventList$.subscribe((eventsList)=>{
     this.removefromList(eventsList)
    });
        
  }

  removefromList(list:EventDetail[]){
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
