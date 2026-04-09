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

@Component({
  selector: 'app-chat-window',
  imports: [FormsModule, MatIcon, ChatNamePipe],
  templateUrl: './chat-window.component.html',
  styleUrl: './chat-window.component.css',
})
export class ChatWindowComponent implements OnChanges {
  @Input() conversation: Conversation | undefined = undefined;
  messages: Message[] = [];

  newMessage: string = '';
  private _messageService = inject(MessageService);
  private _conversationService = inject(ConversationService);
  private _notify = inject(NotificationService);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['conversation'] && changes['conversation'].currentValue) {
      this.loadMessages();
    }
  }

  loadMessages(): void {
    if (!this.conversation) return;
    this._messageService.getMessages(this.conversation.id).subscribe({
      next: (value) => {
        //console.log(value.data);
        this.messages = value.data;
        this._notify.showSuccess(value.message);
      },
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
