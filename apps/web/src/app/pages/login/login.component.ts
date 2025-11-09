import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  error: string | null = null;
  form = this.fb.nonNullable.group({
    email: ['owner@gym.test', [Validators.required, Validators.email]],
    password: ['ChangeMe123!', [Validators.required, Validators.minLength(6)]],
  });

  submitting = false;

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting = true;
    this.auth.login(this.form.getRawValue()).subscribe({
      next: () => {
        this.error = null;
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.error = 'Login failed. Check your credentials.';
        this.submitting = false;
      },
    });
  }
}
