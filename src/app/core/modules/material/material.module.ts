import { NgModule } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatChipsModule} from '@angular/material/chips';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSelectModule} from '@angular/material/select';


@NgModule({
  imports: [
    MatButtonModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatCardModule,
    MatButtonToggleModule,
    MatInputModule,
    MatFormFieldModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    MatSelectModule
    
  ],
  exports:[
    MatButtonModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatCardModule,
    MatButtonToggleModule,
    MatInputModule,
    MatFormFieldModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    MatSelectModule
  ]
})
export class MaterialModule { }
