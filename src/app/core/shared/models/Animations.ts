import { AnimationProperties } from './AnimationsProperties';
import { trigger, state, style, transition, animate } from '@angular/animations';

export class Animations {

    constructor() { }
  
    public static fadeAnimation(properties:AnimationProperties):any{
      return trigger('YingYang',[
        state('on',style({
          opacity:1,
          height: "100%"
        })),
        state('off',style({
          opacity:0,
          height: 0
        })),
        transition('off => on',animate('1.5s ease-in' , style({ height: "100%" , opacity: 1 }))),
        transition('on => off',animate('1s ease-out' , style({ height: 0, opacity: 0 })))
  
      ]);
    }

    public static InOutAnimation(properties:AnimationProperties):any{
      return trigger(
        'inOutAnimation', 
        [
          transition(
            ':enter', 
            [
              style({ height: 0, opacity: 0 }),
              animate('2s ease-out', 
                      style({ height: '100%', opacity: 1 }))
            ]
          ),
          transition(
            ':leave', 
            [
              style({ height: '100%', opacity: 1 }),
              animate('1.5s ease-out', 
                      style({ height: 0, opacity: 0 }))
            ]
          )
        ]
      );
    }
  }