import {  LoggingSettings } from '../models/LoggingSettings';
import {ConfigService  } from '../services/config.service';


export abstract class LoggingRules{
    
    _loggingRules:LoggingSettings;

    constructor(settings:LoggingSettings){
        this._loggingRules = settings;
    }
}