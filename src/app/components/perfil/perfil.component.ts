import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user/user.service';
import { AuthService } from '../../services/auth/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-perfil',
  imports: [MatIconModule, CommonModule, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css',
})
export class PerfilComponent implements OnInit {
  @Output() changePerfilModal = new EventEmitter<boolean>();
  @Input() showProfileModal: boolean | undefined = undefined;
  editName: string = '';
  avatarPreview: string | null = null;
  selectedAvatar: File | null = null;
  storageUrl = environment.storageUrl;
  currentUser = localStorage.getItem('user');
  currentUserStore = this.currentUser ? JSON.parse(this.currentUser) : null;

  private _userService = inject(UserService);
  private _authService = inject(AuthService);
  private _notify = inject(NotificationService);

  ngOnInit(): void {
    if (this.currentUserStore) {
      this.editName = this.currentUserStore.name;
      if (this.currentUserStore.avatar) {
        this.avatarPreview = this.storageUrl + this.currentUserStore.avatar;
      }
    }
  }

  closeProfileModal() {
    this.changePerfilModal.emit(false);
  }
  onAvatarChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedAvatar = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.avatarPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  saveProfile() {
    const formData = new FormData();
    formData.append('name', this.editName);
    if (this.selectedAvatar) {
      formData.append('avatar', this.selectedAvatar);
    }
    formData.append('_method', 'PUT');
    this._userService.putUser(formData).subscribe({
      next: (value) => {
        this._authService.saveUser(value);
        this._notify.showSuccess('Datos del usuario actualizados con exito');
        this.changePerfilModal.emit(false);
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
    console.log('Guardando datos...', this.editName);
    console.log(formData.get('avatar'));
  }
}
