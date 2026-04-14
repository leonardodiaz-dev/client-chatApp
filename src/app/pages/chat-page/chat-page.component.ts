import { Component, inject, OnInit } from '@angular/core';
import { ChatListComponent } from '../../components/chat-list/chat-list.component';
import { ChatWindowComponent } from '../../components/chat-window/chat-window.component';
import { NewChatComponent } from '../../components/new-chat/new-chat.component';
import { CommonModule } from '@angular/common';
import { ConversationService } from '../../services/conversation/conversation.service';
import { Conversation } from '../../models/conversation.model';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-chat-page',
  imports: [
    ChatListComponent,
    ChatWindowComponent,
    NewChatComponent,
    CommonModule,
  ],
  templateUrl: './chat-page.component.html',
  styleUrl: './chat-page.component.css',
})
export class ChatPageComponent {
  viewLeft: 'chatList' | 'newContact' | 'newChat' = 'chatList';
  chats: Conversation[] = [];
  activeConversation: Conversation | undefined = undefined;

  private _conversationService = inject(ConversationService);
  private _notify = inject(NotificationService);

  loadConversations() {
    this._conversationService.getAllConversations().subscribe({
      next: (value) => {
        console.log(value.data)
        this.chats = value.data;
      },
      error: (err) => {
        this._notify.showError('Error al obtener las conversaciones');
      },
    });
  }

  setConversation(chat: Conversation) {
    this.activeConversation = chat;
  }
}
