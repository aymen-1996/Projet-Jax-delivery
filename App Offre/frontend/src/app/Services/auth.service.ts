import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';


import { environment } from 'src/environments/environment';
import { User } from '../models/user';
import { CookieService } from 'ngx-cookie-service';



@Injectable({ providedIn: 'root' })
export class AuthService {

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
    provider: any;

  constructor(private http: HttpClient ,private cookieService: CookieService) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')!));
    this.currentUser = this.currentUserSubject.asObservable();
  }
  token: string = '';
  refreshToken: string = '';
  role: string = '';
  users!:User

  setToken(token: string, refreshToken: string, role: string) {
    this.token = token;
    this.refreshToken = refreshToken;
    this.role = role;
  }
  

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string): Observable<any> {
    const body = { email, password };
  
    return this.http.post(`${environment.backendHost}/api/login`, body).pipe(
      map((user: any) => {
        if (user && user.token) {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }
        return user;
      })
    );
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.cookieService.delete('jwt'); // Utiliser delete au lieu de removeItem
    this.currentUserSubject.next(null!);
  }


  registerUser(user: any): Observable<any> {
    return this.http.post(`${environment.backendHost}/api/register1`, user);
  }

  getStoredUser(): User | null {
    return JSON.parse(localStorage.getItem('currentUser') as string);
  }
  

  getToken(): string {
    const storedUser = this.getStoredUser();
    return storedUser?.token ?? '';
  }
  
  getEmail(): string {
    const storedUser = JSON.parse(localStorage.getItem('currentUser') as string);
    return storedUser ? storedUser.user.email: '';
  }
  

  verifyToken(token: string): Observable<{ isValid: boolean }> {
    const endpoint = `${environment.backendHost}/api/verify-token/${token}`;
    return this.http.get<{ isValid: boolean }>(endpoint);
  }

  isUserActive(email: string): Observable<{ isActive: boolean }> {
    const endpoint = `${environment.backendHost}/api/${email}/isActive`;

    return this.http.get<{ isActive: boolean }>(endpoint).pipe(
      map((userActiveResult) => {
        console.log('User active result:', userActiveResult);
        return userActiveResult;
      })
    );
  }

  findUserById(id: number): Observable<any> {
    const url = `${environment.backendHost}/api/finduser/${id}`;
    return this.http.get(url);
  }
}
