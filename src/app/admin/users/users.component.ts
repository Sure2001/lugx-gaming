import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

declare var bootstrap: any;
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  displayedUsers: any[] = [];
  selectedUsers: Set<string> = new Set();
  selectedUser: any = null;
  selectAllChecked = false;
  currentPage = 1;
  itemsPerPage = 5;

   Math = Math;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.http.get<any[]>('http://localhost:5000/api/auth/users').subscribe({
      next: (data) => {
        this.users = data.reverse();
        this.updatePagination();
      },
      error: (err) => console.error('Failed to load users:', err)
    });
  }

  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedUsers = this.users.slice(startIndex, endIndex);
    this.updateSelectAllStatus();
  }

  nextPage(): void {
    if ((this.currentPage * this.itemsPerPage) < this.users.length) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  toggleAll(): void {
    if (this.selectAllChecked) {
      this.displayedUsers.forEach(user => this.selectedUsers.add(user._id));
    } else {
      this.displayedUsers.forEach(user => this.selectedUsers.delete(user._id));
    }
  }

  toggleUser(userId: string): void {
    if (this.selectedUsers.has(userId)) {
      this.selectedUsers.delete(userId);
    } else {
      this.selectedUsers.add(userId);
    }
    this.updateSelectAllStatus();
  }

  updateSelectAllStatus(): void {
    this.selectAllChecked = this.displayedUsers.every(user => this.selectedUsers.has(user._id));
  }

  deleteUser(userId: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.http.delete(`http://localhost:5000/api/auth/users/${userId}`).subscribe({
        next: () => {
          this.users = this.users.filter(u => u._id !== userId);
          this.selectedUsers.delete(userId);
          this.updatePagination();
        },
        error: (err) => console.error('Delete failed:', err)
      });
    }
  }

  deleteSelectedUsers(): void {
    if (this.selectedUsers.size === 0) {
      alert('No users selected.');
      return;
    }

    if (confirm('Are you sure you want to delete selected users?')) {
      const ids = Array.from(this.selectedUsers);
      let deleteCount = 0;

      ids.forEach(id => {
        this.http.delete(`http://localhost:5000/api/auth/users/${id}`).subscribe({
          next: () => {
            deleteCount++;
            this.users = this.users.filter(u => u._id !== id);
            this.selectedUsers.delete(id);

            if (deleteCount === ids.length) {
              this.updatePagination();
            }
          },
          error: (err) => console.error('Delete failed:', err)
        });
      });
    }
  }

  viewUser(user: any): void {
    this.selectedUser = user;
    const modalElement = document.getElementById('userModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  exportToExcel(): void {
    const exportData = this.users.map(u => ({
      Name: u.name,
      Email: u.email
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = { Sheets: { Users: worksheet }, SheetNames: ['Users'] };
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    FileSaver.saveAs(new Blob([excelBuffer]), 'Users.xlsx');
  }

  exportToCSV(): void {
    const exportData = this.users.map(u => ({
      Name: u.name,
      Email: u.email
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    FileSaver.saveAs(blob, 'Users.csv');
  }
}
