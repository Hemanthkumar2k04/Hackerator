import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, ReactiveFormsModule, NgIf, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'], // Fixed typo from styleUrl to styleUrls
})
export class LoginComponent implements OnInit{
  ngOnInit(): void {
    localStorage.clear();
  }
  loginForm: FormGroup;
  showPassword: Boolean = false;

  constructor(private authService: AuthService, private router: Router, private toaster: ToastrService) {
    // Define reactive form structure
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }
  togglePasswordVisibility() {
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    const eyeIcon = document.getElementById('eyeIcon');
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      eyeIcon?.setAttribute('stroke', '#0066cc'); // Change color (optional)
    } else {
      passwordInput.type = 'password';
      eyeIcon?.setAttribute('stroke', '#888'); // Reset color
    }
  }
  

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value; // Destructure form values
      this.authService.login(username, password).subscribe({
        next: (response) => {
          localStorage.setItem('username', username);
          this.toaster.success('Login successful');
          console.log('Login response:', response);
          this.router.navigate(['home']);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Login error:', error);
          this.toaster.error(error.error.message || 'Login failed'); // Display error message
        },
      });
    } else {
      this.toaster.error('Please fill in all required fields correctly.');
    }
  }
}
