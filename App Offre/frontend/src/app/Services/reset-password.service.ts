import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {

  constructor(private http: HttpClient) {}

  requestPasswordReset(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${environment.backendHost}/api/request-password-reset`,{ email }
    );
  }

  resetPassword(email: string,resetCode: number,newPassword: string,
  ): Observable<{ message: string }> { return this.http.post<{ message: string }>(`${environment.backendHost}/api/reset-password`,
  { email, resetCode, newPassword }
    );
  }
}
