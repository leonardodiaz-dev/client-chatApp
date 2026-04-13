import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {
  Conversation,
  ConversationResponse,
  ConversationWithCount,
} from '../../models/conversation.model';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class ConversationService {
  private _httpClient = inject(HttpClient);
  private baseUrl = 'http://127.0.0.1:8000/api/conversations';

  private conversationCreatedSource = new Subject<void>();
  conversationCreated$ = this.conversationCreatedSource.asObservable();

  notifyConversationCreated() {
    this.conversationCreatedSource.next();
  }

  private updateConversationSource = new Subject<any>();
  updateConversation$ = this.updateConversationSource.asObservable();

  updateLastMessage(data: any) {
    this.updateConversationSource.next(data);
  }

  public addConversation(formData: FormData): Observable<any> {
    return this._httpClient.post<any>(this.baseUrl, formData);
  }

  public getAllConversations(): Observable<
    ConversationResponse<Conversation[]>
  > {
    return this._httpClient.get<ConversationResponse<Conversation[]>>(
      this.baseUrl,
    );
  }
  
  public getUnReadConversations():Observable<ConversationWithCount[]>{
    return this._httpClient.get<ConversationWithCount[]>(`${this.baseUrl}/unread`)
  }

  public getContacts(): Observable<ConversationResponse<User[]>> {
    return this._httpClient.get<ConversationResponse<User[]>>(
      `${this.baseUrl}/contact`,
    );
  }
}
