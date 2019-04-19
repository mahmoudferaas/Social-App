import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import { UsersService } from 'src/app/services/users.service';
import io from 'socket.io-client';

@Component({
  selector: 'app-following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.css']
})
export class FollowingComponent implements OnInit {
  socket : any;
  following = [];
  user : any;

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
      this.following = data.result.following;
    })
  }

  UnFollow(user){
    this.userService.UnFollowUser(user._id).subscribe(data =>{
      this.socket.emit('refresh' , {});
    })
  }

}
