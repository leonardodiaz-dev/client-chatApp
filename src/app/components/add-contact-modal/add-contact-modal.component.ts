import { Component, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user/user.service';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { ConversationService } from '../../services/conversation/conversation.service';
import { FormConversation } from '../../models/conversation.model';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-add-contact-modal',
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './add-contact-modal.component.html',
  styleUrl: './add-contact-modal.component.css',
})
export class AddContactModalComponent {
  control = new FormControl<string>('');
  users: User[] = [];

  user: any = {
    id: 0,
    name: '',
    lastname: '',
  };

  private userService = inject(UserService);
  private conversationService = inject(ConversationService);
  private dialogRef = inject(MatDialogRef<AddContactModalComponent>);
  private notify = inject(NotificationService);

  ngOnInit() {
    this.control.valueChanges.subscribe((value) => {
      if (!value) return;
      if (value.length >= 3) {
        this.userService.searchUser(value).subscribe((res) => {
          this.users = res;
          console.log(res);
        });
      }
    });
  }

  selectUser(user: any) {
    this.user.id = user.id
    this.user.name = user.name;
    this.user.lastname = user.lastname;
  }

  addContact() {
    const conversation: FormConversation = {
      user_ids: [this.user.id],
      name:this.user.name,
      type: 'private',
    };
   
    this.conversationService.addConversation(conversation).subscribe({
      next: (value) => {
        this.notify.showSuccess(value.message);
        this.dialogRef.close();
      },
      error: (err) => {
        if (err.status === 422) {
          const validationErrors = err.error.errors;

          const firstKey = Object.keys(validationErrors)[0];
          const errorMessage = validationErrors[firstKey][0];

          this.notify.showWarning(errorMessage);
        } else {
          this.notify.showError('Ocurrió un error inesperado en el servidor');
        }
      },
    });
  }
}
