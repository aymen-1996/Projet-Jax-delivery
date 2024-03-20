import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ForgetpasswordService {

  constructor(private http: HttpClient) {}

  forgetPassword(email: string): Observable<any> {
    const endpoint = `${environment.backendHost}/user/forget-password`;

    const body = { email };

    return this.http.post<any>(endpoint, body);
  }
}
