import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {
  email = '';
  password = '';

  constructor(private router: Router) {}

  login() {
    // Simulate successful login
    localStorage.setItem('user', this.email);
    this.router.navigate(['/checkout']);
  }
}
