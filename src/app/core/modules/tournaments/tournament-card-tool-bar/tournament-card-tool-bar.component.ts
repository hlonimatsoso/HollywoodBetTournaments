import { Component, OnInit,Input, ViewChild, ElementRef } from '@angular/core';
import { Tournament} from '../../../shared/models/Tournament';
import {FormControl, Validators} from '@angular/forms';
import {TournamentOracleService} from '../tournament-oracle.service';
import {Constants} from '../../../shared/models/constants';
import {map, tap,finalize,catchError } from 'rxjs/operators';
import {of} from 'rxjs';
import {ConfigService  } from '../../../shared/services/config.service';





@Component({
  selector: 'app-tournament-card-tool-bar',
  templateUrl: './tournament-card-tool-bar.component.html',
  styleUrls: ['./tournament-card-tool-bar.component.scss']
})
export class TournamentCardToolBarComponent implements OnInit {

  @Input() public enableEditing:boolean;
  @ViewChild("name") nameField: ElementRef
  action:string;

  activeTournamentForEditing:Tournament;

  tournamentDeleteList:Tournament[];

  _tournamentName = new FormControl('', [Validators.required]);

  constructor(private _ohGreatOracle:TournamentOracleService,private _config:ConfigService) { }

  ngOnInit(): void {
    this.tournamentDeleteList = [];
    
    this._ohGreatOracle.tournament_card_on_edit_Tournament$.subscribe((tournament)=>{
      this.activeTournamentForEditing = tournament;
      this._tournamentName.setValue(this.activeTournamentForEditing.tournamentName);
      this.onActionChange({"value":"Edit"});
    });

    this._ohGreatOracle.tournament_card_onDelete_Tournament$.subscribe((tournament)=>{
      this.activeTournamentForEditing = tournament;
      this.tournamentDeleteList.push(tournament);
      this.onActionChange({"value":"Delete"});
    });
  }

  onActionChange(event:any){
    console.log(`TournamentCardToolBar.onActionChange() : Event -> ${event.value}`);
    console.log(`TournamentCardToolBar.onActionChange() : Updating this.action to '${event.value}' and then broadcasting it via the Oracle`);
    this.action = event.value;
    //this._tournamentName.reset();
    //debugger;
    //this.nameField.nativeElement.focus();

    this._ohGreatOracle.tournament_toolBar_onActionChange_BroadcastUpdate(this.action);
  }

  onEnableToolBarEditingOptionsChanged(event:boolean)
  {
    console.log(`TournamentCardToolBar.onEnableToolBarEditingOptionsChanged() : Event -> ${event}`);
    console.log(`TournamentCardToolBar.onEnableToolBarEditingOptionsChanged() : Broadcasting event via The Great Oracle`);

    this.enableEditing = event;
    this._ohGreatOracle.tournament_ToolBar_onEnableToolBarEditingOptions_Change_BroadcastUpdate(event)

    console.log(`TournamentCardToolBar.onEnableToolBarEditingOptionsChanged() : Change action to 'Add' as the default`);
    this.onActionChange({"value":"Add"});
  }

  getErrorMessage() {
    if (this._tournamentName.hasError('required')) {
      return 'Enter a valid tournament name';
    }
  }

  get selectedBUttonText(){
    return `${this.action} Tournament`;
  }

  remove(t: Tournament): void {
    var index = this.tournamentDeleteList.indexOf(t);

    if (index >= 0) {
      this.tournamentDeleteList.splice(index, 1);
    }

    index = this._ohGreatOracle.tournamentsToDelete.indexOf(t);

        if (index >= 0) {
          this._ohGreatOracle.tournamentsToDelete.splice(index, 1);
        }
  }

  RunUpdate(){

    console.log(`TournamentCardToolBar.RunUpdate() : Attempting to ${this.action}`);

    if(this.action == Constants.toolbar_button_add_action){
      this.addTournament();
    }else if(this.action == Constants.toolbar_button_edit_action){
      this.updateTournament(this._tournamentName.value);
    }else if(this.action == Constants.toolbar_button_delete_action){
    
    }
    else{
      console.error(`TournamentCardToolBar.RunUpdate().this.action.Else{ }: !!! ERROR !!! -> '${this.action}' not a valid toolBar action type\n***`);
    }

    this._tournamentName.reset();
  }

  addTournament(){

    const t = { } as Tournament;
    t.tournamentName = this._tournamentName.value;

    this._ohGreatOracle.pleaseAddATournament(t)
        .pipe(
          tap(result=>{
            if(this._config.LoggingSettings.Tournament_ToolBar_Can_Log)
              console.log(`TournamentCardToolBar.addTournament()._ohGreatOracle.pleaseAddATournament.tap(): Result -> ${JSON.stringify(result)}`);
          }),
          finalize(()=>{
            if(this._config.LoggingSettings.Tournament_ToolBar_Can_Log)
              console.log(`TournamentCardToolBar.GetAllTournaments()._ohGreatOracle.pleaseAddATournament.finalize(): Add tournament request complete`);
          }),
          catchError( val =>{ 
            var msg:String;
            msg = "*** \nTournament Oracle CAUGHT sleeping on the job ";
            console.error(`TournamentCardToolBar.GetAllTournaments()._ohGreatOracle.pleaseAddATournament.catchError(): !!! ERROR !!! -> ${msg}\n***`);
            return of(`${msg}: ${val}`)
          })
        ).subscribe(resut=>{
            // do something for the user 
        });
    }

  updateTournament(name:string){
    var t = new Tournament(this.activeTournamentForEditing.tournamentID,name);
    t = {} as Tournament;
    t.tournamentName = name;
    t.tournamentID = this.activeTournamentForEditing.tournamentID;

    this._ohGreatOracle.pleaseUpdateATournament(t)
        .pipe(
          tap(data => {
            console.log(`TournamentCardToolBar.updateTournament()._ohGreatOracle.pleaseUpdateATournament.tap(): Update tournament request complete`);
            this._ohGreatOracle.tournament_toolBar_onUpdate_Tournament_BroadcastUpdate(t);
          }),
          catchError( val =>{ 
            var msg:String;
            msg = "*** \nTournament Oracle CAUGHT sleeping on the job ";
            console.error(`TournamentCardToolBar.updateTournament()._ohGreatOracle.pleaseAddATournament.catchError(): !!! ERROR !!! -> ${val}\n***`);
            return of(`${msg}: ${val}`)
          })
        ).subscribe(result=>{
          console.log('subscrfiption data:', result)

        });
  }

  deleteTournament(){
    this._ohGreatOracle.pleaseDeleteTheseTournaments(this.tournamentDeleteList)
    .pipe(
      finalize(()=>{
        console.log(`Tournament Toolbar: tournamentToolBar_deleteTournamentList_sendUpdate: ${this.tournamentDeleteList}`);
        this._ohGreatOracle.tournament_toolBar_onDelete_TournamentList_BroadcastUpdate(this.tournamentDeleteList);
        this.tournamentDeleteList = [];
      })
    )
    .subscribe(o=>{
      console.log(`Tournament Toolbar: Tournament service delete result: ${o}`);
    });
  }
}