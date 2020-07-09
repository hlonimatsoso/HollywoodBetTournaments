import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Tournament } from '../models/Tournament';



@Injectable({
  providedIn: 'root'
})
export class MessageBusService {

  /*
    Message Bus offers event based subscription services for the following :

      HttpClient.isInProgress()
      TournamentCard.onEdit()
      TournamentCard.onDeleta() 
  */
  constructor() { }

  private _httpRequest_InProgess = new Subject<boolean>();
  private _tournamentCard_onEdit = new Subject<Tournament>();
  private _tournamentCard_onDelete = new Subject<Tournament>();



  get httpRequest_InProgess$(): Observable<boolean> {
    return this._httpRequest_InProgess.asObservable();
  }
  get tournamentCard_onEdit$(): Observable<Tournament> {
    return this._tournamentCard_onEdit.asObservable();
  }
  get tournamentCard_onDelete$(): Observable<Tournament> {
    return this._tournamentCard_onDelete.asObservable();
  }


  public httpRequest_InProgess_BroadcastUpdate(isEnabled:boolean) {
    this._httpRequest_InProgess.next(isEnabled);
  }  
  public tournamentCard_onEdit_BroadcastUpdate(tournament:Tournament) {
    this._tournamentCard_onEdit.next(tournament);
    console.log(`MessageBus.tournamentCard_onEdit_BroadcastUpdate(): Broadcasting -> ${JSON.stringify(tournament)}`);
  }
  public tournamentCard_onDelete_BroadcastUpdate(tournament:Tournament) {
    this._tournamentCard_onDelete.next(tournament);
    console.log(`MessageBus.tournamentCard_onDelete_BroadcastUpdate(): Broadcasting -> ${JSON.stringify(tournament)}`);
  }

}
