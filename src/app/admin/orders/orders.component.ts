import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  selectedOrders = new Set<string>();
  selectAllChecked = false;
math = Math; // For use in templates
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.http.get<any[]>('http://localhost:5000/api/order/order').subscribe({
      next: data => this.orders = data.reverse(),
      error: err => console.error('Error loading orders:', err)
    });
  }

  pagedOrders(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.orders.slice(start, start + this.itemsPerPage);
  }

  previousPage(): void {
    if (this.currentPage > 1) this.currentPage--;
  }

  nextPage(): void {
    if (this.currentPage < Math.ceil(this.orders.length / this.itemsPerPage)) this.currentPage++;
  }

  viewOrder(order: any): void {
    alert(JSON.stringify(order, null, 2));
  }

  deleteOrder(id: string): void {
    if (confirm('Are you sure you want to delete this order?')) {
      this.http.delete(`http://localhost:5000/api/order/delete/${id}`).subscribe({
        next: () => {
          this.orders = this.orders.filter(o => o._id !== id);
          this.selectedOrders.delete(id);
        },
        error: err => console.error('Delete failed:', err)
      });
    }
  }

  toggleSelection(id: string): void {
    if (this.selectedOrders.has(id)) {
      this.selectedOrders.delete(id);
    } else {
      this.selectedOrders.add(id);
    }
  }

  toggleSelectAll(): void {
    if (this.selectAllChecked) {
      this.pagedOrders().forEach(order => this.selectedOrders.add(order._id));
    } else {
      this.pagedOrders().forEach(order => this.selectedOrders.delete(order._id));
    }
  }

 deleteSelectedOrders(): void {
  if (confirm('Are you sure you want to delete selected orders?')) {
    const ids = Array.from(this.selectedOrders);

    this.http.post('http://localhost:5000/api/order/delete-multiple', { ids }).subscribe({
      next: () => {
        this.orders = this.orders.filter(order => !this.selectedOrders.has(order._id));
        this.selectedOrders.clear();
        alert('Selected orders deleted successfully.');
      },
      error: err => console.error('Bulk delete failed:', err)
    });
  }
}


  exportToCSV(): void {
    const csvData = this.orders.map(order => ({
      Email: order.userEmail,
      Total: order.totalPrice,
      Created: order.createdAt
    }));
    const csv = csvData.map(row => Object.values(row).join(',')).join('\n');
    const blob = new Blob(["Email,Total,Created\n" + csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'orders.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  exportToExcel(): void {
    const worksheet = XLSX.utils.json_to_sheet(this.orders.map(order => ({
      Email: order.userEmail,
      Total: order.totalPrice,
      Created: order.createdAt
    })));
    const workbook = { Sheets: { 'Orders': worksheet }, SheetNames: ['Orders'] };
    XLSX.writeFile(workbook, 'orders.xlsx');
  }
}
