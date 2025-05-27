import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(
    private router: Router,
    private http: HttpClient,
    private toastr: ToastrService // ✅ inject toastr
  ) {}

  login() {
    const loginData = {
      email: this.email,
      password: this.password
    };

    this.http.post<any>('http://localhost:5000/api/auth/login', loginData).subscribe({
      next: (res) => {
        if (res && res.user && res.user.email) {
          localStorage.setItem('user', res.user.email);
          this.toastr.success('Login successful!', 'Success');
          setTimeout(() => this.router.navigate(['/cart']), 1000); // ✅ redirect after delay
        } else {
          this.errorMessage = 'Invalid response from server';
          this.toastr.error(this.errorMessage, 'Error');
        }
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Login failed. Please check your credentials.';
        this.toastr.error(this.errorMessage, 'Error');
      }
    });
  }
}
