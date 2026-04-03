import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://127.0.0.1:8000/api/users'
  private _httpCliente = inject(HttpClient)

  public searchUser(busqueda:string):Observable<User[]>{
    return this._httpCliente.get<User[]>(`${this.baseUrl}/find-user/${busqueda}`)
  }
}
