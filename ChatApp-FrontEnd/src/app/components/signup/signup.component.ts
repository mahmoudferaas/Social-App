import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup , FormBuilder , Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { NgZone } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signupForm:FormGroup
  errorMessage : string
  flag : boolean

  constructor( private authService:AuthService , 
               private fb : FormBuilder , 
               private router:Router,
               //public zone: NgZone
              ) { }

  ngOnInit() {
    this.Init()
  }

  Init() {
    this.signupForm = this.fb.group({
      username : ['' , Validators.required],
      email : ['' , [Validators.required , Validators.email]],
      password : ['' , Validators.required],
    })
  }

  signupUser()
  {
    console.log(this.signupForm.value)
    this.authService.registerUser(this.signupForm.value).subscribe(
      data =>{
        debugger
        console.log(data);
        this.signupForm.reset();
        this.router.navigate(['streams']); 
        //this.zone.run(() => { this.router.navigate(['streams']); });
      },
      err => {
        debugger
        console.log(err);
        if(err.error.msg)
        {
          this.errorMessage = err.error.msg[0].message
        }

        if(err.error.message)
        {
          this.errorMessage = err.error.message;
        }
      }
    );
  }
}
