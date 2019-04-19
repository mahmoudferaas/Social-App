import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toolar',
  templateUrl: './toolar.component.html',
  styleUrls: ['./toolar.component.css']
})
export class ToolarComponent implements OnInit {

  user :any;
  constructor(
    private tokenService : TokenService,
    private router : Router 
  ) { }

  ngOnInit() {
    this.user = this.tokenService.GetPayload();
    
  }

  LogOut(){
    this.tokenService.DeleteToken();
    this.router.navigate(['']);
  }

}
