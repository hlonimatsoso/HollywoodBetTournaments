import { BehaviorSubject } from 'rxjs';
import { Constants } from './constants';

export abstract class OracleBase {
    isToolBarEnabled$ = new BehaviorSubject(false);
    deleteList$ = new BehaviorSubject(null);
    editingAction$ = new BehaviorSubject(Constants.toolbar_button_add_action);
 
}