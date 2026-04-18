import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {
  Conversation,
  ConversationResponse,
  UpdateConversation
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

  public getConversationById($idConversation:number):Observable<Conversation>{
    return  this._httpClient.get<Conversation>(`${this.baseUrl}/${$idConversation}`)
  }
  
  public getUnReadConversations():Observable<Conversation[]>{
    return this._httpClient.get<Conversation[]>(`${this.baseUrl}/unread`)
  }

  public getContacts(): Observable<ConversationResponse<User[]>> {
    return this._httpClient.get<ConversationResponse<User[]>>(
      `${this.baseUrl}/contact`,
    );
  }
  public getOtherUsersByConversation(idConversation:number):Observable<User[]>{
    return this._httpClient.get<User[]>(`${this.baseUrl}/users/${idConversation}`)
  }
  public putConversation(formUpdate:UpdateConversation):Observable<any>{
    return this._httpClient.put<any>(this.baseUrl,formUpdate);
  }
  public deleteParticipante(idConversation:number,userId:number):Observable<any>{
    return this._httpClient.delete<any>(`${this.baseUrl}/${idConversation}/user/${userId}`)
  }
}
