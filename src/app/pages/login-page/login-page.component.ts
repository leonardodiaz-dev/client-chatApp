import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { FormLogin } from '../../models/user.model';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-login-page',
  imports: [FormsModule, ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
})
export class LoginPageComponent {
  private authService = inject(AuthService);
  private form = inject(FormBuilder);
  private router = inject(Router);

  isSubmitting: boolean = false;

  formLogin = this.form.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  login() {
    console.log(this.formLogin.get('email'), this.formLogin.get('password'));
    if (this.formLogin.valid) {
      this.isSubmitting = true;
      const data: FormLogin = this.formLogin.getRawValue();
      this.authService
        .login(data)
        .pipe(finalize(() => (this.isSubmitting = false)))
        .subscribe({
          next: (res) => {
            console.log(res);
            localStorage.setItem('token', res.token);
            this.router.navigate(['/chat']);
          },
          error: (err) => {
            console.error('Error en el registro', err);
          },
        });
    }
  }
}
