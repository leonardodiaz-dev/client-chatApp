import {
  Component,
  computed,
  Inject,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { User } from '../../models/user.model';
import { ConversationService } from '../../services/conversation/conversation.service';
import { MatButtonModule } from '@angular/material/button';
import { UpdateConversation } from '../../models/conversation.model';
import { NotificationService } from '../../services/notification.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-anadir-participante',
  imports: [
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './anadir-participante.component.html',
  styleUrl: './anadir-participante.component.css',
})
export class AnadirParticipanteComponent implements OnInit {
  contacts = signal<User[]>([]);
  search = signal<string>('');
  selectedMembers = signal<User[]>([]);
  isLoading:boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
  private _conversationService = inject(ConversationService);
  private _notify = inject(NotificationService);
  private dialogRef = inject(MatDialogRef<AnadirParticipanteComponent>);

  ngOnInit(): void {
    this._conversationService.getOtherUsersByConversation(this.data.conversationId).subscribe({
      next:(value) => {
        this.contacts.set(value)
      },
      error:(err) => {
        console.log('Ocurrio un error')
      },
    });
  }

  filteredContacts = computed(() => {
    const term = this.search().toLowerCase().trim();

    if (!term) return this.contacts();

    return this.contacts().filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        (c.lastname && c.lastname.toLowerCase().includes(term)),
    );
  });
  toggleMember(user: User): void {
    const currentSelected = this.selectedMembers();
    const index = currentSelected.findIndex((u) => u.id === user.id);

    if (index === -1) {
      this.selectedMembers.set([...currentSelected, user]);
    } else {
      this.selectedMembers.set(currentSelected.filter((u) => u.id !== user.id));
    }
  }

  isMember(user: User): boolean {
    return this.selectedMembers().some((u) => u.id === user.id);
  }

  addParticipantes() {
    if (this.isLoading) return; 
    this.isLoading = true
    const ids = this.selectedMembers().map(m => m.id)
    const formUpdate:UpdateConversation = {
      conversation_id:this.data.conversationId,
      user_ids:ids.join(',')
    }
    console.log(formUpdate)
    this._conversationService.putConversation(formUpdate)
    .pipe(finalize(() => this.isLoading = false))
    .subscribe({
      next:(value) => {
        this._notify.showSuccess('Se añadio con exito');
        this.dialogRef.close();
      },
      error:(err) =>{
         if (err.status === 422) {
             
              const validationErrors = err.error.errors;

              const firstKey = Object.keys(validationErrors)[0];
              const errorMessage = validationErrors[firstKey][0];

              this._notify.showWarning(errorMessage);
            } else {
              this._notify.showError(
                'Ocurrió un error inesperado en el servidor',
              );
            }
      },
    });
  }
}
