import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { AuthService } from 'src/app/Services/auth.service';
import { User } from 'src/app/models/user';
import { CookieService } from 'ngx-cookie-service'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loading = false;
  submitted = false;
  error: boolean=false;
  formUser!: FormGroup
  formReg!: FormGroup;
  user!: User;
  affichageErreu: boolean = false;
  affichageErreu1: boolean = false;
  returnUrl!: string;

  successMessage: string = ''
  errorMessage: string = ''

  successMessagereg: string = ''
  errorMessagereg: string = ''

  cdr: any;

  constructor(private authService: AuthService,private cookieService: CookieService, private formBuilder: FormBuilder,private fb:FormBuilder, private activatedRoute: ActivatedRoute, private router: Router) {
  
    if (this.authService.currentUserValue ) {
      this.router.navigate(['/Accueil']);
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
 
  userauth() {
    this.authService.login(this.formUser.value.email, this.formUser.value.password).subscribe(
      (response) => {
        if (response && response.token) {
          this.cookieService.set('jwt', response.token as string);
          this.router.navigate(['/Accueil']);
        } else {
this.errorMessage=response.message
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
