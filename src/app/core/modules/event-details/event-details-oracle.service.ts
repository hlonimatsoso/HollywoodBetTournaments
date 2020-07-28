import { Injectable, OnInit } from '@angular/core';
import { EventDetailsService } from './event-details.service';
import { EventDetail } from './../../shared/models/EventDetail';
import {Subject,Observable, of, BehaviorSubject, throwError} from 'rxjs';
import {ConfigService  } from '../../shared/services/config.service';
import {map, tap,finalize,catchError } from 'rxjs/operators';
import {EventDetailStatus} from '../../shared/models/EventDetailStatus';
import {RaceEvent} from '../../shared/models/Event';
import {EventOracleService} from '../events/event-oracle.service';
import { Constants } from '../../shared/models/constants';


@Injectable({
  providedIn: 'root'
})
export class EventDetailsOracleService implements OnInit {

  //ready$ = new BehaviorSubject(this);
  eventDetails$ = new BehaviorSubject(null);
  eventDetailsToDelete$ = new BehaviorSubject(null);
  currentEditingAction$ = new BehaviorSubject(Constants.toolbar_button_add_action);
  currentEditingEventDetail$ = new BehaviorSubject(null);
  isToolBarEnabled$ = new BehaviorSubject(false);
  eventDetailStatuses$ = new BehaviorSubject(null);


  
  
  constructor(private _service:EventDetailsService,private _eventsOracle:EventOracleService, private _config:ConfigService) {
    console.log(`EventOracle.constructor() : Loading events...`);
    this.setAvailableStatuses();
    this.loadEventDetails();
    this.eventDetailsToDelete = [];
    this.eventDetailsToDelete$.next(this.eventDetailsToDelete);
  }
  
  ngOnInit(): void {
    //this.getAllEvents();
  }

  eventDetails:EventDetail[];

  eventDetailsToDelete:EventDetail[];

  events:RaceEvent[];


 removefromList(list:EventDetail[]){
    var index;
    for (var t of list) {
      
      index = this.eventDetails.indexOf(t);

      if (index >= 0) {
        this.eventDetails.splice(index, 1);
      }
    }
  }

   setAvailableStatuses():EventDetailStatus[]{
    var result:EventDetailStatus[] = [];
    this._service.GetAllEventDetailStatuses().subscribe(
      (x)=>{
        this.eventDetailStatuses$.next(x)}
      );
    result = this.eventDetailStatuses$.getValue();
    
    return result;
  }

  // get getCurrentEvents():RaceEvent[]{
  //   var result:RaceEvent[] = [];
  //   result = this._eventsOracle.currentEvents;

  //   return result;
  // }

/**
* @ngdoc function
* @name onCurrentActionChange
* @methodOf Event Detail Oracle Service
* @normallyExecutedBy The "Event Detail Tool Bar" component
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
* @name setCurrentEditingEventDetails
* @methodOf EventDetails Oracle Service
* @normallyExecutedBy The "EventDetails Card" component
* @description Sets EventDetails for editing, and eventually to be updated
* @param {EventDetails=} EventDetails EventDetails to mark for editing
* @returns {void} no return
*/
setCurrentEditingEventDetail(eventDetail:EventDetail){
  this.currentEditingEventDetail$.next(eventDetail);
  this.currentEditingAction$.next(Constants.toolbar_button_edit_action);
}


/**
* @ngdoc function
* @name addToEventDetailsDeleteList
* @methodOf EventDetails Oracle Service
* @normallyExecutedBy The "Event Details Card" component
* @description Soft deletes an item on the screen before the db update
* @param {list=} EventDetails EventDetails to mark for deletion
* @returns {void} no return
*/
addToEventDEtailsDeleteList(item:EventDetail){
  var currentList:EventDetail[] = this.eventDetailsToDelete$.getValue();
   
   if(!currentList)
     currentList = [];

   currentList.push(item);
   this.eventDetailsToDelete$.next(currentList);
   this.currentEditingAction$.next(Constants.toolbar_button_delete_action);
 }



/**
* @ngdoc function
* @name onIsToolBarEnabledChange
* @methodOf Event Detail Oracle Service
* @normallyExecutedBy The "Event Detail Tool Bar" component
* @description Broadcasts the change of the Event Detail ToolBar's "On" & "Off" state
* @param {action=} string Either "Add", "Edit" or "Delete"
* @returns {void} no return
*/
onIsToolBarEnabledChange(flag:boolean){
  this.isToolBarEnabled$.next(flag);
}

  loadEventDetails(){

    if(this._config.LoggingSettings.EventDetailsOracleService_Can_Log)
      console.log(`EventDetailOracle.pleaseGetMeGetAllEvents(): Requesting all events...`);

    this._service.GetAllEventDetails()
                  .pipe(
                    tap(dbList=>{
                      if(this._config.LoggingSettings.EventDetailsOracleService_Can_Log)
                        console.log(`EventDetailOracle.pleaseGetMeGetAllEvents().tap(): Setting The Oracles list with the result -> ${JSON.stringify(dbList)}`);
                    }),
                    finalize(()=>{
                      if(this._config.LoggingSettings.EventDetailsOracleService_Can_Log)
                        console.log(`EventDetailOracle.pleaseGetMeGetAllEvents().finalize(): Requesting all events complete`);
                    }),
                    catchError( error =>{ 
                      var msg = "*** EventDetailOracle.pleaseGetMeGetAllEvents().catchError(): \nEvent Oracle CAUGHT sleeping on the job ***\n";
                      console.error(`${msg} : ${error}`);
                      return of(`${msg} : ${error}`)
                    })

                  ).subscribe(list => {
                  
                    if(list){
                      this.eventDetails$.next(list);
                      console.log(`EventsOracle.loadEvents().subscribe() : Events Oracle is now ready, events list defaulted to -> ${JSON.stringify(list)}`);
                    }
                  });

  }

  pleaseAddAEventDEtail(data:EventDetail){

    if(this._config.LoggingSettings.EventDetailsOracleService_Can_Log)
      console.log(`EventDetailOracle.pleaseAddAEvents(): Adding 1 event -> ${data}`);

    this._service.PostAEventDetail(data)
                  .pipe(
                    tap(dbList=>{
                      if(this._config.LoggingSettings.EventDetailsOracleService_Can_Log)
                        console.log(`EventDetailOracle.pleaseAddAEvent().tap(): Result if any -> ${JSON.stringify(dbList)}`);
                    }),
                    finalize(()=>{
                      if(this._config.LoggingSettings.EventDetailsOracleService_Can_Log)
                        console.log(`EventDetailOracle.pleaseAddAEvent().finalize(): Request to Add a event is complete. About to broadcast new event -> ${JSON.stringify(data)}`);
                   }),
                    catchError( error => { 
                      debugger; 
                      var msg = "*** EventDetailOracle.pleaseGetMeGetAllEvents().catchError(): \nEvent Oracle CAUGHT sleeping on the job ***\n";
                      console.error(`${msg} : ${error}`);
                      return of(`${msg} : ${error}`)
                    })

                  ).subscribe(horseResult => {
                    if(horseResult){
                        // Add new horse to orcale list
                        var list:EventDetail[] = this.eventDetails$.getValue();
                        list.push(horseResult);

                        // Broadcast updated list of horses
                        this.eventDetails$.next(list);
                        if(this._config.LoggingSettings.EventDetailsOracleService_Can_Log)
                          console.log(`EventDetailsOracle.pleaseAddAEventDetails().subscribe() : Added EventDetails to Oracle list and then broadcasted updated list -> ${JSON.stringify(list)}`);
                      }
                      else
                        console.warn(`EventDetailsOracle.pleaseAddAEventDetails().subscribe(): Result is fucked. DB insert probably failed, check them logs playa`);                    
               });

  }

  pleaseUpdateAEventDetails(data:EventDetail){

      this._service.UpdateEventDetail(data)
                  .pipe(
                    tap(result => {
                      if(this._config.LoggingSettings.EventDetailsOracleService_Can_Log)
                        console.log(`EventDetailOracle.pleaseDeleteTheseEventDetails().tap(): Result if any -> ${JSON.stringify(result)}`);
                    }),
                    finalize(() => {
                      if(this._config.LoggingSettings.EventDetailsOracleService_Can_Log)
                        console.log(`EventDetailOracle.pleaseDeleteTheseEventDetails().finalize(): Request to Update the event is complete. About to broadcast the UPDATED event -> ${JSON.stringify(data)}`);
                    }),
                    catchError( error => { 
                      var msg = "*** EventDetailOracle.pleaseDeleteTheseEventDetails().catchError(): \nEvent Oracle CAUGHT sleeping on the job ***\n";
                      console.error(`${msg} : ${error}`);
                      return of(`${msg} : ${error}`)
                    })

                  ).subscribe(horse => {
                    // update orcale Event Detail (after sucessfull delete)
                    if(horse){
                      var list:EventDetail[] = this.eventDetails$.getValue();
                      var index = list.findIndex( x =>  x.eventDetailID == horse.eventDetailID );
                      list[index] = horse

                      // list.forEach(element => {
                      //   if(element.eventDetailID == horse.eventDetailID)
                      //       element = horse;
                      // });

                      // braoadcast update
                      this.eventDetails$.next(list);
                      if(this._config.LoggingSettings.EventDetailsOracleService_Can_Log)
                        console.log(`EventDetailOracle.pleaseUpdateAEventDetails().subscribe() : Updated Event Details it to Oracle list and then broadcasted updated list -> ${JSON.stringify(list)}`);
                    }
                    else
                      console.warn(`EventDetailOracle.pleaseUpdateAEventDetails().subscribe().EmptyReult(): Result is fucked. DB insert probably failed`);                    
                });

  }

  pleaseDeleteTheseEventDetails(data:EventDetail[]){

    if(this._config.LoggingSettings.EventDetailsOracleService_Can_Log)
      console.log(`EventDetailOracle.pleaseDeleteTheseEventDetails(): Updating 1 event -> ${data}`);

   this._service.DeleteEventDetailList(data)
                  .pipe(
                    tap(result=>{
                      if(this._config.LoggingSettings.EventDetailsOracleService_Can_Log)
                        console.log(`EventDetailOracle.pleaseDeleteTheseEventDetails().tap(): Result if any -> ${JSON.stringify(result)}`);
                    }),
                    finalize(()=>{
                      if(this._config.LoggingSettings.EventDetailsOracleService_Can_Log)
                        console.log(`EventDetailOracle.pleaseDeleteTheseEventDetails().finalize(): Request to delte the event is complete.`);
                    }),
                    catchError( error =>{ 
                      var msg = `EventDetailOracle.pleaseDeleteTheseEventDetails().catchError() \nDeleting Event Details failed \n ${error}`;
                      console.error(`${msg}`);
                      return throwError(`${msg}`)
                    })

                  ).subscribe(() => {
                     console.log(`EventDetailsOracle.pleaseDeleteTheseEventDetails().subscribe() : Events deleted.`);
                  });

  }

}


