import { HttpClient, HttpHeaders  } from '@angular/common/http';
import {ConfigService  } from './config.service';
import {Observable, of, throwError as observableThrowError, from} from 'rxjs';
import {map, tap,finalize,catchError } from 'rxjs/operators';
import {  LoggingSettings } from '../models/LoggingSettings';
import {  LoggingRules } from '../models/LoggingRules';
import {  MessageBusService } from './message-bus.service';




export abstract class BaseHttpClient extends LoggingRules{
    
    _httpOptions:any = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json'//,
          //'Authorization': token
        })
    }

    

    _configService:ConfigService;
    
    constructor(private _http:HttpClient, private _config:ConfigService, private _messageBus:MessageBusService){
        super(_config.LoggingSettings)
        this._loggingRules = _config.LoggingSettings;
        this._configService = _config;
    }

    getAll(url:string):Observable<any>{

        this._messageBus.httpRequest_InProgess_BroadcastUpdate(true);

        if(this._loggingRules.BaseHttpClient_Detele_Can_Log)
            console.log(`BaseHttpClient.getAll(${this._config.eventsUrl}) : Sending HTTP GET request...`);

        return this._http.get<any>(url, this._httpOptions)
               .pipe(
                //map((x: any) => JSON.parse(x)) ,
                tap(result => {
                    if(this._loggingRules.BaseHttpClient_Get_Can_Log)
                        console.log(`BaseHttpClient.getAll().tap() : Result -> ${JSON.stringify(result)}`);
                }),
                  finalize (()=>{
                    if(this._loggingRules.BaseHttpClient_Get_Can_Log)
                        console.log(`BaseHttpClient.getAll(${this._config.eventsUrl}).finalize() : HTTP GET request complete.`);
                    this._messageBus.httpRequest_InProgess_BroadcastUpdate(false);
                  }),
                  catchError( val =>{ 
                    var msg:String;
                    msg = "*** \nHTTP client CAUGHT sleeping on the job ";
                    console.error(`BaseHttpClient.getAll()._http.get.catchError(): CAUGHT '${url}' ERROR -> ${msg}\n***`);
                    return of(`${msg}: ${val}`)
                  })
                );
    }

    Post(url:string,data:any):Observable<any> {

        this._messageBus.httpRequest_InProgess_BroadcastUpdate(true);
  
        if(this._loggingRules.BaseHttpClient_Post_Can_Log)
            console.log(`BaseHttpClient.Post(${this._config.eventsUrl}) : Send HTTP POST with body -> ${JSON.stringify(data)}`);

        var result = this._http.post<any>(url,data, this._httpOptions)
          .pipe(
            tap((result)=>{ 
                if(this._loggingRules.BaseHttpClient_Post_Can_Log)
                    console.log(`BaseHttpClient.Post().Tap(): Result -> ` + JSON.stringify(result)); 

            }),
            finalize(()=>{
                if(this._loggingRules.BaseHttpClient_Post_Can_Log)
                    console.log(`BaseHttpClient.Post().finalize(): HTTP POST request complete.`);
                    this._messageBus.httpRequest_InProgess_BroadcastUpdate(false);
            }),
            catchError( error =>{ 
                var msg:String;
                msg = "*** \nHTTP client CAUGHT sleeping on the job ";
                console.error(`BaseHttpClient.Post()._http.Post.catchError(): CAUGHT '${url}' with ${JSON.stringify(data)} ERROR -> ${msg}\n***`);
                return of(`${msg}: ${error}`)
              })
          );
    
          return result;
      }
}