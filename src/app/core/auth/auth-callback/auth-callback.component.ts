import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../auth-service.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-auth-callback',
  templateUrl: './auth-callback.component.html',
  styleUrls: ['./auth-callback.component.scss']
})
export class AuthCallbackComponent implements OnInit {

  error: boolean;

  constructor(private authService: AuthServiceService, private router: Router, private route: ActivatedRoute) {}

  async ngOnInit() {
    console.log(`Auth Call Back started`);
    // check for error
    if (this.route.snapshot.fragment.indexOf('error') >= 0) {
       this.error=true; 
       return;    
     }

    console.log(`Auth Call Back calling authService.completeAuthentication()`);
    await this.authService.completeAuthentication(); 

    console.log(`Auth Call Back redirecting...`);
    this.router.navigate(['/']);    
  }
}
