import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Chat } from '../../../models/chat.model';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-chat-list',
  imports: [MatIcon],
  templateUrl: './chat-list.component.html',
  styleUrl: './chat-list.component.css',
})
export class ChatListComponent {
  @Input() chats:Chat[] = [];
  @Output() changeView = new EventEmitter<'chatList' | 'newChat'>();
  @Output() selectConversation = new EventEmitter<any>();


  selectChat(chat: Chat) {
    this.selectConversation.emit(chat);
  }
}
