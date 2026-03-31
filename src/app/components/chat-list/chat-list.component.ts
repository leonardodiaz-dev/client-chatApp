import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Chat } from '../../../models/chat.model';

@Component({
  selector: 'app-chat-list',
  imports: [],
  templateUrl: './chat-list.component.html',
  styleUrl: './chat-list.component.css',
})
export class ChatListComponent {
  @Input() chats:Chat[] = [];
  @Output() selectConversation = new EventEmitter<any>();

  selectChat(chat: Chat) {
    this.selectConversation.emit(chat);
  }
}
