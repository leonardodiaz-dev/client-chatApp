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
  imports: [ChatListComponent,ChatWindowComponent,NewChatComponent,CommonModule],
  templateUrl: './chat-page.component.html',
  styleUrl: './chat-page.component.css',
})

export class ChatPageComponent implements OnInit {
  //  { id: 1, name: 'Ana', lastMessage: 'Hola', lastTime: '10:30' },
  //   { id: 2, name: 'Carlos', lastMessage: 'Nos vemos', lastTime: '09:15' },
  viewLeft:'chatList' | 'newContact' | 'newChat' = 'chatList';
  chats: Conversation[] = [];
  activeConversation: Conversation | undefined = undefined;

  private conversationService = inject(ConversationService); 
  private notify = inject(NotificationService)

  ngOnInit(): void {
    this.conversationService.getAllConversations().subscribe({
      next:(value) => {
        console.log(value)
        this.notify.showSuccess(value.message)
        this.chats = value.data;
      },
      error:(err) => {
        this.notify.showError('Error al obtener las conversaciones');
      },
    })
  }

  setConversation(chat: Conversation) {
    this.activeConversation = chat;
  }
}
