import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  features = [
    { icon: 'bi bi-cloud-arrow-down', title: 'FREE STORAGE' },
    { icon: 'bi bi-person-circle', title: 'USER MORE' },
    { icon: 'bi bi-chat-left-dots', title: 'REPLY READY' },
    { icon: 'bi bi-layout-text-window-reverse', title: 'EASY LAYOUT' },
  ];
}
