// angular import
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { admin } from 'src/app/models/admin/admin';
import { AdminService } from 'src/app/service/admin.service';
import * as ngxCookieService from 'ngx-cookie-service'; 


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {  loading = false;
  submitted = false;
  error: boolean=false;
  formUser!: FormGroup
  formReg!: FormGroup;
  user!: admin;
  affichageErreu: boolean = false;
  affichageErreu1: boolean = false;
  returnUrl!: string;

  successMessage: string = ''
  errorMessage: string = ''

  successMessagereg: string = ''
  errorMessagereg: string = ''

  cdr: any;

  
  constructor(private _dataLoggedin: AdminService,private authService: AdminService,private cookieService: ngxCookieService.CookieService, private formBuilder: FormBuilder,private fb:FormBuilder, private activatedRoute: ActivatedRoute, private router: Router) {
  
    if (this.authService.currentUserValue ) {
      this.router.navigate(['/dashboard/default']);
    }


  }

  ngOnInit(): void {

    this.formUser = this.formBuilder.group({

      email:'',

      password: '',
    });

    this.formReg = this.fb.group({
      matriculeFiscale: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      password: ['', Validators.required],
      role: ['', Validators.required],
    });
  }
 
  login() {
    this.authService.login(this.formUser.value.email, this.formUser.value.password).subscribe(
      (response) => {
        if (response.adminn || response.user) {

          localStorage.setItem('user', JSON.stringify(response));
          console.log(response)
  if(response.adminn){     
     this._dataLoggedin.logedin="admin"
     console.log(this._dataLoggedin.logedin)
      this.router.navigate(['/dashboard/default']);
}
if(response.user){       
  this._dataLoggedin.logedin="user"
  console.log(this._dataLoggedin.logedin)
     this.router.navigate(['/dashboard/default']);
    //zid path ki user ya3mel login
}
        } else {
          this.errorMessage = response.message;
          console.error('Unexpected response format:', response);
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }
  
  registerUser() {
    this.authService.registerUser(this.formReg.value).subscribe(
      (response) => {
        this.successMessagereg = 'User registered successfully!';
        console.log('User registered successfully:', response);
        this.errorMessagereg = '' 

        this.formReg.reset({});
      },
      (error) => {
        console.error('Registration error:', error);
  
        this.errorMessagereg = error 
      }
    );
  }
  

}
