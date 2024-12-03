import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})


export class ApiService {
    constructor(private http: HttpClient) {}
    private baseUrl=import.meta.env.NG_APP_END_POINT

    SendMessage(message:string,sessionId:number,endpoint:string):Observable<any> {
        const formData=new FormData()
        const header=new HttpHeaders()
   
        const body={
            "message":message,
            "session":sessionId
        }

       

        return this.http.post(`${this.baseUrl}/${endpoint}/`,body,{
           headers:header
        })


    }


    }