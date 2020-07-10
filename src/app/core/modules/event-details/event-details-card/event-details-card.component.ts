import { Component, OnInit,Input } from '@angular/core';
import { EventDetail } from '../../../shared/models/EventDetail';
import { EventDetailsOracleService } from '../event-details-oracle.service';



@Component({
  selector: 'app-event-details-card',
  templateUrl: './event-details-card.component.html',
  styleUrls: ['./event-details-card.component.scss']
})
export class EventDetailsCardComponent implements OnInit {

  @Input() eventDetails: EventDetail;
  @Input() enableEditing:boolean;
  //_isEditing:boolean;

  

  get isMarkedForDeletion(){
    const index = this._ohGreatOracle.eventDetailsToDelete.findIndex(t => t.eventID == this.eventDetails.eventID);

    return index > -1;
  }
  constructor(private _ohGreatOracle:EventDetailsOracleService) { }

  ngOnInit(): void {
  }

  onEdit(eventArgument){
    
    console.log(`EventCard.onEdit(): Javascript event argument : ${JSON.stringify(eventArgument)}`);
   
    // var id:number = eventArgument.currentTarget.attributes.getNamedItem("data-eventID").value;
    // var name:string = eventArgument.currentTarget.attributes.getNamedItem("data-eventName").value;
    // var previouseEvent = new Event(id,name);

    // console.log(`EventCard.onEdit(): Editing this Event : ${JSON.stringify(previouseEvent)}`);
    
    // this.event.eventID = id;
    // this.event.eventName = name;
    // var event = new Event(this.event.eventID,this.event.eventName);
    
    console.log(`EventCard.onEdit(): Editing this event -> ${JSON.stringify(this.eventDetails)}`);

    this._ohGreatOracle.event_details_card_onEdit_Event_BroadcastUpdate(this.eventDetails);
  }

  onDelete(eventArgument){
   
    console.log(`EventCard.onDelete(): Javascript event argument : ${JSON.stringify(eventArgument)}`);

    var id:number = eventArgument.currentTarget.attributes.getNamedItem("data-eventID").value;
    var name:string = eventArgument.currentTarget.attributes.getNamedItem("data-eventName").value;
    //var event = new EventDetail(id,name);
    // event.eventID = id;
    // event.eventName = name;

    console.log(`EventCard.onDelete(): Marking event for deletion -> ${JSON.stringify(this.eventDetails)}`);
    this._ohGreatOracle.event_deatils_card_onDelete_Event_BroadcastUpdate(this.eventDetails);
    //this._ohGreatOracle.event_toolBar_onActionChange_BroadcastUpdate("Delete");
    //this._messageBus.eventCard_onDelete_BroadcastUpdate(event);
  }

}
