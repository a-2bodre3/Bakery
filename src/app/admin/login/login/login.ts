import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from '@angular/common';
import {AuthService} from '../../../core/services/auth-service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  loginForm: FormGroup;
  authService =inject(AuthService)
  router = inject(Router);

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      try {

        console.log("test1");
        const {username, password} = this.loginForm.value;
        console.log("test2");
        const result = await this.authService.signIn(username, password);
        console.log("test3");
        this.router.navigate(['admin/dashboard']);
        console.log("loggin success", result);

      }catch (error) {
        console.error(error);
        alert(error);
      }
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
