import { Component, OnInit,Input, ViewChild, ElementRef } from '@angular/core';
import { EventDetail} from '../../../shared/models/EventDetail';
import {FormControl, Validators} from '@angular/forms';
import {EventDetailsOracleService} from '../event-details-oracle.service';
import {Constants} from '../../../shared/models/constants';
import {map, tap,finalize,catchError } from 'rxjs/operators';
import {of} from 'rxjs';
import {ConfigService  } from '../../../shared/services/config.service';
import {TournamentOracleService  } from '../../tournaments/tournament-oracle.service';
import { EventOracleService } from '../../events/event-oracle.service';
import { EventDetailStatus } from 'src/app/core/shared/models/EventDetailStatus';
import { TheOracleService } from 'src/app/core/shared/services/the-oracle.service';
import { Animations } from 'src/app/core/shared/models/Animations';
//import { EventDetail } from 'src/app/core/shared/models/EventDetail';






@Component({
  selector: 'app-event-card-tool-bar',
  templateUrl: './event-details-card-tool-bar.component.html',
  styleUrls: ['./event-details-card-tool-bar.component.scss'],
  animations:[
    Animations.InOutAnimation(null)
   ]
})
export class EventDetailsCardToolBarComponent implements OnInit {

  @Input() public isEditingEnabled:boolean;
  //@ViewChild("name") nameField: ElementRef

  
  action:string;

  _activeEventDetailForEditing:EventDetail;

  eventDetailsDeleteList:EventDetail[];
  eventDetailStatuses:EventDetailStatus[];

  _eventDetailID:Number;

  _eventDetailName = new FormControl('', [Validators.required]);

  _eventDetailNumber = new FormControl('', [Validators.required,Validators.min(0), Validators.max(65536)]);

  _eventDetailOdd = new FormControl('', [Validators.required]);

  _finishingPosition = new FormControl('', [Validators.required]);

  _firstTimer = new FormControl('', [Validators.required]);

  _event = new FormControl('', [Validators.required]);

  _eventDetailStatus = new FormControl('', [Validators.required]);


  get getAllStatuses(){

    var x = this._oracle.eventDetailsOracle.eventDetailStatuses$.getValue();
    return x;
  }

  get getEvents(){

    return this._oracle.eventDetailsOracle.events;
  }

  constructor(private _oracle:TheOracleService,private _config:ConfigService) { }

  ngOnInit(): void {
    //this._eventDetailName = new FormControl('', [Validators.required]);

    this._oracle.eventDetailsOracle.eventDetailsToDelete$.subscribe( deleteList => {
      this.eventDetailsDeleteList = deleteList;
    });

    this._oracle.eventDetailsOracle.currentEditingAction$.subscribe( action => {
      this.action = action;
      // if(action == "Add")
      //   this._tournamentName.setValue("");
    });

    this._oracle.eventDetailsOracle.currentEditingEventDetail$.subscribe( horse => {
      if(horse)
        this.fillControlsWithEventDetailsData(horse);
   
    });

    this._oracle.eventDetailsOracle.isToolBarEnabled$.subscribe(flag => {
      this.isEditingEnabled = flag;
    });

    this._oracle.eventDetailsOracle.eventDetailStatuses$.subscribe(x => {
      this.eventDetailStatuses = x;
    });
    
  }
  fillControlsWithEventDetailsData(horse: EventDetail) {
    this._activeEventDetailForEditing = horse;
    this._eventDetailID = this._activeEventDetailForEditing.eventDetailID;
    this._event.setValue(this._activeEventDetailForEditing.eventID);
    this._eventDetailName.setValue(this._activeEventDetailForEditing.eventDetailName);
    this._eventDetailNumber.setValue(this._activeEventDetailForEditing.eventDetailNumber);
    this._eventDetailOdd.setValue(this._activeEventDetailForEditing.eventDetailOdd);
    this._eventDetailStatus.setValue(this._activeEventDetailForEditing.eventDetailStatusID);
    this._finishingPosition.setValue(this._activeEventDetailForEditing.finishingPosition);
    this._firstTimer.setValue(this._activeEventDetailForEditing.firstTimer);

  }
/**
* @ngdoc function
* @name onActionChange
* @methodOf Event Details Oracle Service
* @description Broadcasts the change of the Action state of the Tournament Toolbar.
* @param {action=} string Either "Add", "Edit" or "Delete"
* @returns {void} no return
*/
onActionChange(event:any){
  this._oracle.eventDetailsOracle.onCurrentActionChange(event.value);
}

/**
* @ngdoc function
* @name onActionChange
* @methodOf Event Details Oracle Service
* @description Broadcasts the change of the Toolbars 'isToolBarEnabled' flag.
* @param {action=} boolean
* @returns {void} no return
*/
onEnableToolBarEditingOptionsChanged(event:boolean)
{
  this._oracle.eventDetailsOracle.onIsToolBarEnabledChange(event);
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

  get currentEventList(){
    return this._oracle.eventOracle.events$.getValue();
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
    var index = this.eventDetailsDeleteList.indexOf(t);

    if (index >= 0) {
      this.eventDetailsDeleteList.splice(index, 1);
    }

    index = this._oracle.eventDetailsOracle.eventDetailsToDelete.indexOf(t);

        if (index >= 0) {
          this._oracle.eventDetailsOracle.eventDetailsToDelete.splice(index, 1);
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
    event.eventDetailStatusID = this._eventDetailStatus.value;

    this._oracle.eventDetailsOracle.pleaseAddAEventDEtail(event);
       
    }
    

  updateEvent(){
    var t = {} as EventDetail;
    t.eventDetailName = this._eventDetailName.value;
    t.eventDetailID = this._eventDetailID;
    t.eventDetailStatusID = this._eventDetailStatus.value;
    t.eventID = this._event.value;
    t.finishingPosition = this._finishingPosition.value;
    t.eventDetailOdd = this._eventDetailOdd.value;
    t.firstTimer = this._firstTimer.value;
    t.eventDetailNumber = this._eventDetailNumber.value;


    this._oracle.eventDetailsOracle.pleaseUpdateAEventDetails(t);
  }

  deleteEvent(){
    this._oracle.eventDetailsOracle.pleaseDeleteTheseEventDetails(this.eventDetailsDeleteList);
  }
}