import { Injectable } from '@angular/core';
import { LoginDTO } from 'src/models/loginDTO';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { API_CONFIG } from "../../config/api.config";
import { map, catchError} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  login(loginDTO: LoginDTO) : Observable<any> {

    return this.http.post<any>( API_CONFIG.baseURL+'/login'
                              , loginDTO
                              , { observe: 'response' });

  }
}
