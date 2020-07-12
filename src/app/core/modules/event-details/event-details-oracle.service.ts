import { Injectable, OnInit } from '@angular/core';
import { EventDetailsService } from './event-details.service';
import { EventDetail } from './../../shared/models/EventDetail';
import {Subject,Observable, of} from 'rxjs';
import {ConfigService  } from '../../shared/services/config.service';
import {map, tap,finalize,catchError } from 'rxjs/operators';
import {EventDetailStatus} from '../../shared/models/EventDetailStatus';
import {RaceEvent} from '../../shared/models/Event';
import {EventOracleService} from '../events/event-oracle.service';


@Injectable({
  providedIn: 'root'
})
export class EventDetailsOracleService implements OnInit {

  private _event_details_ToolBar_on_Action_Change = new Subject<string>();
  private _event_details_ToolBar_on_Enable_ToolBar_Editing_Options_Change = new Subject<boolean>();
  private _event_details_ToolBar_on_add_Event = new Subject<EventDetail>();
  private _event_details_card_onEdit_Event = new Subject<EventDetail>();
  private _event_details_toolBar_onUpdate_Event = new Subject<EventDetail>();
  private _event_details_card_onDelete_Event = new Subject<EventDetail>();
  private _event_details_toolBar_onDelete_EventList = new Subject<EventDetail[]>();

  
  
  constructor(private _service:EventDetailsService,private _eventsOracle:EventOracleService, private _config:ConfigService) {
    this.eventDetailsToDelete = [];
    //this.currentEvents = this._eventsOracle.events;
    this._eventsOracle.ready$.subscribe(oracle => {
      this.events = oracle.events$.getValue();
    })
    
     _service.GetAllEventDetailStatuses().subscribe((x)=>{
      this.availableStatuses = x;
     });
  }
  
  ngOnInit(): void {
    //this.getAllEvents();
  }

  eventDetails:EventDetail[];

  eventDetailsToDelete:EventDetail[];

  availableStatuses:EventDetailStatus[];

  events:RaceEvent[]


  get event_details_ToolBar_onActionChange$(): Observable<string> {
    return this._event_details_ToolBar_on_Action_Change.asObservable();
  }

  get event_details_ToolBar_on_Enable_ToolBar_Editing_Options_Change$(): Observable<boolean> {
    return this._event_details_ToolBar_on_Enable_ToolBar_Editing_Options_Change.asObservable();
  }

  get event_details_ToolBar_on_add_Event$(): Observable<EventDetail> {
    return this._event_details_ToolBar_on_add_Event.asObservable();
  }

  get event_details_card_on_edit_Event$(): Observable<EventDetail> {
    return this._event_details_card_onEdit_Event.asObservable();
  }

  get event_details_toolBar_onUpdate_Event$(): Observable<EventDetail> {
    return this._event_details_toolBar_onUpdate_Event.asObservable();
  }

  get event_details_card_onDelete_Event$(): Observable<EventDetail> {
    return this._event_details_card_onDelete_Event.asObservable();
  }

  get event_details_toolBar_onDelete_EventList$(): Observable<EventDetail[]> {
    return this._event_details_toolBar_onDelete_EventList.asObservable();
  }


  public event_details_toolBar_onActionChange_BroadcastUpdate(action:string) {
    this._event_details_ToolBar_on_Action_Change.next(action);
    if(this._config.LoggingSettings.EventDetailsOracleService_Can_Log)
      console.log(`EventDetailOracle.event_details_toolBar_onActionChange_BroadcastUpdate(): Broadcast -> ${action}`);
  }

  public event_details_toolBar_onEnableToolBarEditingOptions_Change_BroadcastUpdate(isEnabled:boolean) {
    this._event_details_ToolBar_on_Enable_ToolBar_Editing_Options_Change.next(isEnabled);
    if(this._config.LoggingSettings.EventDetailsOracleService_Can_Log)
      console.log(`EventDetailOracle.event_details_toolBar_onActionChange_BroadcastUpdate(): Broadcast -> ${isEnabled}`);
  }

  public event_details_toolBar_on_add_Event_BroadcastUpdate(event:EventDetail) {
    this._event_details_ToolBar_on_add_Event.next(event);
    if(this._config.LoggingSettings.EventDetailsOracleService_Can_Log)
      console.log(`EventDetailOracle._event_details_toolBar_on_add_Event(): Broadcasting new event -> ${JSON.stringify(event)}`);
  }

  public event_details_card_onEdit_Event_BroadcastUpdate(event:EventDetail) {
    this._event_details_card_onEdit_Event.next(event);
    if(this._config.LoggingSettings.EventDetailsOracleService_Can_Log)
      console.log(`EventDetailOracle.event_card_onEdit_Event_BroadcastUpdate(): Broadcasting cards wishes to be edited -> ${JSON.stringify(event)}`);
  }

  public event_details_toolBar_onUpdate_Event_BroadcastUpdate(event:EventDetail) {
    this._event_details_toolBar_onUpdate_Event.next(event);
    if(this._config.LoggingSettings.EventDetailsOracleService_Can_Log)
      console.log(`EventDetailOracle.event_details_toolBar_onUpdate_Event_BroadcastUpdate(): Broadcasting updated touranment -> ${JSON.stringify(event)}`);
  }

  public event_deatils_card_onDelete_Event_BroadcastUpdate(event:EventDetail) {
    this.eventDetailsToDelete.push(event);
    this._event_details_card_onDelete_Event.next(event);
    if(this._config.LoggingSettings.EventDetailsOracleService_Can_Log)
      console.log(`EventDetailOracle.event_card_onDelete_Event_BroadcastUpdate(): Broadcasting deleted touranment -> ${JSON.stringify(event)}`);
  }

  public event_details_toolBar_onDelete_EventList_BroadcastUpdate(event:EventDetail[]) {
    this.removefromList(event);
    this._event_details_toolBar_onDelete_EventList.next(event);
    if(this._config.LoggingSettings.EventDetailsOracleService_Can_Log)
      console.log(`EventDetailOracle.event_details_toolBar_onDelete_EventList_BroadcastUpdate(): Broadcasting deleted touranment list-> ${JSON.stringify(event)}`);
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

  get getAvailableStatuses():EventDetailStatus[]{
    var result:EventDetailStatus[] = [];
    this._service.GetAllEventDetailStatuses().subscribe((x)=>{result = x;});
  
    return result;
  }

  get getCurrentEvents():RaceEvent[]{
    var result:RaceEvent[] = [];
    result = this._eventsOracle.currentEvents;

    return result;
  }

  getAllEventDetailStatuses(){
    
  }

  pleaseGetMeGetAllEvents():Observable<EventDetail[]>{

    if(this._config.LoggingSettings.EventDetailsOracleService_Can_Log)
      console.log(`EventDetailOracle.pleaseGetMeGetAllEvents(): Requesting all events...`);

    return this._service.GetAllEventDetails()
                  .pipe(
                    tap(dbList=>{
                      if(this._config.LoggingSettings.EventDetailsOracleService_Can_Log)
                        console.log(`EventDetailOracle.pleaseGetMeGetAllEvents().tap(): Setting The Oracles list with the result -> ${JSON.stringify(dbList)}`);
                        this.eventDetails = dbList;
                    }),
                    finalize(()=>{
                      if(this._config.LoggingSettings.EventDetailsOracleService_Can_Log)
                        console.log(`EventDetailOracle.pleaseGetMeGetAllEvents().finalize(): Requesting all events complete`);
                    }),
                    catchError( val =>{ 
                      var msg:String;
                      msg = "*** \nEvent Oracle CAUGHT sleeping on the job ";
                      console.error(`EventDetailOracle.pleaseGetMeGetAllEvents().catchError(): !!! ERROR !!! -> ${msg}\n***`);
                      return of(`${msg}: ${val}`)
                    })

                  );

  }

  pleaseAddAEvent(data:EventDetail):Observable<any>{

    if(this._config.LoggingSettings.EventDetailsOracleService_Can_Log)
      console.log(`EventDetailOracle.pleaseAddAEvents(): Adding 1 event -> ${data}`);

    return this._service.PostAEventDetail(data)
                  .pipe(
                    tap(dbList=>{
                      if(this._config.LoggingSettings.EventDetailsOracleService_Can_Log)
                        console.log(`EventDetailOracle.pleaseAddAEvent().tap(): Result if any -> ${JSON.stringify(dbList)}`);
                    }),
                    finalize(()=>{
                      if(this._config.LoggingSettings.EventDetailsOracleService_Can_Log)
                        console.log(`EventDetailOracle.pleaseAddAEvent().finalize(): Request to Add a event is complete. About to broadcast new event -> ${JSON.stringify(data)}`);
                        this.event_details_toolBar_on_add_Event_BroadcastUpdate(data);
                    }),
                    catchError( val =>{ 
                      var msg:String;
                      msg = "*** \nEvent Oracle CAUGHT sleeping on the job ";
                      console.error(`EventDetailOracle.pleaseAddAEvent().catchError(): !!! ERROR !!! -> ${msg}\n***`);
                      return of(`${msg}: ${val}`)
                    })

                  );

  }

  pleaseUpdateAEvent(data:EventDetail):Observable<any>{

    if(this._config.LoggingSettings.EventDetailsOracleService_Can_Log)
      console.log(`EventDetailOracle.pleaseUpdateAEvent(): Updating 1 event -> ${data}`);

    return this._service.UpdateEventDetail(data)
                  .pipe(
                    tap(result=>{
                      if(this._config.LoggingSettings.EventDetailsOracleService_Can_Log)
                        console.log(`EventDetailOracle.pleaseUpdateAEvent().tap(): Result if any -> ${JSON.stringify(result)}`);
                    }),
                    finalize(()=>{
                      if(this._config.LoggingSettings.EventDetailsOracleService_Can_Log)
                        console.log(`EventDetailOracle.pleaseUpdateAEvent().finalize(): Request to Update the event is complete. About to broadcast the UPDATED event -> ${JSON.stringify(data)}`);
                        this.event_details_toolBar_onUpdate_Event_BroadcastUpdate(data);
                    }),
                    catchError( val =>{ 
                      var msg:String;
                      msg = "*** \nEvent Oracle CAUGHT sleeping on the job ";
                      console.error(`EventDetailOracle.pleaseUpdateAEvent().catchError(): !!! ERROR !!! -> ${msg}\n***`);
                      return of(`${msg}: ${val}`)
                    })

                  );

  }

  pleaseDeleteTheseEvents(data:EventDetail[]):Observable<any>{

    if(this._config.LoggingSettings.EventDetailsOracleService_Can_Log)
      console.log(`EventDetailOracle.pleaseUpdateAEvent(): Updating 1 event -> ${data}`);

    return this._service.DeleteEventDetailList(data)
                  .pipe(
                    tap(result=>{
                      if(this._config.LoggingSettings.EventDetailsOracleService_Can_Log)
                        console.log(`EventDetailOracle.pleaseUpdateAEvent().tap(): Result if any -> ${JSON.stringify(result)}`);
                    }),
                    finalize(()=>{
                      if(this._config.LoggingSettings.EventDetailsOracleService_Can_Log)
                        console.log(`EventDetailOracle.pleaseUpdateAEvent().finalize(): Request to Update the event is complete. About to broadcast the UPDATED event -> ${JSON.stringify(data)}`);
                        this.event_details_toolBar_onDelete_EventList_BroadcastUpdate(data);
                    }),
                    catchError( val =>{ 
                      var msg:String;
                      msg = "*** \nEvent Oracle CAUGHT sleeping on the job ";
                      console.error(`EventDetailOracle.pleaseUpdateAEvent().catchError(): !!! ERROR !!! -> ${msg}\n***`);
                      return of(`${msg}: ${val}`)
                    })

                  );

  }

}


