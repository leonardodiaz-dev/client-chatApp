import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  viewChild,
} from '@angular/core';
import { Chat } from '../../../models/chat.model';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-chat-list',
  imports: [MatIcon,MatMenuTrigger,MatMenuModule],
  templateUrl: './chat-list.component.html',
  styleUrl: './chat-list.component.css',
})
export class ChatListComponent {
  @Input() chats: Chat[] = [];
  @Output() changeView = new EventEmitter<'chatList' | 'newChat'>();
  @Output() selectConversation = new EventEmitter<any>();

  private authService = inject(AuthService);

  selectChat(chat: Chat) {
    this.selectConversation.emit(chat);
  }

  menuTrigger = viewChild.required(MatMenuTrigger);

  logout = () => this.authService.logout()
  
}
