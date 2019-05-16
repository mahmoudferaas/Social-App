import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import { Router } from '@angular/router';
import * as M from 'materialize-css';
import { UsersService } from 'src/app/services/users.service';
import io from 'socket.io-client';

@Component({
  selector: 'app-toolar',
  templateUrl: './toolar.component.html',
  styleUrls: ['./toolar.component.css']
})
export class ToolarComponent implements OnInit {

  user :any;
  ImageID :any;
  ImgVersion :any;
  socket : any;

  constructor(
    private tokenService : TokenService,
    private userService : UsersService,
    private router : Router 
  ) { 
    this.socket = io('http://localhost:3000');

  }

  ngOnInit() {
    this.user = this.tokenService.GetPayload();
    var elems = document.querySelectorAll('.dropdown-trigger');
    M.Dropdown.init(elems, {
      alignment :'right',
      hover : true,
      coverTrigger : false
    });

    this.GetUser();

    this.socket.on('refreshPage' , (data) => {
      this.GetUser();      
      })
  }

  LogOut(){
    this.tokenService.DeleteToken();
    this.router.navigate(['']);
  }

  GetUser(){
    this.userService.GetUserById(this.user._id).subscribe( data => {
      //debugger
      this.ImageID = data.result.picId,
      this.ImgVersion = data.result.picVersion
    } , err => {
      if(err.error.token === null){
        this.router.navigate[''];
      }
    })
  }

}
