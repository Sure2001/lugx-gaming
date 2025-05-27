import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {
  email: string = '';
  password: string = '';

  demoAdmins = [
    { email: 'admin@example.com', password: 'admin123', route: '/admin/dashboard' },
    { email: 'demo@admin.com', password: 'demo123', route: '/admin/dashboard' }
  ];

  constructor(private router: Router, private toastr: ToastrService) {}

  handleLogin() {
    const matchedAdmin = this.demoAdmins.find(
      admin => admin.email === this.email && admin.password === this.password
    );

    if (matchedAdmin) {
      localStorage.setItem('isAdminLoggedIn', 'true');
      this.toastr.success('Login successful!');
      this.router.navigate([matchedAdmin.route]);
    } else {
      this.toastr.error('Invalid credentials!');
    }
  }
}
