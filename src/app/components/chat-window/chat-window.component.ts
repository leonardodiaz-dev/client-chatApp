import {
  Component,
  inject,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { Conversation } from '../../models/conversation.model';
import { Message, SendMessage } from '../../models/message.model';
import { MessageService } from '../../services/message/message.service';
import { NotificationService } from '../../services/notification.service';
import { ChatNamePipe } from '../../pipes/chat-name.pipe';
import { ConversationService } from '../../services/conversation/conversation.service';
import { EchoService } from '../../services/echo/echo.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat-window',
  imports: [FormsModule, MatIcon, ChatNamePipe, CommonModule],
  templateUrl: './chat-window.component.html',
  styleUrl: './chat-window.component.css',
})
export class ChatWindowComponent implements OnChanges {
  @Input() conversation: Conversation | undefined = undefined;
  messages: Message[] = [];
  loadingMessages = true;
  newMessage: string = '';
  private _messageService = inject(MessageService);
  private _conversationService = inject(ConversationService);
  private _notify = inject(NotificationService);
  private _echoService = inject(EchoService);
  private channel: any;

  userStorage = localStorage.getItem('user');
  currentUser = this.userStorage ? JSON.parse(this.userStorage) : null;

  markAsRead(conversationId: number) {
    this._messageService.readMessage(conversationId).subscribe();
  }

  private currentChannel: any;
  private previousConversationId: number | null = null;

  listenEvents() {
    this.currentChannel.listen('.MessageSent', (e: any) => {
      console.log('mensaje recibido', e);

      const nuevoMensaje = {
        ...e.message,
        mine: e.message.user_id === this.currentUser.id,
      };

      this.messages.push(nuevoMensaje);

      this._messageService.deliveredMessage(e.message.id).subscribe();
    });

    this.currentChannel.listen('.MessageDelivered', (e: any) => {
      const msg = this.messages.find((m) => m.id === e.messageId);

      if (msg) {
        msg.status = 'entregado';
      }
    });

    this.currentChannel.listen('.MessageRead', (e: any) => {
      this.messages.forEach((msg) => {
        if (msg.status === 'entregado') {
          msg.status = 'leido';
        }
      });
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['conversation'] && this.conversation?.id) {
      const echo = this._echoService.getEcho();

      if (this.previousConversationId) {
        echo.leave(`chat.${this.previousConversationId}`);
      }

      this.previousConversationId = this.conversation.id;

      this.currentChannel = echo.private(`chat.${this.conversation.id}`);

      this.listenEvents();

      this.loadMessages();
      this.markAsRead(this.conversation.id);
    }
  }

  ngOnDestroy() {
    const echo = this._echoService.getEcho();

    if (this.conversation?.id) {
      echo.leave(`chat.${this.conversation.id}`);
    }
  }

  loadMessages(): void {
    if (!this.conversation) return;
    this.loadingMessages = true;
    this._messageService.getMessages(this.conversation.id).subscribe({
      next: (value) => {
        console.log(value.data);
        this.messages = value.data;
        this._notify.showSuccess(value.message);
        this.loadingMessages = false;
      },
      error: () => (this.loadingMessages = false),
    });
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;
    if (!this.conversation) return;
    const sendMessage: SendMessage = {
      content: this.newMessage,
      conversation_id: this.conversation?.id,
    };
    this._messageService.postMessage(sendMessage).subscribe({
      next: (value) => {
        this.messages.push(value.data);
        this._conversationService.updateLastMessage({
          conversation_id: this.conversation?.id,
          message: value.data.content,
          created_at: value.data.date,
        });
        this._notify.showSuccess(value.message);
        this.newMessage = '';
      },
      error: (err) => {
        if (err.status === 422) {
          const validationErrors = err.error.errors;

          const firstKey = Object.keys(validationErrors)[0];
          const errorMessage = validationErrors[firstKey][0];

          this._notify.showWarning(errorMessage);
        } else {
          this._notify.showError('Ocurrió un error inesperado en el servidor');
        }
      },
    });
  }
  getDay(date: string) {
    const d = new Date(date);
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
  }
  formatDate(date: string) {
    const msgDate = new Date(date);
    const today = new Date();

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (msgDate.toDateString() === today.toDateString()) {
      return 'Hoy';
    }

    if (msgDate.toDateString() === yesterday.toDateString()) {
      return 'Ayer';
    }

    return msgDate.toLocaleDateString();
  }
  formatDatetoHour(date: string) {
    const fecha = new Date(date);
    const hora12 = fecha.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    return hora12;
  }
}
