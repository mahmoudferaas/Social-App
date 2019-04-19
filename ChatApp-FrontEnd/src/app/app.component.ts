import { Component, OnInit } from '@angular/core';
import { TokenService } from './services/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'CHATAPP';
  constructor( private tokenService : TokenService,
    private router : Router ) { }

    ngOnInit() {
      const token = this.tokenService.GetToken();
      if(token)
      {
        this.router.navigate(['streams'])
      }
      else {
        this.router.navigate(['']);
      }
    }
   
}
