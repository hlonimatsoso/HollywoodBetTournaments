import { Component, OnInit,Input, ViewChild, ElementRef } from '@angular/core';
import { Tournament} from '../../../shared/models/Tournament';
import {FormControl, Validators} from '@angular/forms';
import {TournamentOracleService} from '../tournament-oracle.service';
import {Constants} from '../../../shared/models/constants';
import {map, tap,finalize,catchError } from 'rxjs/operators';
import {of} from 'rxjs';
import {ConfigService  } from '../../../shared/services/config.service';
import {trigger,state,transition,style,animate} from '@angular/animations'
import { Animations } from 'src/app/core/shared/models/Animations';


/**
 * Tournament Toolbar will soon _support_ [Markdown](https://marked.js.org/)
 * @description Controls editing options. Collects data to be updated or delete, and tasks the Tournament Oracle with the database oprations
 * @NB : All CRUD goes through the toolbar and through to the Oracle. 
 */
@Component({
  selector: 'app-tournament-card-tool-bar',
  templateUrl: './tournament-card-tool-bar.component.html',
  styleUrls: ['./tournament-card-tool-bar.component.scss'],
  animations:[
    Animations.fadeAnimation(null),
    Animations.InOutAnimation(null)
  ]
})
export class TournamentCardToolBarComponent implements OnInit {

  @Input() public isEditingEnabled:boolean;

  action:string;
  
  _activeTournamentForEditing:Tournament;
  _tournamentName: FormControl;

  public tournamentDeleteList:Tournament[];

  constructor(private _ohGreatOracle:TournamentOracleService,private _config:ConfigService) {
    this.tournamentDeleteList = [];
  }

  ngOnInit(): void {

    
    this._tournamentName = new FormControl('', [Validators.required]);

    this._ohGreatOracle.ready$.subscribe( oracle => {

                              oracle.tournamentsToDelete$.subscribe( deleteList => {
                                                          this.tournamentDeleteList = deleteList;
                              });
                              oracle.currentEditingAction$.subscribe( action => {
                                                          this.action = action;
                                                          if(action == "Add")
                                                            this._tournamentName.setValue("");
                              });
                              oracle.currentEditingTournament$.subscribe( tournment => {
                                                              if(tournment){
                                                                this._activeTournamentForEditing = tournment;
                                                                this._tournamentName.setValue(this._activeTournamentForEditing.tournamentName);
                                                              }
                              });
                              oracle.isToolBarEnabled$.subscribe(flag => {
                                                      this.isEditingEnabled = flag;
                              });
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
    this._ohGreatOracle.onCurrentActionChange(event.value);
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
    this._ohGreatOracle.onIsToolBarEnabledChange(event);
  }

/**
* @ngdoc function
* @name onActionChange
* @methodOf Tournament Oracle Service
* @description Name validation message.
* @returns {string} 
*/
  getErrorMessage() {
    if (this._tournamentName.hasError('required')) {
      return 'Enter a valid tournament name';
    }
  }

/**
* @ngdoc function
* @name getYingYangState
* @methodOf Tournament Tool Bar
* @description Returns the State to transition to on the Ying Yang Trigger.
* @returns {string} "on" or "off"
*/
  get getYingYangState(){
    return this.isEditingEnabled && this.action!="Delete" ? "on":"off";
  }

  get getAntiYingYangState(){
    return this.isEditingEnabled && this.action == "Delete" ? "on":"off";
  }

  /**
* @ngdoc function
* @name selectedBUttonText
* @methodOf Tournament Tool Bar
* @description Returns text to display ona button, based on the current Action selected.
* @returns {string} 
*/
  get selectedBUttonText(){
    return `${this.action} Tournament`;
  }

  /**
* @ngdoc function
* @name RunUpdate
* @methodOf Tournament Tool Bar
* @description Common method run to Add, Update or Detele tournaments.
* @returns {void} 
*/
  RunUpdate(){

    //console.log(`TournamentCardToolBar.RunUpdate() : Attempting to ${this.action}`);

    if(this.action == Constants.toolbar_button_add_action){
      this.addTournament();
    }else if(this.action == Constants.toolbar_button_edit_action){
      this.updateTournament();
    }else if(this.action == Constants.toolbar_button_delete_action){
      this.deleteTournament()
    }
    else{
      console.error(`TournamentCardToolBar.RunUpdate().this.action.Else{ } : !!! ERROR !!! -> '${this.action}' not a valid toolBar action type\n***`);
    }

    this._tournamentName.setValue("");
    this._ohGreatOracle.onCurrentActionChange(Constants.toolbar_button_add_action)
  }

  addTournament(){
    const t = { } as Tournament;
    t.tournamentName = this._tournamentName.value;
    this._ohGreatOracle.pleaseAddATournament(t);
  }

  updateTournament(){
    var t = new Tournament(this._activeTournamentForEditing.tournamentID,this._tournamentName.value);
    this._ohGreatOracle.pleaseUpdateATournament(t);
  }

  deleteTournament(){
    this._ohGreatOracle.pleaseDeleteTheseTournaments(this.tournamentDeleteList);
  }

  removeDeleteChip(t: Tournament): void {
    
    var index = this.tournamentDeleteList.indexOf(t);
 
    if (index >= 0) {
      this.tournamentDeleteList.splice(index, 1);
    }

    if(this.tournamentDeleteList.length == 0)
      this._ohGreatOracle.onCurrentActionChange(Constants.toolbar_button_add_action);
  }
}