import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { TokenService } from 'src/app/services/token.service';
import _ from 'lodash';
import io from 'socket.io-client';


@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css']
})
export class PeopleComponent implements OnInit {
  socket : any;
  users = [];
  userArr = [];
  loggedUser : any;
  constructor( private userService : UsersService , private tokenservice : TokenService) {
    this.socket = io('http://localhost:3000');
   }

  ngOnInit() {
    //debugger
    this.loggedUser = this.tokenservice.GetPayload();
    this.GetAllUsers();
    this.GetUserById();

    this.socket.on('refreshPage' , (data) => {
      this.GetAllUsers();
    this.GetUserById();
    })
  }

  GetAllUsers(){
    this.userService.GetAllUsers().subscribe(data =>{
      _.remove(data.result , { username : this.loggedUser.username});
      this.users = data.result;
    })
  }

  GetUserById(){
    //debugger
    this.userService.GetUserById(this.tokenservice.GetPayload()._id).subscribe(data =>{
      this.userArr = data.result.following; 
      //console.log(data);     
    })
  }

  FollowUser(user){
    this.userService.FollowUser(user._id).subscribe(data => {
      this.socket.emit('refresh' , {});
      
    })
  }

  CheckInArray(arr , id){
    const res = _.find(arr , ['userFollowed._id' , id]);
    if(res){
      return true;
    }
    else{
      return false;
    }
  }

}
