import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup , FormBuilder , Validators } from '@angular/forms';
import { PostService } from 'src/app/services/post.service';
import { ActivatedRoute } from '@angular/router';
import io from 'socket.io-client';
import * as moment from'moment';


@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit , AfterViewInit {

  postId : any;
  post : any;
  toolBarElemet : any;
  commentForm:FormGroup;
  commentsArray =[];
  socket : any;

  constructor(private fb : FormBuilder,
              private postService : PostService,
              private route : ActivatedRoute) { 
                this.socket = io('http://localhost:3000');
              }

  ngOnInit() {

    this.Init();
    this.postId = this.route.snapshot.paramMap.get('id');
    this.toolBarElemet = document.querySelector('.nav-content');
    this.GetPost();
    this.socket.on('refreshPage' , data => {
      this.GetPost();
    })
  }

  Init() {
    this.commentForm = this.fb.group({
      comment : ['' , Validators.required]
    })
  }

  ngAfterViewInit(){
    this.toolBarElemet.style.display = 'none';
  }

  AddComment(){
    console.log(this.commentForm.value)
    this.postService.addComments( this.postId , this.commentForm.value.comment).subscribe(data =>{
      this.socket.emit('refresh' , {});
      this.commentForm.reset();
    });
  }

  GetPost(){
    this.postService.getPost(this.postId).subscribe(data => {
      this.post = data.post.post;
      this.commentsArray = data.post.comments.reverse();
    })
  }

  TimeFormNow(time){
    return moment(time).fromNow();
  }

}
