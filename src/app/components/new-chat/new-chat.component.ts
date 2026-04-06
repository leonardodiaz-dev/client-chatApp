import { Component, EventEmitter, inject, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { AddContactModalComponent } from '../add-contact-modal/add-contact-modal.component';
import { CreateGroupComponent } from '../create-group/create-group.component';

@Component({
  selector: 'app-new-chat',
  imports: [MatIcon],
  templateUrl: './new-chat.component.html',
  styleUrl: './new-chat.component.css',
})
export class NewChatComponent {
  @Output() changeView = new EventEmitter<'chatList' | 'newChat'>();
  dialog = inject(MatDialog);

  openDialogAddContact() {
    const dialogRef = this.dialog.open(AddContactModalComponent, {
      width: '500px',
      maxWidth: '90vw',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
  openDialogCreateGroup() {
    const dialogRef = this.dialog.open(CreateGroupComponent, {
      width: '500px',
      maxWidth: '90vw',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
