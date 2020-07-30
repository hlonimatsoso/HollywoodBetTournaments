import { Component, OnInit,Input } from '@angular/core';
import { RaceEvent } from '../../../shared/models/Event';
import { Tournament } from 'src/app/core/shared/models/Tournament';
import { EventDetail } from 'src/app/core/shared/models/EventDetail';
import { TheOracleService } from 'src/app/core/shared/services/the-oracle.service';
import { BehaviorSubject } from 'rxjs';
import { Animations } from 'src/app/core/shared/models/Animations';



@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss'],
  animations:[
    Animations.fadeAnimation(null)
  ]
})
export class EventCardComponent implements OnInit {

  @Input() event: RaceEvent;
  @Input() isEditingEnabled:boolean;
  @Input() oracleDeleteList:RaceEvent[];

  horses:EventDetail[];
  horses$:BehaviorSubject<EventDetail[]> = new BehaviorSubject(null);
  horseCount$:BehaviorSubject<number> = new BehaviorSubject(0);
  canDelete:boolean;


  tournament:Tournament;

  get isMarkedForDeletion(){
    if(!this.oracleDeleteList)
      return false;
    const index = this.oracleDeleteList.findIndex(t => t.eventID == this.event.eventID);

    return index > -1;
  }
  constructor(private _oracle:TheOracleService) {
    this.oracleDeleteList = [];
    this.canDelete = this._oracle.authService.canDelete("events");
debugger;
  }

  ngOnInit(): void {
    
    this._oracle.eventDetailsOracle.eventDetails$.subscribe(horses => {
      if(!horses)
        return null;
      
      var filteredList = horses.filter( x => x.eventID == this.event.eventID)

      this.horses$.next(filteredList);
      this.horseCount$.next(filteredList.length);
    });


    this._oracle.eventOracle.events$.subscribe(e => {

      var temp = e.find(event =>  event.eventID == this.event.eventID);
      this.tournament = this._oracle.tournamentOracle.getTournamentByID(temp.tournamentID);

    });

  }

  onEdit(eventArgument){
    
    console.log(`EventCard.onEdit(): Javascript event argument : ${JSON.stringify(eventArgument)}`);
    this._oracle.eventOracle.setCurrentEditingEvent(this.event);
  }

  onDelete(eventArgument){
    console.log(`EventCard.onDelete(): Javascript event argument : ${JSON.stringify(eventArgument)}`);
    this._oracle.eventOracle.addToEventDeleteList(this.event);
  }

  get getYingYangState(){

    return this.isEditingEnabled ? "on":"off";

  }

}
