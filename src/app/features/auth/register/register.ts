import { Component } from '@angular/core';
import {RegisterForm} from './register-form/register-form';

@Component({
  selector: 'app-register',
  imports: [RegisterForm],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

}
