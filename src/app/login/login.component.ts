import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true, // Enables the use of imports in Angular v14+
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule], // FIXED
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  showPassword: boolean = false;
  isDarkMode: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toaster: ToastrService
  ) {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });

    this.isDarkMode = localStorage.getItem('darkMode') === 'true';
  }

  ngOnInit(): void {
    localStorage.clear();
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('darkMode', String(this.isDarkMode));
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      this.authService.login(username, password).subscribe({
        next: (response) => {
          localStorage.setItem('username', username);
          this.toaster.success('Login successful');
          this.router.navigate(['home']);
        },
        error: (error: HttpErrorResponse) => {
          this.toaster.error(error.error.message || 'Login failed');
        },
      });
    } else {
      this.toaster.error('Please fill in all required fields correctly.');
    }
  }
}