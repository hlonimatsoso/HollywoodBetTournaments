import { Component, OnInit,Input } from '@angular/core';
import { RaceEvent } from '../../../shared/models/Event';
import { EventOracleService } from '../event-oracle.service';



@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss']
})
export class EventCardComponent implements OnInit {

  @Input() event: RaceEvent;
  @Input() enableEditing:boolean;
  //_isEditing:boolean;

  get isMarkedForDeletion(){
    const index = this._ohGreatOracle.eventsToDelete.findIndex(t => t.eventID == this.event.eventID);

    return index > -1;
  }
  constructor(private _ohGreatOracle:EventOracleService) { }

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
    
    console.log(`EventCard.onEdit(): Editing this event -> ${JSON.stringify(this.event)}`);

    this._ohGreatOracle.event_card_onEdit_Event_BroadcastUpdate(this.event);
  }

  onDelete(eventArgument){
   
    console.log(`EventCard.onDelete(): Javascript event argument : ${JSON.stringify(eventArgument)}`);

    var id:number = eventArgument.currentTarget.attributes.getNamedItem("data-eventID").value;
    var name:string = eventArgument.currentTarget.attributes.getNamedItem("data-eventName").value;
    //var event = new RaceEvent(id,name);
    // event.eventID = id;
    // event.eventName = name;

    console.log(`EventCard.onDelete(): Marking event for deletion -> ${JSON.stringify(this.event)}`);
    this._ohGreatOracle.event_card_onDelete_Event_BroadcastUpdate(this.event);
    //this._ohGreatOracle.event_toolBar_onActionChange_BroadcastUpdate("Delete");
    //this._messageBus.eventCard_onDelete_BroadcastUpdate(event);
  }

}
