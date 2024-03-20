import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UsersService } from 'src/app/Services/users.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.css']
})
export class AllUsersComponent {

  page = 1;
  limit = 10;
  totalItems = 0;
  users: any;
  userList: User[] = [];
  filteredUserList: User[] = [];
  pagedUserList: User[] | null = [];
  totalPages = 0;
  filterForm!: FormGroup;

  constructor(private userService: UsersService, private formBuilder: FormBuilder) {
    this.filterForm = this.formBuilder.group({
      email: [''],
      active: [''],
    });
  }

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers(): void {
    this.userService.getAllUser(this.page, this.totalItems, this.filterForm.value.email,this.filterForm.value.active).subscribe((users) => {
      this.userList = users.items;
      this.applyFilter();
    });
  }

  applyFilter(): void {
    const emailFilter = this.filterForm.value.email.toLowerCase();
    const activeFilter = this.filterForm.value.active.toLowerCase();
  
    this.filteredUserList = this.userList.filter((user) => {
      const matchesEmail = !emailFilter || user.email.toLowerCase().includes(emailFilter);
      const matchesActive = !activeFilter || user.active.toString().toLowerCase() === activeFilter;
  
      return matchesEmail && matchesActive;
    });
  
    this.totalItems = this.filteredUserList.length;
    this.totalPages = Math.ceil(this.totalItems / this.limit);
    this.changePage(1);
  
    if (this.totalItems === 0) {
      this.pagedUserList = null;
    }
  }
  
  updateActive(userId: number): void {

    this.userService.updateActive(userId).subscribe(response => {

      if (response.success) {

        console.log('User active status toggled successfully', response.user);

        const updatedUserIndex = this.filteredUserList.findIndex(user => user.id === userId);

        if (updatedUserIndex !== -1) {

          this.filteredUserList[updatedUserIndex].active = !this.filteredUserList[updatedUserIndex].active;

        }

        } else {

        console.error('Failed to toggle user active status', response.message);

      }

    });

  }

  
  changePage(newPage: number): void {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.page = newPage;
      this.pagedUserList = this.filteredUserList.slice((this.page - 1) * this.limit, this.page * this.limit);
    }
  }

  getPagesArray(): number[] {
    return new Array(this.totalPages).fill(0).map((_, index) => index + 1);
  }
}
