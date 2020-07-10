import { Component, OnInit,Input, ViewChild, ElementRef } from '@angular/core';
import { RaceEvent} from '../../../shared/models/Event';
import {FormControl, Validators} from '@angular/forms';
import {EventOracleService} from '../event-oracle.service';
import {Constants} from '../../../shared/models/constants';
import {map, tap,finalize,catchError } from 'rxjs/operators';
import {of} from 'rxjs';
import {ConfigService  } from '../../../shared/services/config.service';
import {TournamentOracleService  } from '../../tournaments/tournament-oracle.service';






@Component({
  selector: 'app-event-card-tool-bar',
  templateUrl: './event-card-tool-bar.component.html',
  styleUrls: ['./event-card-tool-bar.component.scss']
})
export class EventCardToolBarComponent implements OnInit {

  @Input() public enableEditing:boolean;
  @ViewChild("name") nameField: ElementRef

  action:string;

  activeEventForEditing:RaceEvent;

  eventDeleteList:RaceEvent[];

  _eventName = new FormControl('', [Validators.required]);

  _eventNumber = new FormControl('', [Validators.required,Validators.min(0), Validators.max(65536)]);

  _eventDate = new FormControl('', [Validators.required]);

  _eventEndDate = new FormControl('', [Validators.required]);

  _autoClose = new FormControl('', [Validators.required]);

  _tournament = new FormControl('', [Validators.required]);

  constructor(private _ohGreatOracle:EventOracleService,private _config:ConfigService, private _tournamentOracle:TournamentOracleService) { }

  ngOnInit(): void {
    this.eventDeleteList = [];
    
    this._ohGreatOracle.event_card_on_edit_Event$.subscribe((event)=>{
    
      this.activeEventForEditing = event;
      this._eventName.setValue(this.activeEventForEditing.eventName);
      this._eventNumber.setValue(this.activeEventForEditing.eventNumber);
      this._eventDate.setValue(this.activeEventForEditing.eventDateTime);
      this._eventEndDate.setValue(this.activeEventForEditing.eventDateTime);
      this._tournament.setValue(this.activeEventForEditing.tournamentID);
      this._autoClose.setValue(this.activeEventForEditing.autoClose);


      this.onActionChange({"value":"Edit"});
    });

    this._ohGreatOracle.event_card_onDelete_Event$.subscribe((event)=>{
      this.activeEventForEditing = event;
      this.eventDeleteList.push(event);
      this.onActionChange({"value":"Delete"});
    });
  }

  onActionChange(event:any){
    console.log(`EventCardToolBar.onActionChange() : Event -> ${event.value}`);
    console.log(`EventCardToolBar.onActionChange() : Updating this.action to '${event.value}' and then broadcasting it via the Oracle`);
    this.action = event.value;
    //this._eventName.reset();
    //debugger;
    //this.nameField.nativeElement.focus();

    this._ohGreatOracle.event_toolBar_onActionChange_BroadcastUpdate(this.action);
  }

  onEnableToolBarEditingOptionsChanged(event:boolean)
  {
    console.log(`EventCardToolBar.onEnableToolBarEditingOptionsChanged() : Event -> ${event}`);
    console.log(`EventCardToolBar.onEnableToolBarEditingOptionsChanged() : Broadcasting event via The Great Oracle`);

    this.enableEditing = event;
    this._ohGreatOracle.event_ToolBar_onEnableToolBarEditingOptions_Change_BroadcastUpdate(event)

    console.log(`EventCardToolBar.onEnableToolBarEditingOptionsChanged() : Change action to 'Add' as the default`);
    this.onActionChange({"value":"Add"});
  }

  get getEventNameValidationMessage() {
    if (this._eventName.hasError('required')) {
      return 'Enter an event name';
    }else{
      console.log(`EventToolBar.getEmailValidationMessage(): something...`);
    }
  }

  get getEventNumberValidationMessage() {
    if (this._eventName.hasError('required')) {
      return 'Enter a valid event number';
    }
  }

  get getEventDateValidationMessage() {
    if (this._eventDate.hasError('required')) {
      return 'Enter a valid event start date';
    }
  }

  get getEventEndDateValidationMessage() {
    if (this._eventEndDate.hasError('required')) {
      return 'Enter a valid event end date';
    }
  }

  get getAutoCloseValidationMessage() {
    if (this._eventEndDate.hasError('required')) {
      return 'Choose if event should auto close';
    }
  }

  // get selectedBUttonText(){
  //   return `${this.activeToolBarButton} Event`;
  // }

  get areAllInputsValid(){
    var result = false;
    result = this._eventName.valid     &&
             this._eventNumber.valid   &&
             this._eventDate.valid     &&
             this._autoClose.valid     &&
             this._eventEndDate.valid  &&
             this._tournament.valid;
    //console.log(`EventToolBar.FormValidations.areAllInputsValid(): Result -> ${result}`);
    return result;
  }

  get currentTournamentList(){
    return this._tournamentOracle.tournaments;
  }

  getErrorMessage() {
    if (this._eventName.hasError('required')) {
      return 'Enter a valid event name';
    }
  }

  get selectedBUttonText(){
    return `${this.action} Event`;
  }

  remove(t: RaceEvent): void {
    var index = this.eventDeleteList.indexOf(t);

    if (index >= 0) {
      this.eventDeleteList.splice(index, 1);
    }

    index = this._ohGreatOracle.eventsToDelete.indexOf(t);

        if (index >= 0) {
          this._ohGreatOracle.eventsToDelete.splice(index, 1);
        }
  }

  RunUpdate(){

    console.log(`EventCardToolBar.RunUpdate() : Attempting to ${this.action}`);

    if(this.action == Constants.toolbar_button_add_action){
      this.addEvent();
    }else if(this.action == Constants.toolbar_button_edit_action){
      this.updateEvent(this._eventName.value);
    }else if(this.action == Constants.toolbar_button_delete_action){
    
    }
    else{
      console.error(`EventCardToolBar.RunUpdate().this.action.Else{ }: !!! ERROR !!! -> '${this.action}' not a valid toolBar action type\n***`);
    }

    this._eventName.reset();
  }

  addEvent(){

    const event = { } as RaceEvent;
    event.eventName = this._eventName.value;
    event.tournamentID = this._tournament.value;
    event.autoClose = this._autoClose.value;
    event.eventDateTime = this._eventDate.value;
    event.eventEndDateTime = this._eventEndDate.value;

    this._ohGreatOracle.pleaseAddAEvent(event)
        .pipe(
          tap(result=>{
            if(this._config.LoggingSettings.Events_ToolBar_Can_Log)
              console.log(`EventCardToolBar.addEvent()._ohGreatOracle.pleaseAddAEvent.tap(): Result -> ${JSON.stringify(result)}`);
          }),
          finalize(()=>{
            if(this._config.LoggingSettings.Events_ToolBar_Can_Log)
              console.log(`EventCardToolBar.GetAllEvents()._ohGreatOracle.pleaseAddAEvent.finalize(): Add event request complete`);
          }),
          catchError( val =>{ 
            var msg:String;
            msg = "*** \nEvent Oracle CAUGHT sleeping on the job ";
            console.error(`EventCardToolBar.GetAllEvents()._ohGreatOracle.pleaseAddAEvent.catchError(): !!! ERROR !!! -> ${msg}\n***`);
            return of(`${msg}: ${val}`)
          })
        ).subscribe(resut=>{
            // do something for the user 
        });
    }

  updateEvent(name:string){
    var t = {} as RaceEvent;
    t.eventName = name;
    t.eventID = this.activeEventForEditing.eventID;

    this._ohGreatOracle.pleaseUpdateAEvent(t)
        .pipe(
          tap(data => {
            console.log(`EventCardToolBar.updateEvent()._ohGreatOracle.pleaseUpdateAEvent.tap(): Update event request complete`);
            this._ohGreatOracle.event_toolBar_onUpdate_Event_BroadcastUpdate(t);
          }),
          catchError( val =>{ 
            var msg:String;
            msg = "*** \nEvent Oracle CAUGHT sleeping on the job ";
            console.error(`EventCardToolBar.updateEvent()._ohGreatOracle.pleaseAddAEvent.catchError(): !!! ERROR !!! -> ${val}\n***`);
            return of(`${msg}: ${val}`)
          })
        ).subscribe(result=>{
          console.log('subscrfiption data:', result)

        });
  }

  deleteEvent(){
    this._ohGreatOracle.pleaseDeleteTheseEvents(this.eventDeleteList)
    .pipe(
      finalize(()=>{
        console.log(`Event Toolbar: eventToolBar_deleteEventList_sendUpdate: ${this.eventDeleteList}`);
        this._ohGreatOracle.event_toolBar_onDelete_EventList_BroadcastUpdate(this.eventDeleteList);
        this.eventDeleteList = [];
      })
    )
    .subscribe(o=>{
      console.log(`Event Toolbar: Event service delete result: ${o}`);
    });
  }
}