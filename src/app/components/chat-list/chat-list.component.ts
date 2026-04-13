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
import { Conversation, ConversationWithCount } from '../../models/conversation.model';
import { ChatNamePipe } from '../../pipes/chat-name.pipe';
import { FormatearFechaPipe } from '../../pipes/formatear-fecha.pipe';
import { ConversationService } from '../../services/conversation/conversation.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat-list',
  imports: [
    MatIcon,
    MatMenuTrigger,
    MatMenuModule,
    ChatNamePipe,
    FormatearFechaPipe,
    CommonModule,
  ],
  templateUrl: './chat-list.component.html',
  styleUrl: './chat-list.component.css',
})
export class ChatListComponent {
  @Input() chats: any = [];
  @Output() changeView = new EventEmitter<'chatList' | 'newChat'>();
  @Output() selectConversation = new EventEmitter<any>();

  private authService = inject(AuthService);
  private _convesationService = inject(ConversationService);

  filtro: string = 'todos';

  setFiltro(value: string) {
    this.filtro = value;

    if (this.filtro === 'todos') {
      this.getAll();
    }

    if (this.filtro === 'no leidos') {
      this.chatsUnRead();
    }
  }

  selectChat(chat: Conversation) {
    this.selectConversation.emit(chat);
  }

  chatsUnRead() {
    this._convesationService.getUnReadConversations().subscribe({
      next: (value) => {
        console.log(value)
        this.chats = value;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getAll() {
    this._convesationService.getAllConversations().subscribe({
      next: (value) => {
        this.chats = value.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  menuTrigger = viewChild.required(MatMenuTrigger);

  logout = () => this.authService.logout();
}
