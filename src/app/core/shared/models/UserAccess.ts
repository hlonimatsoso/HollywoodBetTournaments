export class UserAccess{
    constructor(_tournaments_read = false,
                _tournaments_write = false,
                _tournaments_delete = false,
                _events_read = false,
                _events_write = false,
                _events_delete = false,
                _horses_read = false,
                _horses_write = false,
                _horses_delete = false,){
        this.tournaments_read = _tournaments_read;
        this.tournaments_write = _tournaments_write;
        this.tournaments_delete = _tournaments_delete;

        this.events_read = _tournaments_read;
        this.events_write = _tournaments_write;
        this.events_delete = _tournaments_delete;

        this.horses_read = _tournaments_read;
        this.horses_write = _tournaments_write;
        this.horses_delete = _tournaments_delete;
    }
    tournaments_read:boolean;
    tournaments_write:boolean;
    tournaments_delete:boolean;  
    
    events_read:boolean;
    events_write:boolean;
    events_delete:boolean;  

    horses_read:boolean;
    horses_write:boolean;
    horses_delete:boolean;  
}