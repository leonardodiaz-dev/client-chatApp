import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FormLogin, FormUser, Login } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://127.0.0.1:8000/api'

  private _httpCliente = inject(HttpClient)
 
  public registerUser(formUser:FormUser):Observable<FormUser>{
    return this._httpCliente.post<FormUser>(`${this.baseUrl}/register`,formUser)
  }
  public login(formLogin:FormLogin):Observable<Login>{
    return this._httpCliente.post<Login>(`${this.baseUrl}/login`,formLogin);
  }
}
