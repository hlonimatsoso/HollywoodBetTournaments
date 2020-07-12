import { Injectable } from '@angular/core';
import {trigger,state,transition,style,animate} from '@angular/animations'
import { AnimationProperties } from '../models/AnimationsProperties';


@Injectable({
  providedIn: 'root'
})
export class AnimationsService {

  constructor() { }

  public static fadeAnimation(properties:AnimationProperties):any{
    return trigger('toggleNameState',[
      state('on',style({
        opacity:1
      })),
      state('off',style({
        opacity:0
      })),
      transition('off => on',animate('500ms ease-in')),
      transition('on => off',animate('500ms ease-out'))

    ]);
  }
}
