import { Component, OnInit,Input, ViewChild, ElementRef } from '@angular/core';
import { EventDetail} from '../../../shared/models/EventDetail';
import {FormControl, Validators} from '@angular/forms';
import {EventDetailsOracleService} from '../event-details-oracle.service';
import {Constants} from '../../../shared/models/constants';
import {map, tap,finalize,catchError } from 'rxjs/operators';
import {of} from 'rxjs';
import {ConfigService  } from '../../../shared/services/config.service';
import {TournamentOracleService  } from '../../tournaments/tournament-oracle.service';
//import { EventDetail } from 'src/app/core/shared/models/EventDetail';






@Component({
  selector: 'app-event-card-tool-bar',
  templateUrl: './event-details-card-tool-bar.component.html',
  styleUrls: ['./event-details-card-tool-bar.component.scss']
})
export class EventDetailsCardToolBarComponent implements OnInit {

  @Input() public enableEditing:boolean;
  @ViewChild("name") nameField: ElementRef

  action:string;

  activeEventDetailForEditing:EventDetail;

  eventDeleteList:EventDetail[];

  _eventDetailName = new FormControl('', [Validators.required]);

  _eventDetailNumber = new FormControl('', [Validators.required,Validators.min(0), Validators.max(65536)]);

  _eventDetailOdd = new FormControl('', [Validators.required]);

  _finishingPosition = new FormControl('', [Validators.required]);

  _firstTimer = new FormControl('', [Validators.required]);

  _event = new FormControl('', [Validators.required]);

  _eventDetailStatus = new FormControl('', [Validators.required]);


  get getAllStatuses(){

    return this._ohGreatOracle.availableStatuses;
  }

  get getAllEvents(){
  
    return this._ohGreatOracle.currentEvents;
  }

  constructor(private _ohGreatOracle:EventDetailsOracleService,private _config:ConfigService, private _tournamentOracle:TournamentOracleService) { }

  ngOnInit(): void {
    this.eventDeleteList = [];
    
    this._ohGreatOracle.event_details_card_on_edit_Event$.subscribe((event)=>{
    
      this.activeEventDetailForEditing = event;
      this._eventDetailName.setValue(this.activeEventDetailForEditing.eventDetailName);
      this._eventDetailNumber.setValue(this.activeEventDetailForEditing.eventDetailNumber);
      this._eventDetailOdd.setValue(this.activeEventDetailForEditing.eventDetailOdd);
      this._finishingPosition.setValue(this.activeEventDetailForEditing.finishingPosition);
      this._event.setValue(this.activeEventDetailForEditing.eventID);
      this._eventDetailStatus.setValue(this.activeEventDetailForEditing.eventDetailStatus);


      this.onActionChange({"value":"Edit"});
    });

    this._ohGreatOracle.event_details_card_onDelete_Event$.subscribe((event)=>{
      this.activeEventDetailForEditing = event;
      this.eventDeleteList.push(event);
      this.onActionChange({"value":"Delete"});
    });
  }

  onActionChange(event:any){
    console.log(`EventDetailsCardToolBar.onActionChange() : Event -> ${event.value}`);
    console.log(`EventDetailsCardToolBar.onActionChange() : Updating this.action to '${event.value}' and then broadcasting it via the Oracle`);
    this.action = event.value;
    //this._eventName.reset();
    //debugger;
    //this.nameField.nativeElement.focus();

    this._ohGreatOracle.event_details_toolBar_onActionChange_BroadcastUpdate(this.action);
  }

  onEnableToolBarEditingOptionsChanged(event:boolean)
  {
    console.log(`EventDetailsCardToolBar.onEnableToolBarEditingOptionsChanged() : Event -> ${event}`);
    console.log(`EventDetailsCardToolBar.onEnableToolBarEditingOptionsChanged() : Broadcasting event via The Great Oracle`);

    this.enableEditing = event;
    this._ohGreatOracle.event_details_toolBar_onEnableToolBarEditingOptions_Change_BroadcastUpdate(event)

    console.log(`EventDetailsCardToolBar.onEnableToolBarEditingOptionsChanged() : Change action to 'Add' as the default`);
    this.onActionChange({"value":"Add"});
  }

  get getEventNameValidationMessage() {
    if (this._eventDetailName.hasError('required')) {
      return 'Enter an event name';
    }else{
      console.log(`EventToolBar.getEmailValidationMessage(): something...`);
    }
  }

  get getEventNumberValidationMessage() {
    if (this._eventDetailNumber.hasError('required')) {
      return 'Enter a valid event number';
    }
  }

  // get getEventDetailOddValidationMessage() {
  //   if (this._eventDetailNumber.hasError('required')) {
  //     return 'Enter a valid event number';
  //   }
  // }

  get getEventValidationMessage() {
    if (this._event.hasError('required')) {
      return 'Select from the available events ';
    }
  }

  get getEventDetailOddsValidationMessage() {
    if (this._eventDetailOdd.hasError('required')) {
      return 'What are the horses odds ?';
    }
  }

  get getFinishingPositionValidationMessage() {
    if (this._finishingPosition.hasError('required')) {
      return 'Enter a valid finishing position';
    }
  }

  get getFirstTimerValidationMessage() {
    if (this._firstTimer.hasError('required')) {
      return 'Is this the horses 1st time racing ?';
    }
  }

  // get selectedBUttonText(){
  //   return `${this.activeToolBarButton} Event`;
  // }

  get areAllInputsValid(){
    var result = false;
    result = this._eventDetailName.valid     &&
             this._eventDetailNumber.valid   &&
             this._eventDetailOdd.valid     &&
             this._eventDetailStatus.valid     &&
             this._finishingPosition.valid  &&
             this._firstTimer.valid;
    //console.log(`EventToolBar.FormValidations.areAllInputsValid(): Result -> ${result}`);
    return result;
  }

  get currentTournamentList(){
    return this._tournamentOracle.tournaments;
  }

  getErrorMessage() {
    if (this._eventDetailName.hasError('required')) {
      return 'Enter a valid event name';
    }
  }

  get selectedBUttonText(){
    return `${this.action} Event`;
  }

  remove(t: EventDetail): void {
    var index = this.eventDeleteList.indexOf(t);

    if (index >= 0) {
      this.eventDeleteList.splice(index, 1);
    }

    index = this._ohGreatOracle.eventDetailsToDelete.indexOf(t);

        if (index >= 0) {
          this._ohGreatOracle.eventDetailsToDelete.splice(index, 1);
        }
  }

  RunUpdate(){

    console.log(`EventDetailsCardToolBar.RunUpdate() : Attempting to ${this.action}`);

    if(this.action == Constants.toolbar_button_add_action){
      this.addEvent();
    }else if(this.action == Constants.toolbar_button_edit_action){
      this.updateEvent();
    }else if(this.action == Constants.toolbar_button_delete_action){
    
    }
    else{
      console.error(`EventDetailsCardToolBar.RunUpdate().this.action.Else{ }: !!! ERROR !!! -> '${this.action}' not a valid toolBar action type\n***`);
    }

    //this._eventDetailName.reset();
  }

  addEvent(){

    const event = { } as EventDetail;
    event.eventDetailName = this._eventDetailName.value;
    event.eventDetailNumber = this._eventDetailNumber.value;
    event.eventDetailOdd = this._eventDetailOdd.value;
    event.finishingPosition = this._finishingPosition.value;
    event.firstTimer = this._firstTimer.value;
    event.eventID = this._event.value;
    event.eventDetailStatus = this._eventDetailStatus.value;


    this._ohGreatOracle.pleaseAddAEvent(event)
        .pipe(
          tap(result=>{
            if(this._config.LoggingSettings.Events_ToolBar_Can_Log)
              console.log(`EventDetailsCardToolBar.addEvent()._ohGreatOracle.pleaseAddAEvent.tap(): Result -> ${JSON.stringify(result)}`);
          }),
          finalize(()=>{
            if(this._config.LoggingSettings.Events_ToolBar_Can_Log)
              console.log(`EventDetailsCardToolBar.GetAllEvents()._ohGreatOracle.pleaseAddAEvent.finalize(): Add event request complete`);
          }),
          catchError( val =>{ 
            var msg:String;
            msg = "*** \nEvent Oracle CAUGHT sleeping on the job ";
            console.error(`EventDetailsCardToolBar.GetAllEvents()._ohGreatOracle.pleaseAddAEvent.catchError(): !!! ERROR !!! -> ${msg}\n***`);
            return of(`${msg}: ${val}`)
          })
        ).subscribe(resut=>{
            // do something for the user 
        });
    }

  updateEvent(){
    var t = {} as EventDetail;
    t.eventDetailName = this.activeEventDetailForEditing.eventDetailName;
    t.eventDetailID = this.activeEventDetailForEditing.eventDetailID;
    t.eventDetailStatusID = this.activeEventDetailForEditing.eventDetailStatusID;
    t.eventID = this.activeEventDetailForEditing.eventID;
    t.finishingPosition = this.activeEventDetailForEditing.finishingPosition;
    t.eventDetailOdd = this.activeEventDetailForEditing.eventDetailOdd;
    t.firstTimer = this.activeEventDetailForEditing.firstTimer;


    this._ohGreatOracle.pleaseUpdateAEvent(t)
        .pipe(
          tap(data => {
            console.log(`EventDetailsCardToolBar.updateEvent()._ohGreatOracle.pleaseUpdateAEvent.tap(): Update event request complete`);
            this._ohGreatOracle.event_details_toolBar_onUpdate_Event_BroadcastUpdate(t);
          }),
          catchError( val =>{ 
            var msg:String;
            msg = "*** \nEvent Detail Oracle CAUGHT sleeping on the job ";
            console.error(`EventDetailsCardToolBar.updateEvent()._ohGreatOracle.pleaseAddAEvent.catchError(): !!! ERROR !!! -> ${val}\n***`);
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
        this._ohGreatOracle.event_details_toolBar_onDelete_EventList_BroadcastUpdate(this.eventDeleteList);
        this.eventDeleteList = [];
      })
    )
    .subscribe(o=>{
      console.log(`Event Toolbar: Event service delete result: ${o}`);
    });
  }
}