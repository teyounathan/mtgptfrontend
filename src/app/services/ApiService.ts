import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})


export class ApiService {
    constructor(private http: HttpClient) {}
    private baseUrl=import.meta.env.NG_APP_END_POINT
    private chatRoute=import.meta.env.NG_APP_CHAT_ROUTE
    

    SendMessage(message:string,sessionId:number):Observable<any> {
        const formData=new FormData()
        const header=new HttpHeaders()
   
        const body={
            "message":message,
            "session":sessionId
        }

       console.log(this.baseUrl)

        return this.http.post(`${this.baseUrl}/${this.chatRoute}/`,{"message":message,
            "session":sessionId},{
           headers:header
        })


    }


    }