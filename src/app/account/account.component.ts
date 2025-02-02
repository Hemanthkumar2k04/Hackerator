import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgIf } from '@angular/common';
@Component({
  selector: 'app-account',
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent {
  resetPasswordForm: FormGroup;
  constructor(private router: Router, private authService: AuthService, private toaster: ToastrService){
    if(!this.authService.isAuthenticated()){this.router.navigate(['login']);}
    this.resetPasswordForm = new FormGroup({
      oldPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }
  onSubmit(){
    if(this.resetPasswordForm.valid){
      const {oldPassword, newPassword} = this.resetPasswordForm.value;
      if(this.authService.isAuthenticated()){
        const username= localStorage.getItem('username');
        if(username==null){return;}
        this.authService.resetPassword(username, oldPassword, newPassword).subscribe({
          next: (response) =>{
            this.toaster.success("Password reset successful");
            console.log("reset complete.");
            this.router.navigate(['login']);
          },
          error: (error: HttpErrorResponse) =>{
            this.toaster.error(error.error.message||'Reset failed!');
            console.log(error);
          }
        })
      }
      else{
        this.router.navigate(['login']);
        this.toaster.warning('Login to reset the password!');
      }
    }
  }
}
