import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { getToken } from '@angular/router/src/utils/preactivation';


@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor( private cookieService : CookieService) { }

  SetToken(token)
  {
    this.cookieService.set('chat_token' , token);
  }

  GetToken()
  {
    return this.cookieService.get('chat_token');
  }

  DeleteToken()
  {
    this.cookieService.delete('chat_token');
  }

  GetPayload()
  {
    const token = this.GetToken();
    let payLoad;
    if(token){
      payLoad = token.split('.')[1];
      payLoad = JSON.parse(window.atob(payLoad));
    }
    return payLoad.data;
  }

}
