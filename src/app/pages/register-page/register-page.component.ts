import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { FormUser } from '../../models/user.model';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-register-page',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css',
})
export class RegisterPageComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private form = inject(FormBuilder);
  private notify = inject(NotificationService);

  isSubmitting: boolean = false;

  formRegister = this.form.group(
    {
      name: ['', [Validators.required, Validators.minLength(3)]],
      lastname: ['', [Validators.required, Validators.maxLength(100)]],
      username: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.email, Validators.required]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
          ),
        ],
      ],
      password_confirmation: ['', [Validators.required]],
    },
    {
      validators: this.passwordMatchValidator,
    },
  );
  passwordMatchValidator(form: AbstractControl) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('password_confirmation')?.value;

    if (password !== confirmPassword) {
      form.get('password_confirmation')?.setErrors({ noMatch: true });
      return { noMatch: true };
    }

    return null;
  }
  getError(controlName: string): string {
    const control = this.formRegister.get(controlName);

    if (!control?.touched || !control.errors) return '';

    const errorMessages: Record<string, string> = {
      required: 'Este campo es obligatorio',
      email: 'Formato de email inválido',
      minlength: `Mínimo ${control.getError('minlength')?.requiredLength} caracteres`,
      maxLength: `Maximo ${control.getError('maxlength')?.requiredLength} caracteres`,
      pattern:
        'Debe tener: 1 minúscula, 1 mayúscula, 1 número y 1 carácter especial',
      noMatch: 'Las contraseñas no coinciden',
    };

    const firstError = Object.keys(control.errors)[0];

    return errorMessages[firstError] || 'Campo inválido';
  }

  enviar() {
    if (this.formRegister.valid) {
      console.log(this.formRegister.getRawValue())
      const data: FormUser = this.formRegister.getRawValue();
      this.isSubmitting = true;
      this.authService
        .registerUser(data)
        .pipe(finalize(() => (this.isSubmitting = false)))
        .subscribe({
          next: (response) => {
            console.log('Usuario registrado con éxito', response);
            this.formRegister.reset();
            this.notify.showSuccess('Usuario registrado con exito');
            this.router.navigate(['/login']);
          },
          error: (err) => {
            if (err.status === 422) {
             
              const validationErrors = err.error.errors;

              const firstKey = Object.keys(validationErrors)[0];
              const errorMessage = validationErrors[firstKey][0];

              this.notify.showWarning(errorMessage);
            } else {
              this.notify.showError(
                'Ocurrió un error inesperado en el servidor',
              );
            }
          },
        });
    } else {
      this.formRegister.markAllAsTouched();
    }
  }
}
