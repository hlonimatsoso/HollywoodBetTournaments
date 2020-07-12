import { AnimationProperties } from './AnimationsProperties';
import { trigger, state, style, transition, animate } from '@angular/animations';

export class Animations {

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