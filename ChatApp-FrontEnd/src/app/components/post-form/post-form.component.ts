import { Component, OnInit } from '@angular/core';
import { FormGroup , FormBuilder , Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PostService } from 'src/app/services/post.service';
import io from 'socket.io-client';
import { FileUploader } from 'ng2-file-upload';

const Url = 'http://localhost:3000/api/chatapp/upload-image';


@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.css']
})
export class PostFormComponent implements OnInit {

  socket : any;
  postForm:FormGroup;

  uploader : FileUploader =new FileUploader({
    url : Url,
    disableMultipart : true
  })
  selectedFile:any;

  constructor(
               private fb : FormBuilder , 
               private router:Router,
               private postService : PostService
              ) {
                this.socket = io('http://localhost:3000');
               }

  ngOnInit() {
    this.Init();
  }

  Init() {
    this.postForm = this.fb.group({
      post : ['' , Validators.required]
    })
  }

  OnFileSelected(event){
    
    const file : File = event[0];
    this.ReadAsBase64(file).then( result =>{
      this.selectedFile = result;
    }).catch( err => {
      console.log(err)
    })
  }

  ReadAsBase64(file) : Promise<any>{
    const reader = new FileReader();
    const fileValue = new Promise( (resolve , reject) =>{
      reader.addEventListener('load' , () =>{
        
        resolve(reader.result);
      })

      reader.addEventListener('error' , (event) =>{
        reject(event);
      })

      reader.readAsDataURL(file); 
    })

    return fileValue;
  }


  submitPost(){
    debugger
    let body;
    if(!this.selectedFile){
      body = {
        post : this.postForm.value.post
      }
    }
    else{
      body = {
        post : this.postForm.value.post,
        image : this.selectedFile
      }
    }
    this.postService.addPost(body).subscribe(data =>{
      this.socket.emit('refresh' , {data : "this is an event"});
      this.postForm.reset();
    })
  }

}
