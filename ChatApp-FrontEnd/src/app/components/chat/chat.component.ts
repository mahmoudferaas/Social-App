import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewInit  {
  toolBarElemet : any;
  constructor() { }

  ngOnInit() {
    this.toolBarElemet = document.querySelector('.nav-content');
  }
  
  ngAfterViewInit(){
    this.toolBarElemet.style.display = 'none';
  }
}
