import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../../../core/services/auth-service';

@Component({
  selector: 'app-register-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register-form.html',
  styleUrl: './register-form.css',
})
export class RegisterForm {
  registerForm: FormGroup;
  errorMessage = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';

    const userData = this.registerForm.value;

    // Check if email already exists
    this.authService.checkEmailExists(userData.email).subscribe({
      next: (exists) => {
        if (exists) {
          this.loading = false;
          this.errorMessage = 'Cet email est déjà utilisé';
          return;
        }

        this.authService.register(userData).subscribe({
          next: () => {
            this.loading = false;
            this.router.navigate(['/login']);
          },
          error: (err) => {
            this.loading = false;
            this.errorMessage = err.message || "Erreur lors de l'inscription";
          },
        });
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.message || 'Erreur de vérification';
      },
    });
  }

}
