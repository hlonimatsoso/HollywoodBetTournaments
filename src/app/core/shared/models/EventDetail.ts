import { RaceEvent } from '../models/Event';
import { EventDetailStatus } from '../models/EventDetailStatus';


export class EventDetail {
    eventDetailID:Number;
    eventID:Number;
    event:RaceEvent;
    eventDetailStatusID:Number;
    eventDetailStatus:EventDetailStatus;
    eventDetailName:string;
    eventDetailNumber:Number;
    eventDetailOdd:Number;
    finishingPosition:Number;
    firstTimer:boolean
}