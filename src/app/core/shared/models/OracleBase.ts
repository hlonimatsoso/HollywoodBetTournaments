import { BehaviorSubject } from 'rxjs';
import { Constants } from './constants';

export abstract class OracleBase {

    ready$ = new BehaviorSubject(this);
    tournaments$ = new BehaviorSubject(null);
    tournamentsToDelete$ = new BehaviorSubject(null);
    currentEditingAction$ = new BehaviorSubject(Constants.toolbar_button_add_action);
    currentEditingTournament$ = new BehaviorSubject(null);
    isToolBarEnabled$ = new BehaviorSubject(false);
    
}