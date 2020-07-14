import { Component, OnInit,Input } from '@angular/core';
import { EventDetail } from '../../../shared/models/EventDetail';
import { EventDetailsOracleService } from '../event-details-oracle.service';
import { RaceEvent } from 'src/app/core/shared/models/Event';
import { EventDetailStatus } from 'src/app/core/shared/models/EventDetailStatus';
import { EventOracleService } from '../../events/event-oracle.service';



@Component({
  selector: 'app-event-details-card',
  templateUrl: './event-details-card.component.html',
  styleUrls: ['./event-details-card.component.scss']
})
export class EventDetailsCardComponent implements OnInit {

  @Input() eventDetail: EventDetail;
  @Input() isEditingEnabled:boolean;
  @Input() oracleDeleteList:EventDetail[];

  event:RaceEvent;
  status:EventDetailStatus;

  get isMarkedForDeletion(){
    const index = this._ohGreatOracle.eventDetailsToDelete.findIndex(t => t.eventDetailID == this.eventDetail.eventID);

    return index > -1;
  }
  constructor(private _ohGreatOracle:EventDetailsOracleService,
              private _ohGreatEventOracle:EventOracleService) { }

  ngOnInit(): void {
    this.event = this._ohGreatEventOracle.getEventByID(this.eventDetail.eventDetailID)
  }

  onEdit(eventArgument){
    console.log(`EventDetailsCard.onEdit(): Javascript event argument : ${JSON.stringify(eventArgument)}`);
    this._ohGreatOracle.setCurrentEditingEventDetail(this.eventDetail);
  }

  onDelete(eventArgument){
   
    console.log(`TournamentCard.onDelete(): Javascript event argument : ${JSON.stringify(eventArgument)}`);
    this._ohGreatOracle.addToEventDEtailsDeleteList(this.eventDetail);
  }

  

}
