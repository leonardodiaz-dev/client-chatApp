import { Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { Conversation } from '../../models/conversation.model';
import { Message, SendMessage } from '../../models/message.model';
import { MessageService } from '../../services/message/message.service';
import { NotificationService } from '../../services/notification.service';
import { ChatNamePipe } from '../../pipes/chat-name.pipe';

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
  private _notify = inject(NotificationService);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['conversation'] && changes['conversation'].currentValue) {
      this.loadMessages();
    }
  }

  loadMessages(): void {
    if(!this.conversation) return
    this._messageService.getMessages(this.conversation.id).subscribe({
      next: (value) => {
        console.log(value.data)
        this.messages = value.data;
        this._notify.showSuccess(value.message);
      },
    });
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;
    if(!this.conversation) return
    const sendMessage:SendMessage = {
      content:this.newMessage,
      conversation_id:this.conversation?.id
    }
    this._messageService.postMessage(sendMessage).subscribe({
      next:(value) => {
          this.messages.push(value.data)
          this._notify.showSuccess(value.message)
          this.newMessage = '';
      },
      error:(err) => {
         if (err.status === 422) {
          const validationErrors = err.error.errors;

          const firstKey = Object.keys(validationErrors)[0];
          const errorMessage = validationErrors[firstKey][0];

          this._notify.showWarning(errorMessage);
        } else {
          this._notify.showError('Ocurrió un error inesperado en el servidor');
        }
      },
    })
  }
}
