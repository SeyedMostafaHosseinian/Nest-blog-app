import { UserService } from './../../services/user.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent {
  loginForm!: FormGroup;
  loading = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly userService: UserService,
    private readonly router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['admin-admin@gmail.com'],
      password: ['adminadmin'],
    });
  }

  login() {
    this.loading = true;
    const loginData = this.loginForm.getRawValue();
    this.userService
      .login(loginData?.email, loginData?.password)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: (response) => {
          if (response?.user.token) {
            const now = new Date();
            const time = now.getTime();
            const expireTime = time + 365 * 360000000;
            now.setTime(expireTime);

            const tokenCookie =
              'accessToken=' +
              response.user.token +
              ';' +
              'Expires=' +
              now.toUTCString();
              console.log(tokenCookie)
            document.cookie = tokenCookie;
            localStorage.setItem('user', JSON.stringify(response.user));
            this.router.navigateByUrl('/');
          }
        },
        error(err) {
        },
      });
  }
}
