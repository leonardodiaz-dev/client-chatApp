import { Component, EventEmitter, inject, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { AddContactModalComponent } from '../add-contact-modal/add-contact-modal.component';

@Component({
  selector: 'app-new-chat',
  imports: [MatIcon],
  templateUrl: './new-chat.component.html',
  styleUrl: './new-chat.component.css',
})
export class NewChatComponent {
  @Output() changeView = new EventEmitter<'chatList' | 'newChat'>();
  dialog = inject(MatDialog);

  openDialog() {
    const dialogRef = this.dialog.open(AddContactModalComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
