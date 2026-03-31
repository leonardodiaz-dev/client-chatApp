import { Component } from '@angular/core';
import { ChatListComponent } from '../../components/chat-list/chat-list.component';
import { Chat } from '../../../models/chat.model';
import { ChatWindowComponent } from '../../components/chat-window/chat-window.component';

@Component({
  selector: 'app-chat-page',
  imports: [ChatListComponent,ChatWindowComponent],
  templateUrl: './chat-page.component.html',
  styleUrl: './chat-page.component.css',
})
export class ChatPageComponent {
  chats: Chat[] = [
    { id: 1, name: 'Ana', lastMessage: 'Hola', lastTime: '10:30' },
    { id: 2, name: 'Carlos', lastMessage: 'Nos vemos', lastTime: '09:15' },
  ];
  activeConversation: Chat | undefined = undefined;
  setConversation(chat: Chat) {
    this.activeConversation = chat;
  }
}
