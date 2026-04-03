import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user/user.service';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';

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
    CommonModule
  ],
  templateUrl: './add-contact-modal.component.html',
  styleUrl: './add-contact-modal.component.css',
})
export class AddContactModalComponent {
  control = new FormControl<string>('');
  users: User[] = [];

  private userService = inject(UserService)

  ngOnInit() {
    this.control.valueChanges.subscribe(value => {
      if (!value) return;
      if (value.length >= 3) {
        this.userService.searchUser(value).subscribe(res => {
          this.users = res
          console.log(res)
        })
      }
    });
  }
}
