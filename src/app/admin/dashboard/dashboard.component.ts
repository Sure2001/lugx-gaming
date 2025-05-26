import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class DashboardComponent {
  userCount = 0;
  orderCount = 0;
  totalRevenue = 0;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchUserCount();
    this.fetchOrderSummary();
  }

  fetchUserCount() {
    this.http.get<any>('http://localhost:5000/api/dashboard/user-count').subscribe({
      next: (res) => {
        this.userCount = res.count;
      },
      error: (err) => {
        console.error('User count error:', err);
      }
    });
  }

  fetchOrderSummary() {
    this.http.get<any>('http://localhost:5000/api/dashboard/order-summary').subscribe({
      next: (res) => {
        this.orderCount = res.orderCount;
        this.totalRevenue = res.totalRevenue;
      },
      error: (err) => {
        console.error('Order summary error:', err);
      }
    });
  }
}
