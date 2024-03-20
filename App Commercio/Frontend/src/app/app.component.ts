import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'commercial';
  constructor( public  _router: Router,private authService:AuthService) { }
  isCollapsed = false;
  COMERCIO= false;

  sidebarWidth = 300; // Initial width of the sidebar
  ngOnInit() {
    this.isLoggedIn();
    //
  }
  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
   
    this.updateSidebarWidth();

    setTimeout(() => {
      this.COMERCIO=!this.COMERCIO;
        }, 250);
  }


  updateSidebarWidth() {
    this.sidebarWidth = this.isCollapsed ? 200 : 300; // Adjust collapsed and expanded widths as needed
  }

  isLoggedIn(): boolean {
    // Implement your authentication logic here
    const loggedInAdmin = this.authService.getLoggedInAdmin();
    return loggedInAdmin !== null && loggedInAdmin !== undefined;
  }

}
