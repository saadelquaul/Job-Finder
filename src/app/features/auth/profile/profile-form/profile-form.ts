import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth-service';
import { User } from '../../../../core/models/user.model';

@Component({
  selector: 'app-profile-form',
  imports: [ReactiveFormsModule],
  templateUrl: './profile-form.html',
  styleUrl: './profile-form.css',
})
export class ProfileForm implements OnInit {
 private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  currentUser = signal<User | null>(null);
  loading = signal(false);
  successMessage = signal('');
  errorMessage = signal('');

  profileForm = this.fb.nonNullable.group({
    nom: ['', [Validators.required, Validators.minLength(2)]],
    prenom: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.minLength(6)]],
  });

  ngOnInit(): void {
    const user = this.authService.currentUser;
    if (user) {
      this.currentUser.set(user);
      this.profileForm.patchValue({
        nom: user.lastName,
        prenom: user.firstName,
        email: user.email,
      });
    }
  }

  onSubmit(): void {
    if (this.profileForm.invalid) return;

    const user = this.currentUser();
    if (!user?.id) return;

    this.loading.set(true);
    this.clearMessages();

    const { password, ...formValue } = this.profileForm.getRawValue();
    const payload: User = {
      ...user,
      ...formValue,
      ...(password ? { password } : {}),
    };

    if(payload.password == null) payload.password = user.password;

    this.authService.updateProfile(payload).subscribe({
      next: (updatedUser) => {
        this.currentUser.set(updatedUser);
        this.loading.set(false);
        this.successMessage.set('Profil mis à jour avec succès');
        this.profileForm.controls.password.reset();
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err.message || 'Erreur lors de la mise à jour');
      },
    });
  }

  deleteAccount(): void {
    const user = this.currentUser();
    if (!user?.id) return;

    const confirmed = confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.');
    if (!confirmed) return;

    this.clearMessages();

    this.authService.deleteAccount(user.id).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errorMessage.set(err.message || 'Erreur lors de la suppression');
      },
    });
  }

  hasError(field: string): boolean {
    const control = this.profileForm.get(field);
    return !!(control?.touched && control?.errors);
  }

  private clearMessages(): void {
    this.successMessage.set('');
    this.errorMessage.set('');
  }
}
