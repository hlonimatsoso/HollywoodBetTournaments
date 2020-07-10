import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators'
import { AuthServiceService } from '../../auth/auth-service.service';
import { UserRegistration }    from '../../shared/models/UserRegistration';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  success: boolean;
  error: string;
  userRegistration: UserRegistration = { name: '', email: '', password: '', role: ''};
  submitted: boolean = false;

  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required, Validators.minLength(5)]);


  constructor(private authService: AuthServiceService, private spinner: NgxSpinnerService) {
   
  }

  ngOnInit() {
  }


 get getEmailValidationMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
  }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  onSubmit() { 

    this.spinner.show();
debugger;
    this.authService.register(this.userRegistration)
      .pipe(finalize(() => {
        this.spinner.hide();
      }))  
      .subscribe(
      result => {         
         if(result) {
           this.success = true;
         }
      },
      error => {
        this.error = error;       
      });
  }
}
