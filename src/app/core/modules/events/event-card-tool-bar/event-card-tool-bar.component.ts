import { Component, OnInit,Input, ViewChild, ElementRef } from '@angular/core';
import { RaceEvent} from '../../../shared/models/Event';
import {FormControl, Validators} from '@angular/forms';
import {EventOracleService} from '../event-oracle.service';
import {Constants} from '../../../shared/models/constants';
import { tap,finalize,catchError } from 'rxjs/operators';
import {of} from 'rxjs';
import {ConfigService  } from '../../../shared/services/config.service';
import {TournamentOracleService  } from '../../tournaments/tournament-oracle.service';
import { TheOracleService } from 'src/app/core/shared/services/the-oracle.service';
import { Animations } from 'src/app/core/shared/models/Animations';






@Component({
  selector: 'app-event-card-tool-bar',
  templateUrl: './event-card-tool-bar.component.html',
  styleUrls: ['./event-card-tool-bar.component.scss'],
  animations:[
    Animations.InOutAnimation(null)
   ]
})
export class EventCardToolBarComponent implements OnInit {

  @Input() public isEditingEnabled:boolean;

  action:string;

  _activeEventForEditing:RaceEvent;

  eventDeleteList:RaceEvent[];

  _eventName = new FormControl('', [Validators.required]);

  _eventNumber = new FormControl('', [Validators.required,Validators.min(0), Validators.max(65536)]);

  _eventDate = new FormControl('', [Validators.required]);

  _eventEndDate = new FormControl('', [Validators.required]);

  _autoClose = new FormControl('', [Validators.required]);

  _tournament = new FormControl('', [Validators.required]);

  constructor(private _theOracle:TheOracleService) {
    this.eventDeleteList = [];
   }
  ngOnInit(): void {

    
    this._eventName = new FormControl('', [Validators.required]);
    this._theOracle.eventOracle.eventsToDelete$.subscribe( deleteList => {
      this.eventDeleteList = deleteList;
    });
    this._theOracle.eventOracle.currentEditingAction$.subscribe( action => {
          this.action = action;
          if(action == "Add")
            this._eventName.setValue("");
    });
    this._theOracle.eventOracle.currentEditingEvent$.subscribe( event => {
              if(event){
                this._activeEventForEditing = event;
                this._eventName.setValue(this._activeEventForEditing.eventName);
                this._eventNumber.setValue(this._activeEventForEditing.eventNumber);
                this._eventDate.setValue(this._activeEventForEditing.eventDateTime);
                this._eventEndDate.setValue(this._activeEventForEditing.eventDateTime);
                this._autoClose.setValue(this._activeEventForEditing.autoClose);
                this._tournament.setValue(this._activeEventForEditing.tournamentID);


              }
    });
    this._theOracle.eventOracle.isToolBarEnabled$.subscribe(flag => {
      this.isEditingEnabled = flag;
    });

  }

/**
* @ngdoc function
* @name onActionChange
* @methodOf Tournament Oracle Service
* @description Broadcasts the change of the Action state of the Tournament Toolbar.
* @param {action=} string Either "Add", "Edit" or "Delete"
* @returns {void} no return
*/
onActionChange(event:any){
  this._theOracle.eventOracle.onCurrentActionChange(event.value);
}

/**
* @ngdoc function
* @name onActionChange
* @methodOf Tournament Oracle Service
* @description Broadcasts the change of the Toolbars 'isToolBarEnabled' flag.
* @param {action=} boolean
* @returns {void} no return
*/
onEnableToolBarEditingOptionsChanged(event:boolean)
{
  this._theOracle.eventOracle.onIsToolBarEnabledChange(event);
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
    return this._theOracle.tournamentOracle.tournaments$.getValue();
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

    index = this.eventDeleteList.indexOf(t);

        if (index >= 0) {
          this.eventDeleteList.splice(index, 1);
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
    event.eventNumber = this._eventNumber.value;
    event.tournamentID = this._tournament.value;
    event.autoClose = this._autoClose.value;
    event.eventDateTime = this._eventDate.value;
    event.eventEndDateTime = this._eventEndDate.value;

    this._theOracle.eventOracle.pleaseAddAEvent(event)
       
    }

  updateEvent(name:string){
    var t = { } as RaceEvent;
    t.eventName = name;
    t.eventID = this._activeEventForEditing.eventID;
    t.tournamentID = this._tournament.value;
    t.autoClose = this._autoClose.value;
    t.eventDateTime = this._eventDate.value;
    t.eventEndDateTime = this._eventEndDate.value;
    t.eventNumber = this._eventNumber.value;


    this._theOracle.eventOracle.pleaseUpdateAEvent(t)
   }

  deleteEvent(){
    this._theOracle.eventOracle.pleaseDeleteTheseEvents(this.eventDeleteList);
    
  }
}