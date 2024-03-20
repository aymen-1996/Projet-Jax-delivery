import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit{

  isCollapsed = false;
  COMERCIO= false;

  sidebarWidth = 200; // Initial width of the sidebar
  ngOnInit(): void {
    
  }
  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
   
    this.updateSidebarWidth();

    setTimeout(() => {
      this.COMERCIO=!this.COMERCIO;
        }, 250);
  }


  updateSidebarWidth() {
    this.sidebarWidth = this.isCollapsed ? 100 : 200; // Adjust collapsed and expanded widths as needed
  }
}
