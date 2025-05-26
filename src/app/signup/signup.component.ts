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
  selectedFile: File | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  // Called when file input changes
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
      formData.append('avatar', this.selectedFile); // This must match multer.single('avatar')
    }

   this.http.post('http://localhost:5000/api/auth/register', formData).subscribe({
  next: (res: any) => {
    localStorage.setItem('user', res.email); // ✅ store only email
    alert('Signup successful');
    this.router.navigate(['/cart']);
  },
  error: (err) => {
    console.error(err);
    alert('Signup failed');
  }
});

  }
}
