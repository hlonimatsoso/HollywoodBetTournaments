import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { Tournament } from '../models/Tournament';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarPopUpComponent } from '../components/snack-bar-pop-up/snack-bar-pop-up.component';



@Injectable({
  providedIn: 'root'
})
export class MessageBusService {

  /*
    Message Bus offers event based subscription services for the following :

      HttpClient.isInProgress()
      TournamentCard.onEdit()
      TournamentCard.onDelete() 
  */
  constructor(private _snackBar: MatSnackBar) { }

  private _httpRequest_InProgess = new Subject<boolean>();
  private _tournamentCard_onEdit = new Subject<Tournament>();
  private _tournamentCard_onDelete = new Subject<Tournament>();
  private httpRequest_Error$ = new BehaviorSubject<boolean>(false);



  get httpRequest_InProgess$(): Observable<boolean> {
    return this._httpRequest_InProgess.asObservable();
  }
  get tournamentCard_onEdit$(): Observable<Tournament> {
    return this._tournamentCard_onEdit.asObservable();
  }
  get tournamentCard_onDelete$(): Observable<Tournament> {
    return this._tournamentCard_onDelete.asObservable();
  }

  public raiseErrorSnack(msg:string, action:string){
    this._snackBar.open(msg, action, {
        duration: 5000,
      });
    // this._snackBar.openFromComponent(SnackBarPopUpComponent, {
    //   duration: 4 * 1000,
    // });
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
