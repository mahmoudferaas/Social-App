import { Component, OnInit } from '@angular/core';
import * as M from 'materialize-css';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import * as moment from 'moment';


@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.css']
})
export class ViewUserComponent implements OnInit {
  toolBarElemet : any;
  postsTab = false;
  followingTab = false;
  followersTab = false;
  posts = [];
  followers = [];
  following = [];
  user : any;
  name : any;

  constructor( private route : ActivatedRoute , private userService : UsersService) { }

  ngOnInit() {
    this.postsTab = true;
    this.toolBarElemet = document.querySelector('.nav-content');
    const tabs = document.querySelector('.tabs');
    M.Tabs.init(tabs , {});

    this.route.params.subscribe(p=>{
      this.name = p.name;
      this.GetUserByName(this.name);
    })
  }

  GetUserByName(name){
    this.userService.GetUserByName(name).subscribe( data =>{
      this.user = data.result;
      this.posts = data.result.posts.reverse();
      this.followers = data.result.followers;
      this.following = data.result.following;
    } , err => console.log(err))
  }

  ngAfterViewInit(){
    this.toolBarElemet.style.display = 'none';
  }

  ChangeTab(value){
    if(value === 'Posts')
    {
      this.postsTab = true;
      this.followingTab = false;
      this.followersTab = false;
    }
      
    else if(value === 'Following')
    {
      this.postsTab = false;
      this.followingTab = true;
      this.followersTab = false;
    }
    else if(value === 'Followers')
    {
      this.postsTab = false;
      this.followingTab = false;
      this.followersTab = true;
    }
  }

  TimeFormNow(time){
    return moment(time).fromNow();
  }

}
