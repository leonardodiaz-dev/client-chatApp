import { Injectable } from '@angular/core';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

@Injectable({
  providedIn: 'root',
})
export class EchoService {
  echo: Echo<any>;
  token = localStorage.getItem('token');
  
  constructor() {
    (window as any).Pusher = Pusher;
  console.log(this.token)
    this.echo = new Echo({
      broadcaster: 'reverb',
      key: '9wzozl91evwl3tlch2s1',
      wsHost: 'localhost',
      wsPort: 8080,
      forceTLS: false,
      authEndpoint: 'http://localhost:8000/api/broadcasting/auth',
      auth: {
        headers: {
          Authorization: `Bearer ${this.token}`,
          Accept: 'application/json',
        },
      },
    });
  }

  getEcho() {
    return this.echo;
  }
}
