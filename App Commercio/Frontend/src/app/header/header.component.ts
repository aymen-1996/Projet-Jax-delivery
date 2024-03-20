import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  users:any


ngOnInit(): void {
  this.users = JSON.parse(localStorage.getItem('currentUser') as string);


}

}
