import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Conversation, ConversationResponse, FormConversation } from '../../models/conversation.model';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ConversationService {

  private _httpClient = inject(HttpClient)
  private baseUrl = 'http://127.0.0.1:8000/api/conversations'

  public addConversation(conversation:FormConversation):Observable<any>{
    return this._httpClient.post<any>(this.baseUrl,conversation)
  }
  public getAllConversations():Observable<ConversationResponse<Conversation[]>>{
    return this._httpClient.get<ConversationResponse<Conversation[]>>(this.baseUrl)
  }

  public getContacts():Observable<ConversationResponse<User[]>>{
    return this._httpClient.get<ConversationResponse<User[]>>(`${this.baseUrl}/contact`)
  }
}
