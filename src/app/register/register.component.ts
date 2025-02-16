import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SignupService } from '../signup.service';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink, ReactiveFormsModule, NgIf],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'] // Fixed property name
})
export class RegisterComponent implements OnInit{
  ngOnInit(): void {
    localStorage.clear();
  }
  registerForm: FormGroup;

  constructor(private router: Router, private signup: SignupService, private toaster: ToastrService) {
    this.registerForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required]),
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(group: AbstractControl): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.toaster.warning("Please fill all fields correctly!");
      return;
    }

    const { username, password } = this.registerForm.value; // Extracting values from the form
    this.signup.signup(username, password).subscribe({
      next: (response) => {
        this.toaster.success("Registration Successful!");
        localStorage.clear();
        localStorage.setItem('username', username);
        this.router.navigate(['home']);
      },
      error: (error: HttpErrorResponse) => {
        this.toaster.error(`${error.error['message']}`);
      }
    });
  }
}
