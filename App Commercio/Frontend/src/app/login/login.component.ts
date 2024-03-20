import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import * as alertify from 'alertifyjs';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  hide = true;
  formUser!: FormGroup;
  constructor(private authService: AuthService ,private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private router: Router){
    this.formUser = this.formBuilder.group({

      email:['', [Validators.required, Validators.email]],

      password:['', Validators.required],
    });


    if (this.authService.currentUserValue ) {
      this.router.navigate(['/performance']);
    }

  }
  errorMessage: string = '';
  
  

  ngOnInit(): void {

  
  }

    login(){
      this.authService.login(this.formUser.value.email, this.formUser.value.password).subscribe(
        (response) => {
          if ( response.user) {
                this.authService.setLoggedInAdmin(response);
            localStorage.setItem('user', JSON.stringify(response));
            console.log(response)
  if(response.user){       
    alertify.set('notifier', 'position', 'top-right');
    alertify.notify('login sucess', 'success', 10);
       this.router.navigate(['/performance']);
      //zid path ki user ya3mel login
  }
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: "Il semble que vous n''ayez pas accès.",
            })
            this.errorMessage = response.message;
            console.error('Unexpected response format:', response);
          }
        },
        (error) => {
          console.error(error);
        }
      );
    }

  }



