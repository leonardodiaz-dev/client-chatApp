import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Message, MessageResponse, SendMessage } from '../../models/message.model';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private _httpClient = inject(HttpClient);
  private baseUrl = 'http://127.0.0.1:8000/api/messages';

  public getMessages(idConversation:number):Observable<MessageResponse<Message[]>>{
    return this._httpClient.get<MessageResponse<Message[]>>(`${this.baseUrl}/${idConversation}`)
  }
  public postMessage(message:SendMessage):Observable<MessageResponse<Message>>{
    return this._httpClient.post<MessageResponse<Message>>(this.baseUrl,message);
  }
}
