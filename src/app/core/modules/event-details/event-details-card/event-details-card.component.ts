import { Component, OnInit,Input } from '@angular/core';
import { EventDetail } from '../../../shared/models/EventDetail';
import { EventDetailsOracleService } from '../event-details-oracle.service';
import { RaceEvent } from 'src/app/core/shared/models/Event';
import { EventDetailStatus } from 'src/app/core/shared/models/EventDetailStatus';
import { EventOracleService } from '../../events/event-oracle.service';
import { TheOracleService } from 'src/app/core/shared/services/the-oracle.service';
import { Animations } from 'src/app/core/shared/models/Animations';



@Component({
  selector: 'app-event-details-card',
  templateUrl: './event-details-card.component.html',
  styleUrls: ['./event-details-card.component.scss'],
  animations:[
    Animations.fadeAnimation(null)
   ]
})
export class EventDetailsCardComponent implements OnInit {

  @Input() eventDetail: EventDetail;
  @Input() isEditingEnabled:boolean;
  @Input() oracleDeleteList:EventDetail[];

  event:RaceEvent;
  status:EventDetailStatus;
  canDelete:boolean;

  get isMarkedForDeletion(){
    const index = this._theOracle.eventDetailsOracle.eventDetailsToDelete.findIndex(t => t.eventDetailID == this.eventDetail.eventID);

    return index > -1;
  }
  constructor(private _theOracle:TheOracleService) {
    this.canDelete = this._theOracle.authService.canDelete("horses");

   }

  ngOnInit(): void {
    this.event = this._theOracle.eventOracle.getEventByID(this.eventDetail.eventID)

    // this._theOracle.eventOracle.ready$.subscribe(orcale => {
    //   this.event = orcale.getEventByID(this.eventDetail.eventDetailID)
    // });

    this.status = this._theOracle.eventDetailsOracle
                      .eventDetailStatuses$.getValue()
                      .find(x => x.eventDetailStatusID == this.eventDetail.eventDetailStatusID);

  }

  onEdit(eventArgument){
    console.log(`EventDetailsCard.onEdit(): Javascript event argument : ${JSON.stringify(eventArgument)}`);
    this._theOracle.eventDetailsOracle.setCurrentEditingEventDetail(this.eventDetail);
  }

  onDelete(eventArgument){
   
    console.log(`TournamentCard.onDelete(): Javascript event argument : ${JSON.stringify(eventArgument)}`);
    this._theOracle.eventDetailsOracle.addToEventDEtailsDeleteList(this.eventDetail);
  }

  get getYingYangState(){

    return this.isEditingEnabled ? "on":"off";

  }

}
