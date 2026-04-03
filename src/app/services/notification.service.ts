import { inject, Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private defaultConfig: MatSnackBarConfig = {
    duration: 5000,
    horizontalPosition: 'end', 
    verticalPosition: 'top',
  };

  private snackBar = inject(MatSnackBar)

  showSuccess(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      ...this.defaultConfig,
      panelClass: ['success-snackbar']
    });
  }

  showError(message: string): void {
    this.snackBar.open(message, 'Reintentar', {
      ...this.defaultConfig,
      panelClass: ['error-snackbar']
    });
  }

  showWarning(message: string): void {
    this.snackBar.open(message, 'OK', {
      ...this.defaultConfig,
      panelClass: ['warning-snackbar']
    });
  }
}
