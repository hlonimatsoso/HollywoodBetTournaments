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
//import { EventDetail } from 'src/app/core/shared/models/EventDetail';






@Component({
  selector: 'app-event-card-tool-bar',
  templateUrl: './event-details-card-tool-bar.component.html',
  styleUrls: ['./event-details-card-tool-bar.component.scss']
})
export class EventDetailsCardToolBarComponent implements OnInit {

  @Input() public isEditingEnabled:boolean;
  @ViewChild("name") nameField: ElementRef

  action:string;

  _activeEventDetailForEditing:EventDetail;

  eventDetailsDeleteList:EventDetail[];
  eventDetailStatuses:EventDetailStatus[];


  _eventDetailName = new FormControl('', [Validators.required]);

  _eventDetailNumber = new FormControl('', [Validators.required,Validators.min(0), Validators.max(65536)]);

  _eventDetailOdd = new FormControl('', [Validators.required]);

  _finishingPosition = new FormControl('', [Validators.required]);

  _firstTimer = new FormControl('', [Validators.required]);

  _event = new FormControl('', [Validators.required]);

  _eventDetailStatus = new FormControl('', [Validators.required]);


  get getAllStatuses(){

    var x = this._ohGreatOracle.eventDetailStatuses$.getValue();
    return x;
  }

  get getEvents(){

    return this._ohGreatOracle.events;
  }

  constructor(private _ohGreatOracle:EventDetailsOracleService,private _config:ConfigService, private _eventOracle:EventOracleService) { }

  ngOnInit(): void {
    this._eventDetailName = new FormControl('', [Validators.required]);

    this._ohGreatOracle.ready$.subscribe( oracle => {

                              oracle.eventDetailsToDelete$.subscribe( deleteList => {
                                                          this.eventDetailsDeleteList = deleteList;
                              });
                              oracle.currentEditingAction$.subscribe( action => {
                                                          this.action = action;
                                                          // if(action == "Add")
                                                          //   this._tournamentName.setValue("");
                              });
                              oracle.currentEditingEventDetail$.subscribe( ed => {
                                                              if(ed){
                                                                this._activeEventDetailForEditing = ed;
                                                                this._eventDetailName.setValue(this._activeEventDetailForEditing.eventDetailName);
                                                              }
                              });
                              oracle.isToolBarEnabled$.subscribe(flag => {
                                                      this.isEditingEnabled = flag;
                              });
                              oracle.eventDetailStatuses$.subscribe(x => {
                                this.eventDetailStatuses = x;
                              });
    });
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
  this._ohGreatOracle.onCurrentActionChange(event.value);
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
  this._ohGreatOracle.onIsToolBarEnabledChange(event);
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
    return this._eventOracle.events$.getValue();
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
    event.eventDetailStatusID = this._eventDetailStatus.value;


    this._ohGreatOracle.pleaseAddAEventDEtail(event);
       
    }

  updateEvent(){
    var t = {} as EventDetail;
    t.eventDetailName = this._activeEventDetailForEditing.eventDetailName;
    t.eventDetailID = this._activeEventDetailForEditing.eventDetailID;
    t.eventDetailStatusID = this._activeEventDetailForEditing.eventDetailStatusID;
    t.eventID = this._activeEventDetailForEditing.eventID;
    t.finishingPosition = this._activeEventDetailForEditing.finishingPosition;
    t.eventDetailOdd = this._activeEventDetailForEditing.eventDetailOdd;
    t.firstTimer = this._activeEventDetailForEditing.firstTimer;

    this._ohGreatOracle.pleaseUpdateAEventDetails(t);


    this._ohGreatOracle.pleaseUpdateAEventDetails(t);
  }

  deleteEvent(){
    this._ohGreatOracle.pleaseDeleteTheseEventDetails(this.eventDetailsDeleteList);
  }
}