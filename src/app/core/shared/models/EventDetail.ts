import { RaceEvent } from '../models/Event';
import { EventDetailStatus } from '../models/EventDetailStatus';


export class EventDetail {
    eventDetailID:number;
    eventID:number;
    event:RaceEvent;
    eventDetailStatusID:number;
    eventDetailStatus:EventDetailStatus;
    eventDetailName:string;
    eventDetailNumber:number;
    eventDetailOdd:number;
    finishingPosition:number;
    firstTimer:boolean
}