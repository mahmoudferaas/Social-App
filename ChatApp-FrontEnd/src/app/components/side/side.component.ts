import { Component, OnInit } from '@angular/core';
import io from 'socket.io-client';
import { TokenService } from 'src/app/services/token.service';
import { UsersService } from 'src/app/services/users.service';


@Component({
  selector: 'app-side',
  templateUrl: './side.component.html',
  styleUrls: ['./side.component.css']
})
export class SideComponent implements OnInit {
 
  user : any;
  socket : any;
  userData : any;


  constructor( private tokenService : TokenService ,
    private userService : UsersService) { 
     this.socket = io('http://localhost:3000');
    }

  ngOnInit() {
    this.user = this.tokenService.GetPayload();
    this.GetUser();
    this.socket.on('refreshPage' , (data) => {
      this.GetUser();
    })
    
  }

  GetUser() {
    this.userService.GetUserById(this.user._id).subscribe(data =>{
      this.userData = data.result;
    } , err => {
      console.log(err);
    })
  }

}
