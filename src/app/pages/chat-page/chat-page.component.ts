import { Component, inject, OnInit } from '@angular/core';
import { ChatListComponent } from '../../components/chat-list/chat-list.component';
import { ChatWindowComponent } from '../../components/chat-window/chat-window.component';
import { NewChatComponent } from '../../components/new-chat/new-chat.component';
import { CommonModule } from '@angular/common';
import { ConversationService } from '../../services/conversation/conversation.service';
import { Conversation } from '../../models/conversation.model';
import { NotificationService } from '../../services/notification.service';
import { Subject, takeUntil } from 'rxjs';

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
export class ChatPageComponent implements OnInit {
  viewLeft: 'chatList' | 'newContact' | 'newChat' = 'chatList';
  chats: Conversation[] = [];
  activeConversation: Conversation | undefined = undefined;

  private _conversationService = inject(ConversationService);
  private _notify = inject(NotificationService);
  private destroy$ = new Subject<void>();

  loadConversations() {
    this._conversationService.getAllConversations().subscribe({
      next: (value) => {
        this.chats = value.data;
      },
      error: (err) => {
        this._notify.showError('Error al obtener las conversaciones');
      },
    });
  }

  ngOnInit(): void {
    this.loadConversations();
    this._conversationService.conversationCreated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadConversations();
      });
    this._conversationService.updateConversation$.subscribe((data) => {
      const index = this.chats.findIndex((c) => c.id === data.conversation_id);
      if (index !== -1) {
        this.chats[index].last_message = data.message;
        this.chats[index].last_date = data.created_at;

        const updatedChat = this.chats.splice(index, 1)[0];
        this.chats.unshift(updatedChat);
      }
    });
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setConversation(chat: Conversation) {
    this.activeConversation = chat;
  }
}
