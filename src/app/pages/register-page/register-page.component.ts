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

@Component({
  selector: 'app-register-page',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css',
})
export class RegisterPageComponent {
  private authService = inject(AuthService);
  private form = inject(FormBuilder);

  formRegister = this.form.group(
    {
      name: ['', [Validators.required, Validators.minLength(3)]],
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
      pattern:'Debe tener: 1 minúscula, 1 mayúscula, 1 número y 1 carácter especial',
      noMatch: 'Las contraseñas no coinciden',
    };

    const firstError = Object.keys(control.errors)[0];

    return errorMessages[firstError] || 'Campo inválido';
  }

  enviar() {
    if (this.formRegister.valid) {
      const data: FormUser = this.formRegister.getRawValue();

      this.authService.registerUser(data).subscribe({
        next: (response) => {
          console.log('Usuario registrado con éxito', response);
          this.formRegister.reset();
          // Aquí podrías redirigir al login o mostrar un mensaje de éxito
        },
        error: (err) => {
          console.error('Error en el registro', err);
          // Aquí podrías manejar el error 422 de Laravel si el correo ya existe
        },
      });
    } else {
      this.formRegister.markAllAsTouched(); // Marca errores si el usuario da clic sin llenar
    }
  }
}
