import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ConversationService } from '../../services/conversation/conversation.service';
import { User } from '../../models/user.model';
import { NotificationService } from '../../services/notification.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-group',
  imports: [MatButtonModule, MatDialogModule, FormsModule],
  templateUrl: './create-group.component.html',
  styleUrl: './create-group.component.css',
})
export class CreateGroupComponent implements OnInit {
  private _conversationService = inject(ConversationService);
  private _notify = inject(NotificationService);
  private dialogRef = inject(MatDialogRef<CreateGroupComponent>);

  groupName: string = '';
  selectedFile: File | null = null;
  imagePreview = signal<string | null>(null);
  selectedMembers = signal<User[]>([]);

  contacts = signal<User[]>([]);
  search = signal<string>('');

  filteredContacts = computed(() => {
    const term = this.search().toLowerCase().trim();

    if (!term) return this.contacts();

    return this.contacts().filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        (c.lastname && c.lastname.toLowerCase().includes(term)),
    );
  });

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview.set(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

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

  ngOnInit(): void {
    this._conversationService.getContacts().subscribe({
      next: (value) => {
        this.contacts.set(value.data);
      },
      error: (err) => {
        console.log(err);
        this._notify.showError('Ocurrió un error inesperado en el servidor');
      },
    });
  }

  addGroup() {
    const formData = new FormData();
    formData.append('name', this.groupName);
    formData.append('type', 'group');
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }
    const members = this.selectedMembers().map((u) => u.id);
    formData.append('user_ids', members.join(','));

    console.log('Enviando FormData a Laravel...');
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });
    this._conversationService.addConversation(formData).subscribe({
      next: (value) => {
        this._notify.showSuccess('Grupo creado exitosamente');
        this.dialogRef.close();
      },
      error: (err) => {
        this._notify.showError('Ocurrio un error inesperado');
      },
    });
  }
}
