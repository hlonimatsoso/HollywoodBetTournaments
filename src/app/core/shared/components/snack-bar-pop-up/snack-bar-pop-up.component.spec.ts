import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnackBarPopUpComponent } from './snack-bar-pop-up.component';

describe('SnackBarPopUpComponent', () => {
  let component: SnackBarPopUpComponent;
  let fixture: ComponentFixture<SnackBarPopUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SnackBarPopUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnackBarPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
