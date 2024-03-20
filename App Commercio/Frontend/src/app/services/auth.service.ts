import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject: BehaviorSubject<User>;
  public currentadmin: Observable<User>;
  private loggedInAdmin: any;

  constructor(private http: HttpClient ) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')!));
    this.currentadmin = this.currentUserSubject.asObservable();
    const adminData = sessionStorage.getItem('currentUser');
    if (adminData) {
      this.loggedInAdmin = JSON.parse(adminData);
    }
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  setLoggedInAdmin(admin: any) {
    this.loggedInAdmin = admin;
    sessionStorage.setItem('currentUser', JSON.stringify(admin));
  }

  getLoggedInAdmin() {
    return this.loggedInAdmin;
  }

  clearLoggedInAdmin() {
    this.loggedInAdmin = null;
    sessionStorage.removeItem('currentUser');
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
  // Utiliser delete au lieu de removeItem
    this.currentUserSubject.next(null!);
    
  }
}
