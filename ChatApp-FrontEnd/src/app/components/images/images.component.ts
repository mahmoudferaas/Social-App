import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { UsersService } from 'src/app/services/users.service';
import { TokenService } from 'src/app/services/token.service';
import io from 'socket.io-client';

const Url = 'http://localhost:3000/api/chatapp/upload-image';
@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.css']
})
export class ImagesComponent implements OnInit {

  uploader : FileUploader =new FileUploader({
    url : Url,
    disableMultipart : true
  })

  socket : any;
  selectedFile:any;
  user:any;
  images:[];

    constructor( private tokenService : TokenService,private userService : UsersService) {
    this.socket = io('http://localhost:3000');
     }

  OnFileSelected(event){
    
    const file : File = event[0];
    this.ReadAsBase64(file).then( result =>{
      this.selectedFile = result;
    }).catch( err => {
      console.log(err)
    })
  }

  
  GetUser(){
    this.userService.GetUserById(this.user._id).subscribe( data => {
      debugger
      this.images = data.result.images;
    } , err => {
        console.log(err);
    })
  }


  Upload(){
    if(this.selectedFile)
    {
      this.userService.AddImage(this.selectedFile).subscribe(data =>{
      this.socket.emit('refresh' , {});        
        const filePath = <HTMLInputElement>document.getElementById('filePath');
        filePath.value = '';
      } , err => {console.log(err)})
    }
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

  ngOnInit() {
    this.user = this.tokenService.GetPayload();
    this.GetUser();

    this.socket.on('refreshPage' , (data) => {
    this.GetUser();      
    })
  }


  SetProfileImage(image){
    this.userService.SetDefaultImage(image.imgId ,image.imgVersion).subscribe(data => {
      this.socket.emit('refresh' , {});   
    }, err => {console.log(err)})
  }

}
