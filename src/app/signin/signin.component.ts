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

    this.http.post<any>('http://localhost:5000/api/login', loginData).subscribe(
      (response) => {
        if (response.success) {
          localStorage.setItem('user', JSON.stringify(response.user));
          this.router.navigate(['/checkout']);
        } else {
          this.errorMessage = 'Invalid email or password';
        }
      },
      (error) => {
        this.errorMessage = 'Login failed. Please try again.';
        console.error(error);
      }
    );
  }
}
