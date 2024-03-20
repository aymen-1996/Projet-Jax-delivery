import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ResetPasswordService } from 'src/app/Services/reset-password.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {

  email!: string;
  resetCode!: number;
  newPassword!: string;
  step: number = 1;
  successMessage: string = '';
  errorMessage: string = ''; 

  constructor(private passwordResetService: ResetPasswordService ,private router:Router) {}

  requestPasswordReset() {
    if (!this.email || this.email.trim() === '') {
      this.errorMessage = 'Please enter a valid email address';
      return;
    }
   this.errorMessage = '';
    this.passwordResetService.requestPasswordReset(this.email).subscribe(
        (response) => {
          this.successMessage = response.message;
          setTimeout(() => {
            this.successMessage = ''; 
            this.step = 2;
          }, 2000);
        },
        (error) => {
          console.error('Error:', error);
          this.errorMessage = 'Email not found';
          this.successMessage = ''; 
        }
      );
  }
  

resetPassword() {
  this.errorMessage = '';
  this.passwordResetService.resetPassword(this.email,this.resetCode,this.newPassword,).subscribe(
      (response) => {
        console.log(response.message);
        this.successMessage = 'Password changed successfully';
        setTimeout(() => {
          this.successMessage = '';
      this.router.navigateByUrl("/login")
        }, 2000);
      },
      (error) => {
        console.error('Error:', error);
          this.errorMessage = 'Incorrect reset code';
          this.successMessage = '';
      }
    );
}
}