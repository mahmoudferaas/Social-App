import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


const BASEURL = "http://localhost:3000/api/chatapp";

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http : HttpClient) { }

  GetAllUsers() : Observable<any>{
    return this.http.get(`${BASEURL}/users` );
  }

  GetUserById(id) : Observable<any>{
    return this.http.get(`${BASEURL}/user/${id}` );
  }

  GetUserByName(username) : Observable<any>{
    return this.http.get(`${BASEURL}/users/${username}` );
  }

  FollowUser( userFollowed) : Observable<any>{
    debugger;
    return this.http.post(`${BASEURL}/follow-user` ,{ userFollowed});
  }

  UnFollowUser( userFollowed) : Observable<any>{
    
    return this.http.post(`${BASEURL}/unfollow-user` ,{ userFollowed});
  }

  MarkNotification( id , isDelete?) : Observable<any>{
    
    return this.http.post(`${BASEURL}/mark/${id}` ,{ 
      id ,
      isDelete
    });
  }
  
  AddImage(image) : Observable<any>{  
    return this.http.post(`${BASEURL}/upload-image` ,{ 
      image
    });
  }

  SetDefaultImage(imageId , imageVersion) : Observable<any>{
    return this.http.get(`${BASEURL}/set-default-image/${imageId}/${imageVersion}` );
  }
  
  profileNotifactions(id) : Observable<any>{  
    return this.http.post(`${BASEURL}/user/view-profile` ,{ id});
  }

  ChangePassword(body) : Observable<any>{  
    return this.http.post(`${BASEURL}/change-password` , body);
  }

}
