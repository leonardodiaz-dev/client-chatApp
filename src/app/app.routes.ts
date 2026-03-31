import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { ChatPageComponent } from './pages/chat-page/chat-page.component';

export const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: 'chat', component: ChatPageComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
