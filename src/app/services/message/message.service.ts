import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Message,
  MessageResponse,
  SendMessage,
} from '../../models/message.model';
import { EchoService } from '../echo/echo.service';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private _httpClient = inject(HttpClient);
  private baseUrl = 'http://127.0.0.1:8000/api/messages';
  private _echoService = inject(EchoService);

  public getMessages(
    idConversation: number,
  ): Observable<MessageResponse<Message[]>> {
    return this._httpClient.get<MessageResponse<Message[]>>(
      `${this.baseUrl}/${idConversation}`,
    );
  }
  public postMessage(
    message: SendMessage,
  ): Observable<MessageResponse<Message>> {
    const socketId = this._echoService.getEcho().socketId();
    return this._httpClient.post<MessageResponse<Message>>(
      this.baseUrl,
      message,
      {
        headers: {
          'X-Socket-Id': socketId ?? '',
        },
      },
    );
  }
  public deliveredMessage(id: number): Observable<any> {
    const socketId = this._echoService.getEcho().socketId();
    return this._httpClient.patch<any>(`${this.baseUrl}/${id}/delivered`,{},
      {
        headers: {
          'X-Socket-Id': socketId ?? '',
        },
      },
    );
  }
  public readMessage(idConversation:number):Observable<void>{
    const socketId = this._echoService.getEcho().socketId();
    return this._httpClient.patch<void>(`${this.baseUrl}/${idConversation}/read`,{},
       {
        headers: {
          'X-Socket-Id': socketId ?? '',
        },
      },
    );
  }
}
