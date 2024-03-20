import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { environment } from '../environments/environment';

import { BehaviorSubject, Observable } from 'rxjs';
import { admin } from '../models/admin/admin';
import { CookieService } from 'ngx-cookie-service';
import { commerial } from '../models/commercial/commercial/user';
import { client } from '../models/client/client/client';


@Injectable({ providedIn: 'root'})
export class AdminService {

  private currentUserSubject: BehaviorSubject<admin>;
  public currentadmin: Observable<admin>;
    provider: any;
logedinuser!:commerial ;
logedin!:string ;
  constructor(private http: HttpClient ,private cookieService: CookieService) {
    this.currentUserSubject = new BehaviorSubject<admin>(JSON.parse(localStorage.getItem('currentUser')!));
    this.currentadmin = this.currentUserSubject.asObservable();
  }
  token: string = '';
  refreshToken: string = '';
  role: string = '';
  admins!:admin

  setToken(token: string, refreshToken: string, role: string) {
    this.token = token;
    this.refreshToken = refreshToken;
    this.role = role;
  }
  

  public get currentUserValue(): admin {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string): Observable<any> {
    const body = { email, password };
    
    return this.http.post(`${environment.backendHost}/auth/login`, body).pipe(
      map((user: any) => {
        if (user) {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }
        return user;
      })
    );;
  }

  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('user');

    this.cookieService.delete('jwt'); // Utiliser delete au lieu de removeItem
    this.currentUserSubject.next(null!);
    
  }


  registerUser(user: any): Observable<any> {
    return this.http.post(`${environment.backendHost}/api/register1`, user);
  }
}
