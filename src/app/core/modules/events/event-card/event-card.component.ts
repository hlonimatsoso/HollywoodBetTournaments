import { Component, OnInit,Input } from '@angular/core';
import { RaceEvent } from '../../../shared/models/Event';
import { Tournament } from 'src/app/core/shared/models/Tournament';
import { EventDetail } from 'src/app/core/shared/models/EventDetail';
import { TheOracleService } from 'src/app/core/shared/services/the-oracle.service';
import { BehaviorSubject } from 'rxjs';



@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss']
})
export class EventCardComponent implements OnInit {

  @Input() event: RaceEvent;
  @Input() isEditingEnabled:boolean;
  @Input() oracleDeleteList:RaceEvent[];

  horses:EventDetail[];
  horses$:BehaviorSubject<EventDetail[]> = new BehaviorSubject(null);
  horseCount$:BehaviorSubject<number> = new BehaviorSubject(0);


  tournament:Tournament;

  get isMarkedForDeletion(){
    if(!this.oracleDeleteList)
      return false;
    const index = this.oracleDeleteList.findIndex(t => t.eventID == this.event.eventID);

    return index > -1;
  }
  constructor(private _oracle:TheOracleService) {
    this.oracleDeleteList = [];
   }

  ngOnInit(): void {
    this.tournament = this._oracle.tournamentOracle.getTournamentByID(this.event.tournamentID);
    //this.horses = this._oracle.eventOracle.getHorsesForEventID(this.event.eventID);
    this._oracle.eventDetailsOracle.ready$.subscribe(oracle => {
      oracle.eventDetails$.subscribe(list => {
        if(!list)
          return null;
          
        var filteredList = list.filter( x => x.eventID == this.event.eventID)
        this.horses$.next(filteredList);
        this.horseCount$.next(filteredList.length);
      });
    });
    this.horses$.subscribe(list => {
      this.horses = list;
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

}
