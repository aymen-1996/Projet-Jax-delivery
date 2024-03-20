import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Input() isCollapsed!: boolean;
  @Input() COMERCIO!: boolean;
  @Output() toggleSidebar = new EventEmitter<void>();


  
  constructor(private authservice: AuthService, private route:Router ){ }
  // Call this method to emit the event
  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }


  logout() {
    this.authservice.logout();
     this.authservice.clearLoggedInAdmin();
     this.route.navigate(['']);
    // Add the logic to perform logout here.
    // For example, you can clear user authentication state, navigate to the login page, etc.
    console.log('Logout clicked!');
  }
}
