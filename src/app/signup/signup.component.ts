import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  name = '';
  email = '';
  password = '';

  constructor(private http: HttpClient, private router: Router) {}

  signup() {
    const user = { name: this.name, email: this.email, password: this.password };

    this.http.post('http://localhost:5000/api/auth/signup', user).subscribe({
      next: () => {
        localStorage.setItem('user', JSON.stringify(user));
        alert('Signup successful');
        this.router.navigate(['/checkout']);
      },
      error: () => {
        alert('Signup failed');
      }
    });
  }
}
