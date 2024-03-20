import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';
import { Constant } from '../navbar/constant';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  menus: any = [] = Constant.menus;
  filteredMenus: any[] = [];
  roles: string[] = [];
  users: any;

  selectedMenu: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.users = JSON.parse(localStorage.getItem('currentUser') as string);
    this.getUserById(this.users.user.id);
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getUserById(id: number): void {
    this.authService.findUserById(id).subscribe(
      (user) => {
        console.log('User:', user);
        if (user && user.role) {
          this.roles = [user.role];
          console.log('role:', this.roles);
          this.menus.forEach((element: any) => {
            const isRole = element.roles.find((role: any) => this.roles.includes(role));
            if (isRole !== undefined) {
              this.filteredMenus.push(element);
            }
          });
        }
      },
      (error) => {
        console.error('Error fetching user:', error);
      }
    );
  }
}
