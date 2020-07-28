import { Injectable, OnInit } from '@angular/core';
import { EventService } from './event.service';
import { RaceEvent } from './../../shared/models/Event';
import {Subject,Observable, of, BehaviorSubject, throwError} from 'rxjs';
import {ConfigService  } from '../../shared/services/config.service';
import {map, tap,finalize,catchError } from 'rxjs/operators';
import { Constants } from '../../shared/models/constants';
import { EventDetail } from '../../shared/models/EventDetail';
import { EventDetailsOracleService } from '../event-details/event-details-oracle.service';



/**
 * Events Oracle Service will soon _support_ [Markdown](https://marked.js.org/)
 * @description The co-rodinator for all things Events, from CRUD to facilitating communication between other oracles.
 * @NB : All components subscribe _ONLY_ to the [ONLY] orcale within their module. Any communication required from other module 
 * should _[STRICTL]_ go though from 1 Oracle to another and back to the component.   
 */
@Injectable({
  providedIn: 'root'
})
export class EventOracleService  {
 
  ready$ = new BehaviorSubject(this);
  events$ = new BehaviorSubject<RaceEvent[]>(null);
  horses$ = new BehaviorSubject<EventDetail[]>(null);
  eventsToDelete$ = new BehaviorSubject(null);
  currentEditingAction$ = new BehaviorSubject(Constants.toolbar_button_add_action);
  currentEditingEvent$ = new BehaviorSubject(null);
  isToolBarEnabled$ = new BehaviorSubject(false);

  
  constructor(private _service:EventService, private _config:ConfigService) {
    console.log(`EventOracle.constructor() : Loading events...`);
    this.loadEvents();
    // this._ohGreatHorsesOracle.ready$.subscribe(orcale => {
    //   orcale.eventDetails$.subscribe(horses => {
    //     this.horses$.next(horses);
    //   });
    //});
  }


  // get currentEvents(){

  //   return this.events$.getValue();
  // }

  /**
* @ngdoc function
* @name setCurrentEditingEvent
* @methodOf Event Oracle Service
* @normallyExecutedBy The "Event Card" component
* @description Sets event for editing, and eventually to be updated
* @param {event=} RaceEvent event to mark for editing
* @returns {void} no return
*/
setCurrentEditingEvent(event:RaceEvent){
  this.currentEditingEvent$.next(event);
  this.currentEditingAction$.next(Constants.toolbar_button_edit_action);
}

/**
* @ngdoc function
* @name onCurrentActionChange
* @methodOf Event Oracle Service
* @normallyExecutedBy The "Event Tool Bar" component
* @description Broadcasts the change of the Action state of the Oracle.
* @param {action=} string Either "Add", "Edit" or "Delete"
* @returns {void} no return
*/
onCurrentActionChange(action:string){
  this.currentEditingAction$.next(action);
  if(action == Constants.toolbar_button_add_action)
    this.currentEditingAction$.next(Constants.toolbar_button_add_action);
}

  /**
* @ngdoc function
* @name getEventsForTournamentID
* @methodOf Tournament Oracle Service
* @normallyExecutedBy Those want a list of Events that belong to a particular tournament ID
* @description Returns a list of Events with the argument ID
* @param tournamentID Number
* @returns RaceEvent[] 
*/
// getHorsesForEventID(eventID:number):EventDetail[]{
//   var list = this.horses$.getValue();
//   if(list == null)
//     return null;

//   return list.filter( x => x.eventID == eventID);
// }


/**
* @ngdoc function
* @name onIsToolBarEnabledChange
* @methodOf Event Oracle Service
* @normallyExecutedBy The "Event Tool Bar" component
* @description Broadcasts the change of the Events ToolBar's "On" & "Off" state
* @param {action=} string Either "Add", "Edit" or "Delete"
* @returns {void} no return
*/
onIsToolBarEnabledChange(flag:boolean){
  this.isToolBarEnabled$.next(flag);
}

/**
* @ngdoc function
* @name getEventByID
* @methodOf Event Oracle Service
* @normallyExecutedBy Those want an Event, but only have the ID
* @description Returns the Event with the argument ID
* @param eventID Number
* @returns Event 
*/
getEventByID(eventID:Number){
 return this.events$.getValue().find( x => x.eventID == eventID);
}



/**
* @ngdoc function
* @name addToEventDeleteList
* @methodOf Event Oracle Service
* @normallyExecutedBy The "Event Card" component
* @description Soft deletes an item on the screen before the db update
* @param {event=} tournament tournament to mark for deletion
* @returns {void} no return
*/
addToEventDeleteList(event:RaceEvent){
  var currentList:RaceEvent[] = this.eventsToDelete$.getValue();
   
   if(!currentList)
     currentList = [];

   currentList.push(event);
   this.eventsToDelete$.next(currentList);
   this.currentEditingAction$.next(Constants.toolbar_button_delete_action);
 }

  removefromList(list:RaceEvent[]){
    var index;
    for (var t of list) {
      
      // index = this.events.indexOf(t);

      // if (index >= 0) {
      //   this.events.splice(index, 1);
      //}
    }
  }


/**
* @ngdoc function
* @name loadTournaments
* @methodOf Events Oracle Service
* @normallyExecutedBy The Oracle himeself, in his constructor.
* @description Loads all the required events, then broadcasts an updated version of it's self for binding
* @param NONE
* @returns void
*/
  loadEvents(){

        this._service.GetAllEvents()
                  .pipe(
                    tap(dbList=>{
                      if(this._config.LoggingSettings.EventOracleService_Can_Log)
                        console.log(`EventOracle.loadEvents().tap(): Setting The Oracles list with the result -> ${JSON.stringify(dbList)}`);
                   }),
                    finalize(()=>{
                      if(this._config.LoggingSettings.EventOracleService_Can_Log)
                        console.log(`EventOracle.loadEvents().finalize(): Requesting all events complete`);
                    }),
                    catchError( error =>{ 
                      var msg = `EventOracle.loadEvents().catchError() \nLoading Events failed \n ${error}`;
                      console.error(`${msg}`);
                      return throwError(`${msg}`)
                    })

                  ).subscribe(list=>{
                  
                    if(list){
                      this.events$ = new BehaviorSubject(list);
                      this.ready$.next(this);
                      console.log(`EventsOracle.loadEvents().subscribe() : Events Oracle is now ready, events list defaulted to -> ${JSON.stringify(list)}`);
                    }
                  });

  }


  /**
* @ngdoc function
* @name pleaseAddAEvent
* @methodOf Event Oracle Service
* @normallyExecutedBy The "Event Tool Bar" component
* @description Inserts an Event into the databse 
* @param {data=} RaceEvent
* @returns Event
*/
  pleaseAddAEvent(data:RaceEvent){

    this._service.PostAEvent(data)
                  .pipe(
                    tap(event => {
                      if(event){
                        if(this._config.LoggingSettings.EventOracleService_Can_Log)
                          console.log(`EventOracle.pleaseAddAEvent().tap(): Event added to db, about to add it to Oracle list and then broadcast updated list with new Event-> ${JSON.stringify(event)}`);
                      }
                      else
                        console.warn(`EventOracle.pleaseAddAEvent().tap(): Result is fucked. DB insert probably failed`);
                    }),
                    finalize(()=>{
                      if(this._config.LoggingSettings.EventOracleService_Can_Log)
                        console.log(`EventOracle.pleaseAddAEvent().finalize(): Request to Add a event is complete. About to broadcast new event -> ${JSON.stringify(data)}`);
                        //this.event_ToolBar_on_add_Event_BroadcastUpdate(data);
                    }),
                    catchError( val =>{ 
                      var msg:String;
                      msg = "*** \nEvent Oracle CAUGHT sleeping on the job ";
                      console.error(`EventOracle.pleaseAddAEvent().catchError(): !!! ERROR !!! -> ${msg}\n***`);
                      return of(`${msg}: ${val}`)
                    })

                  ).subscribe(event => {
                    if(event){
                        // Add new event to orcale list
                        var list:RaceEvent[] = this.events$.getValue();
                        list.push(event);

                        // Broadcast updated list of tournaments
                        this.events$.next(list);
                        if(this._config.LoggingSettings.EventOracleService_Can_Log)
                          console.log(`EventOracle.pleaseAddAEvent().subscribe() : Added event to Oracle list and then broadcasted updated list -> ${JSON.stringify(list)}`);
                      }
                      else
                        console.warn(`EventOracle.pleaseAddAEvent().subscribe(): Result is fucked. DB insert probably failed, check them logs playa`);                    
               });

  }

/**
* @ngdoc function
* @name pleaseUpdateAEvent
* @methodOf Event Oracle Service
* @normallyExecutedBy The "Event Tool Bar" component
* @description Updates a Event in the databse 
* @param {action=} Event
* @returns {RaceEvent}
*/
  pleaseUpdateAEvent(data:RaceEvent){


       this._service.UpdateEvent(data)
                  .pipe(
                    tap(result=>{
                      if(this._config.LoggingSettings.EventOracleService_Can_Log)
                        console.log(`EventOracle.pleaseUpdateAEvent().tap(): Result if any -> ${JSON.stringify(result)}`);
                    }),
                    finalize(()=>{
                      if(this._config.LoggingSettings.EventOracleService_Can_Log)
                        console.log(`EventOracle.pleaseUpdateAEvent().finalize(): Request to Update the event is complete. About to broadcast the UPDATED event -> ${JSON.stringify(data)}`);
                        
                    }),
                    catchError( val =>{ 
                      var msg:String;
                      msg = "*** \nEvent Oracle CAUGHT sleeping on the job ";
                      console.error(`EventOracle.pleaseUpdateAEvent().catchError(): !!! ERROR !!! -> ${msg}\n***`);
                      return of(`${msg}: ${val}`)
                    })

                  ).subscribe(event => {

                    // update orcale event (after sucessfull delete)
                    if(event){
                      var list:RaceEvent[] = this.events$.getValue();
                      list.forEach(element => {
                        if(element.eventID == event.eventID){
                          element.eventNumber = event.eventNumber;
                          element.autoClose = event.autoClose;
                          element.eventDateTime = event.eventDateTime;
                          element.eventEndDateTime = event.eventEndDateTime;
                          element.tournamentID = event.tournamentID;
                          element.eventName = event.eventName;
                        }
                      });

                      // braoadcast update
                      this.events$.next(list);
                      if(this._config.LoggingSettings.TournamentOracleService_Can_Log)
                        console.log(`EventOracle.pleaseUpdateEvent().subscribe() : Updated event it to Oracle list and then broadcasted updated list -> ${JSON.stringify(list)}`);
                    }
                    else
                      console.warn(`EventOracle.pleaseUpdatedEvent().tap(): Result is fucked. DB insert probably failed`);                    
                });

  }


  /**
* @ngdoc function
* @name pleaseDeleteTheseEvents
* @methodOf Event Oracle Service
* @normallyExecutedBy The "Event Tool Bar" component
* @description Deletes mnultiple Events in the databse at once
* @param {action=} Event
* @returns {Event}
*/
  pleaseDeleteTheseEvents(data:RaceEvent[]){

    if(this._config.LoggingSettings.EventOracleService_Can_Log)
      console.log(`EventOracle.pleaseUpdateAEvent(): Updating 1 event -> ${data}`);

      this._service.DeleteEventList(data)
                  .pipe(
                    tap(result=>{
                      debugger;

                      if(this._config.LoggingSettings.EventOracleService_Can_Log)
                        console.log(`EventOracle.pleaseUpdateAEvent().tap(): Result if any -> ${JSON.stringify(result)}`);
                    }),
                    finalize(()=>{
                      debugger;

                      if(this._config.LoggingSettings.EventOracleService_Can_Log)
                        console.log(`EventOracle.pleaseUpdateAEvent().finalize(): Request to Update the event is complete. About to broadcast the UPDATED event -> ${JSON.stringify(data)}`);
                        //this.event_toolBar_onDelete_EventList_BroadcastUpdate(data);
                    }),
                    catchError( val =>{ 
                      debugger;
                      var msg:String;
                      msg = "*** \nEvent Oracle CAUGHT sleeping on the job ";
                      console.error(`EventOracle.pleaseUpdateAEvent().catchError(): !!! ERROR !!! -> ${msg}\n***`);
                      return of(`${msg}: ${val}`)
                    })

                  ).subscribe(result => {
                    var list = this.events$.getValue();
                    var deleteList = [];
                    var index;

                    // loop delete list and remove each item from the current list
                    data.forEach(element => {
                      index = list.indexOf(element);
                      if(index >= 0)
                        list.splice(index,1);
                        // abouve action updates the actual list, thus updadting those already bound to it. need to confirm this officially
                    });

                    this.eventsToDelete$.next(deleteList);
                  });


  }

}


