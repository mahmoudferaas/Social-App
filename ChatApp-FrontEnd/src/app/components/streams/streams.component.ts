import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import { Router } from '@angular/router';
import * as M from 'materialize-css';


@Component({
  selector: 'app-streams',
  templateUrl: './streams.component.html',
  styleUrls: ['./streams.component.css']
})
export class StreamsComponent implements OnInit {

  token : any;
  StreamTab = true;
  TopStreamTab = false;

  constructor( private tokenService : TokenService,
    private router : Router ) { }

  ngOnInit() {
    this.token = this.tokenService.GetPayload();
    const tabs = document.querySelector('.tabs');
    M.Tabs.init(tabs , {});
  }

  ChangeTab(value){
    if(value === 'streams')
    {
      this.StreamTab = true;
      this.TopStreamTab = false;
    }

    if(value === 'top')
    {
      this.StreamTab = false;
      this.TopStreamTab = true;
    }
  }



}
