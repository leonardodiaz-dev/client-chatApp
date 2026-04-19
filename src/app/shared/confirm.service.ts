import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {

    constructor(private dialog: MatDialog) {}

  confirm(message: string, title: string = 'Confirmación'){
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '320px',
      data: { message, title },
      disableClose: true
    });

    return ref.afterClosed();
  }
}
