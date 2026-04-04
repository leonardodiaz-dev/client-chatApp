import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Conversation, ConversationResponse, FormConversation } from '../../models/conversation.model';

@Injectable({
  providedIn: 'root'
})
export class ConversationService {

  private _httpClient = inject(HttpClient)
  private baseUrl = 'http://127.0.0.1:8000/api/conversations'

  public addConversation(conversation:FormConversation):Observable<any>{
    return this._httpClient.post<any>(this.baseUrl,conversation)
  }
  public getAllConversations():Observable<ConversationResponse>{
    return this._httpClient.get<ConversationResponse>(this.baseUrl)
  }
}
