import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-topnav',
  templateUrl: './topnav.component.html',
  styleUrls: ['./topnav.component.css']
})
export class TopnavComponent {
  constructor(private router: Router) {}

  logout() {
    localStorage.removeItem('admin');
    this.router.navigate(['admin/login']);
  }
}
