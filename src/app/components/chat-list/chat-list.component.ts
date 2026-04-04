import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  viewChild,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { AuthService } from '../../services/auth/auth.service';
import { Conversation } from '../../models/conversation.model';

@Component({
  selector: 'app-chat-list',
  imports: [MatIcon, MatMenuTrigger, MatMenuModule],
  templateUrl: './chat-list.component.html',
  styleUrl: './chat-list.component.css',
})
export class ChatListComponent {
  @Input() chats: Conversation[] = [];
  @Output() changeView = new EventEmitter<'chatList' | 'newChat'>();
  @Output() selectConversation = new EventEmitter<any>();

  private authService = inject(AuthService);

  selectChat(chat: Conversation) {
    this.selectConversation.emit(chat);
  }

  menuTrigger = viewChild.required(MatMenuTrigger);

  getChatName(chat: any) {
    if (chat.type === 'private') {
      return chat.users?.[0]?.name;
    }

    return chat.name;
  }
  logout = () => this.authService.logout();
}
