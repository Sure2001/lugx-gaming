import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  name = '';
  email = '';
  password = '';
  selectedFile: File | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService // ✅ inject ToastrService
  ) {}

  // Handle file selection
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  goToSignin(): void {
    this.router.navigate(['/signin']);
  }

  signup() {
    const formData = new FormData();
    formData.append('name', this.name);
    formData.append('email', this.email);
    formData.append('password', this.password);

    if (this.selectedFile) {
      formData.append('avatar', this.selectedFile); // ✅ match multer.single('avatar')
    }

    this.http.post('http://localhost:5000/api/auth/register', formData).subscribe({
      next: (res: any) => {
        localStorage.setItem('user', res.email);
        this.toastr.success('Signup successful!', 'Success');
        setTimeout(() => this.router.navigate(['/cart']), 1000); // redirect after toast
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Signup failed. Try again.', 'Error');
      }
    });
  }
}
