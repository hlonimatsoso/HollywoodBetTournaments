import { Injectable, OnInit } from '@angular/core';
import { EventService } from './event.service';
import { RaceEvent } from './../../shared/models/Event';
import {Subject,Observable, of} from 'rxjs';
import {ConfigService  } from '../../shared/services/config.service';
import {map, tap,finalize,catchError } from 'rxjs/operators';




@Injectable({
  providedIn: 'root'
})
export class EventOracleService implements OnInit {

  private _event_ToolBar_on_Action_Change = new Subject<string>();
  private _event_ToolBar_on_Enable_ToolBar_Editing_Options_Change = new Subject<boolean>();
  private _event_ToolBar_on_add_Event = new Subject<RaceEvent>();
  private _event_card_onEdit_Event = new Subject<RaceEvent>();
  private _event_toolBar_onUpdate_Event = new Subject<RaceEvent>();
  private _event_card_onDelete_Event = new Subject<RaceEvent>();
  private _event_toolBar_onDelete_EventList = new Subject<RaceEvent[]>();


  
  constructor(private _service:EventService, private _config:ConfigService) {
    this.eventsToDelete = [];
  }
  
  ngOnInit(): void {
    //this.getAllEvents();
  }

  events:RaceEvent[];
  eventsToDelete:RaceEvent[];


  get event_ToolBar_onActionChange$(): Observable<string> {
    return this._event_ToolBar_on_Action_Change.asObservable();
  }

  get event_ToolBar_on_Enable_ToolBar_Editing_Options_Change$(): Observable<boolean> {
    return this._event_ToolBar_on_Enable_ToolBar_Editing_Options_Change.asObservable();
  }

  get event_ToolBar_on_add_Event$(): Observable<RaceEvent> {
    return this._event_ToolBar_on_add_Event.asObservable();
  }

  get event_card_on_edit_Event$(): Observable<RaceEvent> {
    return this._event_card_onEdit_Event.asObservable();
  }

  get event_toolBar_onUpdate_Event$(): Observable<RaceEvent> {
    return this._event_toolBar_onUpdate_Event.asObservable();
  }

  get event_card_onDelete_Event$(): Observable<RaceEvent> {
    return this._event_card_onDelete_Event.asObservable();
  }

  get event_toolBar_onDelete_EventList$(): Observable<RaceEvent[]> {
    return this._event_toolBar_onDelete_EventList.asObservable();
  }


  public event_toolBar_onActionChange_BroadcastUpdate(action:string) {
    this._event_ToolBar_on_Action_Change.next(action);
    if(this._config.LoggingSettings.EventOracleService_Can_Log)
      console.log(`EventOracle.event_toolBar_onActionChange_BroadcastUpdate(): Broadcast -> ${action}`);
  }

  public event_ToolBar_onEnableToolBarEditingOptions_Change_BroadcastUpdate(isEnabled:boolean) {
    this._event_ToolBar_on_Enable_ToolBar_Editing_Options_Change.next(isEnabled);
    if(this._config.LoggingSettings.EventOracleService_Can_Log)
      console.log(`EventOracle.event_toolBar_onActionChange_BroadcastUpdate(): Broadcast -> ${isEnabled}`);
  }

  public event_ToolBar_on_add_Event_BroadcastUpdate(event:RaceEvent) {
    this._event_ToolBar_on_add_Event.next(event);
    if(this._config.LoggingSettings.EventOracleService_Can_Log)
      console.log(`EventOracle._event_ToolBar_on_add_Event(): Broadcasting new event -> ${JSON.stringify(event)}`);
  }

  public event_card_onEdit_Event_BroadcastUpdate(event:RaceEvent) {
    this._event_card_onEdit_Event.next(event);
    if(this._config.LoggingSettings.EventOracleService_Can_Log)
      console.log(`EventOracle.event_card_onEdit_Event_BroadcastUpdate(): Broadcasting cards wishes to be edited -> ${JSON.stringify(event)}`);
  }

  public event_toolBar_onUpdate_Event_BroadcastUpdate(event:RaceEvent) {
    this._event_toolBar_onUpdate_Event.next(event);
    if(this._config.LoggingSettings.EventOracleService_Can_Log)
      console.log(`EventOracle.event_toolBar_onUpdate_Event_BroadcastUpdate(): Broadcasting updated touranment -> ${JSON.stringify(event)}`);
  }

  public event_card_onDelete_Event_BroadcastUpdate(event:RaceEvent) {
    this.eventsToDelete.push(event);
    this._event_card_onDelete_Event.next(event);
    if(this._config.LoggingSettings.EventOracleService_Can_Log)
      console.log(`EventOracle.event_card_onDelete_Event_BroadcastUpdate(): Broadcasting deleted touranment -> ${JSON.stringify(event)}`);
  }

  public event_toolBar_onDelete_EventList_BroadcastUpdate(event:RaceEvent[]) {
    this.removefromList(event);
    this._event_toolBar_onDelete_EventList.next(event);
    if(this._config.LoggingSettings.EventOracleService_Can_Log)
      console.log(`EventOracle.event_toolBar_onDelete_EventList_BroadcastUpdate(): Broadcasting deleted touranment list-> ${JSON.stringify(event)}`);
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

  pleaseGetMeGetAllEvents():Observable<RaceEvent[]>{

    if(this._config.LoggingSettings.EventOracleService_Can_Log)
      console.log(`EventOracle.pleaseGetMeGetAllEvents(): Requesting all events...`);

    return this._service.GetAllEvents()
                  .pipe(
                    tap(dbList=>{
                      if(this._config.LoggingSettings.EventOracleService_Can_Log)
                        console.log(`EventOracle.pleaseGetMeGetAllEvents().tap(): Setting The Oracles list with the result -> ${JSON.stringify(dbList)}`);
                        this.events = dbList;
                    }),
                    finalize(()=>{
                      if(this._config.LoggingSettings.EventOracleService_Can_Log)
                        console.log(`EventOracle.pleaseGetMeGetAllEvents().finalize(): Requesting all events complete`);
                    }),
                    catchError( val =>{ 
                      var msg:String;
                      msg = "*** \nEvent Oracle CAUGHT sleeping on the job ";
                      console.error(`EventOracle.pleaseGetMeGetAllEvents().catchError(): !!! ERROR !!! -> ${msg}\n***`);
                      return of(`${msg}: ${val}`)
                    })

                  );

  }

  pleaseAddAEvent(data:RaceEvent):Observable<any>{

    if(this._config.LoggingSettings.EventOracleService_Can_Log)
      console.log(`EventOracle.pleaseAddAEvents(): Adding 1 event -> ${data}`);

    return this._service.PostAEvent(data)
                  .pipe(
                    tap(dbList=>{
                      if(this._config.LoggingSettings.EventOracleService_Can_Log)
                        console.log(`EventOracle.pleaseAddAEvent().tap(): Result if any -> ${JSON.stringify(dbList)}`);
                    }),
                    finalize(()=>{
                      if(this._config.LoggingSettings.EventOracleService_Can_Log)
                        console.log(`EventOracle.pleaseAddAEvent().finalize(): Request to Add a event is complete. About to broadcast new event -> ${JSON.stringify(data)}`);
                        this.event_ToolBar_on_add_Event_BroadcastUpdate(data);
                    }),
                    catchError( val =>{ 
                      var msg:String;
                      msg = "*** \nEvent Oracle CAUGHT sleeping on the job ";
                      console.error(`EventOracle.pleaseAddAEvent().catchError(): !!! ERROR !!! -> ${msg}\n***`);
                      return of(`${msg}: ${val}`)
                    })

                  );

  }

  pleaseUpdateAEvent(data:RaceEvent):Observable<any>{

    if(this._config.LoggingSettings.EventOracleService_Can_Log)
      console.log(`EventOracle.pleaseUpdateAEvent(): Updating 1 event -> ${data}`);

    return this._service.UpdateEvent(data)
                  .pipe(
                    tap(result=>{
                      if(this._config.LoggingSettings.EventOracleService_Can_Log)
                        console.log(`EventOracle.pleaseUpdateAEvent().tap(): Result if any -> ${JSON.stringify(result)}`);
                    }),
                    finalize(()=>{
                      if(this._config.LoggingSettings.EventOracleService_Can_Log)
                        console.log(`EventOracle.pleaseUpdateAEvent().finalize(): Request to Update the event is complete. About to broadcast the UPDATED event -> ${JSON.stringify(data)}`);
                        this.event_toolBar_onUpdate_Event_BroadcastUpdate(data);
                    }),
                    catchError( val =>{ 
                      var msg:String;
                      msg = "*** \nEvent Oracle CAUGHT sleeping on the job ";
                      console.error(`EventOracle.pleaseUpdateAEvent().catchError(): !!! ERROR !!! -> ${msg}\n***`);
                      return of(`${msg}: ${val}`)
                    })

                  );

  }

  pleaseDeleteTheseEvents(data:RaceEvent[]):Observable<any>{

    if(this._config.LoggingSettings.EventOracleService_Can_Log)
      console.log(`EventOracle.pleaseUpdateAEvent(): Updating 1 event -> ${data}`);

    return this._service.DeleteEventList(data)
                  .pipe(
                    tap(result=>{
                      if(this._config.LoggingSettings.EventOracleService_Can_Log)
                        console.log(`EventOracle.pleaseUpdateAEvent().tap(): Result if any -> ${JSON.stringify(result)}`);
                    }),
                    finalize(()=>{
                      if(this._config.LoggingSettings.EventOracleService_Can_Log)
                        console.log(`EventOracle.pleaseUpdateAEvent().finalize(): Request to Update the event is complete. About to broadcast the UPDATED event -> ${JSON.stringify(data)}`);
                        this.event_toolBar_onDelete_EventList_BroadcastUpdate(data);
                    }),
                    catchError( val =>{ 
                      var msg:String;
                      msg = "*** \nEvent Oracle CAUGHT sleeping on the job ";
                      console.error(`EventOracle.pleaseUpdateAEvent().catchError(): !!! ERROR !!! -> ${msg}\n***`);
                      return of(`${msg}: ${val}`)
                    })

                  );

  }

}


