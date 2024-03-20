import { Component } from '@angular/core';
import {AdminService} from '../../../../../service/admin.service';

@Component({
  selector: 'app-nav-right',
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss']
})
export class NavRightComponent {
  constructor(private adminService: AdminService) {}

  // public method
  logout() {
    this.adminService.logout();

    // Add the logic to perform logout here.
    // For example, you can clear user authentication state, navigate to the login page, etc.
    console.log('Logout clicked!');
  }

  profile = [
    
    {
      icon: 'ti ti-power',
      title: 'Logout'
    }
  ];

  setting = [
    {
      icon: 'ti ti-help',
      title: 'Support'
    },
    {
      icon: 'ti ti-user',
      title: 'Account Settings'
    },
    {
      icon: 'ti ti-lock',
      title: 'Privacy Center'
    },
    {
      icon: 'ti ti-messages',
      title: 'Feedback'
    },
    {
      icon: 'ti ti-list',
      title: 'History'
    }
  ];
}
