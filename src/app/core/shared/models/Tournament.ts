export class Tournament{
    tournamentID:number;
    tournamentName:string;
    
    constructor(_tournamentID:number, _tournamentName:string){
        this.tournamentID = _tournamentID;
        this.tournamentName = _tournamentName;
    }
}