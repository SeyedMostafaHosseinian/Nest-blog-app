import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, ReplaySubject, of, tap } from 'rxjs';
import { UserInterface } from 'src/types/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private readonly http: HttpClient,
    private readonly router: Router
  ) {}
  user = new ReplaySubject<UserInterface | null>();

  login(email: string, password: string): Observable<any> {
    const body = {
      user: {
        email,
        password,
      },
    };
    return this.http.post('http://localhost:3000/users/login', body).pipe(
      tap((r: any) => {
        this.user.next(r.user);
      })
    );
  }

  logout() {
    localStorage.removeItem('user');
    document.cookie = 'accessToken=null;Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    this.user.next(null);
    this.router.navigateByUrl('/')
  }

  getUser() {
    return JSON.parse(localStorage.getItem('user') as string);
  }
}
