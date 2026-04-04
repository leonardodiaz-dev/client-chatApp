import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { Conversation } from '../../models/conversation.model';

@Component({
  selector: 'app-chat-window',
  imports: [FormsModule,
    //MatIcon
  ],
  templateUrl: './chat-window.component.html',
  styleUrl: './chat-window.component.css',
})
export class ChatWindowComponent {
  @Input() conversation: Conversation | undefined = undefined;
  messages = [
    // { id: 1, content: 'Hola', mine: false, time: '10:00' },
    // { id: 2, content: 'Hola!', mine: true, time: '10:01' },
  ];

  newMessage: string = '';

  sendMessage() {
    // if (!this.newMessage.trim()) return;

    // this.messages.push({
    //   id: Date.now(),
    //   content: this.newMessage,
    //   mine: true,
    //   time: new Date().toLocaleTimeString(),
    // });

    // this.newMessage = '';
  }
}
