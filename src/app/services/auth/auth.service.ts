import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FormLogin, FormUser, Login, User } from '../../models/user.model';
import { routes } from '../../app.routes';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://127.0.0.1:8000/api'

  private _httpCliente = inject(HttpClient)
  private _router = inject(Router);
 
  public registerUser(formUser:FormUser):Observable<FormUser>{
    return this._httpCliente.post<FormUser>(`${this.baseUrl}/register`,formUser)
  }

  public login(formLogin:FormLogin):Observable<Login>{
    return this._httpCliente.post<Login>(`${this.baseUrl}/login`,formLogin);
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  saveUser(user:User){
    localStorage.setItem('user',JSON.stringify(user));
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem('token');
    this._router.navigate(['/login']);
  }
}
