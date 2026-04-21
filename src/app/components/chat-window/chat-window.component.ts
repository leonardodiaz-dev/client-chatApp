import {
  Component,
  ElementRef,
  inject,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { Conversation } from '../../models/conversation.model';
import { Message, SendMessage } from '../../models/message.model';
import { MessageService } from '../../services/message/message.service';
import { NotificationService } from '../../services/notification.service';
import { ChatNamePipe } from '../../pipes/chat-name.pipe';
import { ConversationService } from '../../services/conversation/conversation.service';
import { EchoService } from '../../services/echo/echo.service';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AddContactModalComponent } from '../add-contact-modal/add-contact-modal.component';
import { environment } from '../../../environments/environment';
import { AnadirParticipanteComponent } from '../anadir-participante/anadir-participante.component';
import { User } from '../../models/user.model';
import { MatMenuModule } from '@angular/material/menu';
import { ConfirmService } from '../../shared/confirm.service';

@Component({
  selector: 'app-chat-window',
  imports: [
    FormsModule,
    MatIcon,
    ChatNamePipe,
    CommonModule,
    MatIconModule,
    MatMenuModule,
  ],
  templateUrl: './chat-window.component.html',
  styleUrl: './chat-window.component.css',
})
export class ChatWindowComponent implements OnChanges {
  @Input() conversation: Conversation | undefined = undefined;
  messages: Message[] = [];
  loadingMessages = true;
  newMessage: string = '';
  showInfoPanel = false;
  storageUrl = environment.storageUrl;

  private _messageService = inject(MessageService);
  private _conversationService = inject(ConversationService);
  private _notify = inject(NotificationService);
  private _echoService = inject(EchoService);
  private _confirmService = inject(ConfirmService);

  dialog = inject(MatDialog);

  openDialogAddParticipantes() {
    const dialogRef = this.dialog.open(AnadirParticipanteComponent, {
      width: '500px',
      maxWidth: '90vw',
      data: {
        conversationId: this.conversation?.id,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.newUsers && this.conversation?.users) {
        const existingIds = this.conversation.users.map((u) => u.id);

        const usersToAdd = result.newUsers.filter(
          (u: User) => !existingIds.includes(u.id),
        );

        this.conversation.users = [...this.conversation.users, ...usersToAdd];
      }
    });
  }

  toggleInfoPanel() {
    this.showInfoPanel = !this.showInfoPanel;
    this.loadConversation();
  }

  userStorage = localStorage.getItem('user');
  currentUser = this.userStorage ? JSON.parse(this.userStorage) : null;
  currentRole: string | undefined = '';

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

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  onAvatarClick() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    const formData = new FormData();
    formData.append('avatar', file);
    if (this.conversation)
      formData.append('id_conversation', this.conversation?.id.toString());

    this._conversationService.postAvatar(formData).subscribe({
      next: (value) => {
        if (this.conversation) {
          this.conversation.avatar = value.avatar;
        }
      },
      error: (err) => {
        console.error('Error al subir imagen', err);
      },
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

  loadConversation() {
    if (this.conversation?.id) {
      this._conversationService
        .getConversationById(this.conversation.id)
        .subscribe({
          next: (value) => {
            // console.log(value)
            this.conversation = value;
            const finUser: User | undefined = this.conversation?.users?.find(
              (u) => u.id === this.currentUser.id,
            );
            this.currentRole = finUser ? finUser.role : '';
          },
          error: (err) => {
            console.log('Ocurrio un error');
          },
        });
    }
  }

  loadMessages(): void {
    if (!this.conversation) return;
    this.loadingMessages = true;
    this._messageService.getMessages(this.conversation.id).subscribe({
      next: (value) => {
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

  removeUser(userId: number) {
    this._confirmService
      .confirm('¿Estas seguro que quieres eliminar este participante?')
      .subscribe((ok) => {
        if (ok) {
          if (this.conversation) {
            this._conversationService
              .deleteParticipante(this.conversation.id, userId)
              .subscribe({
                next: (value) => {
                  if (this.conversation) {
                    const filterUser = this.conversation.users?.filter(
                      (u) => u.id !== userId,
                    );
                    this.conversation.users = filterUser;
                  }
                  this._notify.showSuccess('Participante eliminado con exito');
                },
                error: (err) => {
                  console.log('Ocurrio un error al eliminar el participante');
                },
              });
          }
        }
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

  openDialogAddContact() {
    const dialogRef = this.dialog.open(AddContactModalComponent, {
      width: '500px',
      maxWidth: '90vw',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
