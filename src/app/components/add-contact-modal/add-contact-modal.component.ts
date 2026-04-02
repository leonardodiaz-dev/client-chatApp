import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-add-contact-modal',
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './add-contact-modal.component.html',
  styleUrl: './add-contact-modal.component.css'
})
export class AddContactModalComponent {
 
}

