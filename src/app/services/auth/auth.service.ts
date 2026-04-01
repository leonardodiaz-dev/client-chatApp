import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FormUser } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://127.0.0.1:8000/api'

  private _httpCliente = inject(HttpClient)
 
  public registerUser(formUser:FormUser):Observable<FormUser>{
    return this._httpCliente.post<FormUser>(`${this.baseUrl}/register`,formUser)
  }
  public login():Observable<any>{
    return this._httpCliente.post<any>(`${this.baseUrl}/login`);
  }
}
