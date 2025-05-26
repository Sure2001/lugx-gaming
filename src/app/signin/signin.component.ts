import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private router: Router, private http: HttpClient) {}

  login() {
    const loginData = {
      email: this.email,
      password: this.password
    };
this.http.post<any>('http://localhost:5000/api/auth/login', loginData).subscribe({
  next: (res) => {
    if (res && res.user && res.user.email) {
      localStorage.setItem('user', res.user.email); // ✅ correct path
      alert('Login successful');
      this.router.navigate(['/cart']);
    } else {
      this.errorMessage = 'Invalid response from server';
      alert(this.errorMessage);
    }
  },
  error: (err) => {
    console.error(err);
    this.errorMessage = 'Login failed. Please check your credentials.';
    alert(this.errorMessage);
  }
});

  }
}
