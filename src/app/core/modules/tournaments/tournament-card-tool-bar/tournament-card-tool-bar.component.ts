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


@Component({
  selector: 'app-tournament-card-tool-bar',
  templateUrl: './tournament-card-tool-bar.component.html',
  styleUrls: ['./tournament-card-tool-bar.component.scss'],
  animations:[
    Animations.fadeAnimation(null)
  ]
})
export class TournamentCardToolBarComponent implements OnInit {

  @Input() public enableEditing:boolean;
  @ViewChild("name") nameField: ElementRef

  action:string;
  _activeTournamentForEditing:Tournament;
  _tournamentName: FormControl;

  public tournamentDeleteList:Tournament[];

  constructor(private _ohGreatOracle:TournamentOracleService,private _config:ConfigService) { }

  ngOnInit(): void {
    this.tournamentDeleteList = [];
    this._tournamentName = new FormControl('', [Validators.required]);
    this._ohGreatOracle.ready$.subscribe(oracle => {
      oracle.tournamentsToDelete$.subscribe(deleteList => {
        this.tournamentDeleteList = deleteList;
      });
      oracle.currentEditingAction$.subscribe(action => {
        this.action = action;
        if(action == "Add")
        this._tournamentName.setValue("");
      });
      oracle.currentEditingTournament$.subscribe(tournment => {
        if(tournment){
          this._activeTournamentForEditing = tournment;
          this._tournamentName.setValue(this._activeTournamentForEditing.tournamentName);
        }
      });
      oracle.isToolBarEnabled$.subscribe(flag => {
        debugger;
        this.enableEditing = flag;
      });
    });
    
    // this._ohGreatOracle.tournament_card_on_edit_Tournament$.subscribe((tournament)=>{
    //   this._activeTournamentForEditing = tournament;
    //   this._tournamentName.setValue(this._activeTournamentForEditing.tournamentName);
    //   this.onActionChange({"value":"Edit"});
    // });

    // this._ohGreatOracle.tournament_card_onDelete_Tournament$.subscribe((tournament)=>{
    //   this._activeTournamentForEditing = tournament;
    //   this.tournamentDeleteList.push(tournament);
    //   this.onActionChange({"value":"Delete"});
    // });
  }


  onActionChange(event:any){
    debugger;

    this._ohGreatOracle.onCurrentActionChange(event.value);
  }

  onEnableToolBarEditingOptionsChanged(event:boolean)
  {
    this._ohGreatOracle.onToolBarToggleChange(event);
    // console.log(`TournamentCardToolBar.onEnableToolBarEditingOptionsChanged() : Event -> ${event}`);
    // console.log(`TournamentCardToolBar.onEnableToolBarEditingOptionsChanged() : Broadcasting event via The Great Oracle`);

    // this.enableEditing = event;
    // this._ohGreatOracle.tournament_ToolBar_onEnableToolBarEditingOptions_Change_BroadcastUpdate(event)

    // console.log(`TournamentCardToolBar.onEnableToolBarEditingOptionsChanged() : Change action to 'Add' as the default`);
    //this.onActionChange({"value":"Add"});
  }

  getErrorMessage() {
    if (this._tournamentName.hasError('required')) {
      return 'Enter a valid tournament name';
    }
  }

  get getToggleNameState(){
    return this.enableEditing && this.action!="Delete" ? "on":"off";
  }

  get selectedBUttonText(){
    return `${this.action} Tournament`;
  }

  remove(t: Tournament): void {
    //var index = this.tournamentDeleteList.indexOf(t);

    // if (index >= 0) {
    //   this.tournamentDeleteList.splice(index, 1);
    // }

    var list = this._ohGreatOracle.tournamentsToDelete$.getValue();

    var index = list.indexOf(t);
 
    if (index >= 0) {
      list.splice(index, 1);
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

    this._ohGreatOracle.pleaseAddATournament(t);
        // .pipe(
        //   tap(result=>{
        //     if(this._config.LoggingSettings.Tournament_ToolBar_Can_Log)
        //       console.log(`TournamentCardToolBar.addTournament()._ohGreatOracle.pleaseAddATournament.tap(): Result -> ${JSON.stringify(result)}`);
        //   }),
        //   finalize(()=>{
        //     if(this._config.LoggingSettings.Tournament_ToolBar_Can_Log)
        //       console.log(`TournamentCardToolBar.GetAllTournaments()._ohGreatOracle.pleaseAddATournament.finalize(): Add tournament request complete`);
        //   }),
        //   catchError( val =>{ 
        //     var msg:String;
        //     msg = "*** \nTournament Oracle CAUGHT sleeping on the job ";
        //     console.error(`TournamentCardToolBar.GetAllTournaments()._ohGreatOracle.pleaseAddATournament.catchError(): !!! ERROR !!! -> ${msg}\n***`);
        //     return of(`${msg}: ${val}`)
        //   })
        // ).subscribe(resut=>{
        //     // Hey Oracle, I don't care for the result, deal with it yourself.
        // });
    }

  updateTournament(name:string){
    var t = new Tournament(this._activeTournamentForEditing.tournamentID,name);
    t = {} as Tournament;
    t.tournamentName = name;
    t.tournamentID = this._activeTournamentForEditing.tournamentID;

    this._ohGreatOracle.pleaseUpdateATournament(t);
        // .pipe(
        //   tap(data => {
        //     console.log(`TournamentCardToolBar.updateTournament()._ohGreatOracle.pleaseUpdateATournament.tap(): Update tournament request complete`);
        //     this._ohGreatOracle.tournament_toolBar_onUpdate_Tournament_BroadcastUpdate(t);
        //   }),
        //   catchError( val =>{ 
        //     var msg:String;
        //     msg = "*** \nTournament Oracle CAUGHT sleeping on the job ";
        //     console.error(`TournamentCardToolBar.updateTournament()._ohGreatOracle.pleaseAddATournament.catchError(): !!! ERROR !!! -> ${val}\n***`);
        //     return of(`${msg}: ${val}`)
        //   })
        // ).subscribe(result=>{
        //   console.log('subscrfiption data:', result)

        // });
  }

  deleteTournament(){
    this._ohGreatOracle.pleaseDeleteTheseTournaments(this.tournamentDeleteList);
    // .pipe(
    //   finalize(()=>{
    //     console.log(`Tournament Toolbar: tournamentToolBar_deleteTournamentList_sendUpdate: ${this.tournamentDeleteList}`);
    //     this._ohGreatOracle.tournament_toolBar_onDelete_TournamentList_BroadcastUpdate(this.tournamentDeleteList);
    //     this.tournamentDeleteList = [];
    //   })
    // )
    // .subscribe(o=>{
    //   console.log(`Tournament Toolbar: Tournament service delete result: ${o}`);
    // });
  }
}