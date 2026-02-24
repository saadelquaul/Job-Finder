import { Component } from '@angular/core';
import { ProfileForm } from './profile-form/profile-form';

@Component({
  selector: 'app-profile',
  imports: [ProfileForm],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile { }
