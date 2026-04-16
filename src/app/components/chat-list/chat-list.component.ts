import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  viewChild,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { AuthService } from '../../services/auth/auth.service';
import { Conversation } from '../../models/conversation.model';
import { ChatNamePipe } from '../../pipes/chat-name.pipe';
import { FormatearFechaPipe } from '../../pipes/formatear-fecha.pipe';
import { ConversationService } from '../../services/conversation/conversation.service';
import { CommonModule } from '@angular/common';
import { finalize, Subject, takeUntil } from 'rxjs';
import { PerfilComponent } from "../perfil/perfil.component";

@Component({
  selector: 'app-chat-list',
  imports: [
    MatIcon,
    MatMenuTrigger,
    MatMenuModule,
    ChatNamePipe,
    FormatearFechaPipe,
    CommonModule,
    PerfilComponent
],
  templateUrl: './chat-list.component.html',
  styleUrl: './chat-list.component.css',
})
export class ChatListComponent implements OnInit {
  @Input() chats: Conversation[] = [];
  @Output() changeView = new EventEmitter<'chatList' | 'newChat'>();
  @Output() selectConversation = new EventEmitter<any>();

  private authService = inject(AuthService);
  private _conversationService = inject(ConversationService);
  private destroy$ = new Subject<void>();

  filtro: string = 'todos';
  showProfileModal:boolean = false;
  loading: boolean = false;

  setFiltro(value: string) {
    this.filtro = value;

    if (this.filtro === 'todos') {
      this.loadConversations();
    }

    if (this.filtro === 'no leidos') {
      this.chatsUnRead();
    }
  }

  selectChat(chat: Conversation) {
    this.selectConversation.emit(chat);
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

  chatsUnRead() {
    this.loading = true;
    this._conversationService
      .getUnReadConversations()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (value) => {
          console.log(value);
          this.chats = value;
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  loadConversations() {
    this.loading = true;
    this._conversationService
      .getAllConversations()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
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
  
  setShowModal($event:any){
    this.showProfileModal = $event;
  }

  perfil(){
    this.showProfileModal = true;
  }
}
