import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';
import { AuthService } from '../Services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    const token = this.authService.getToken();

    if (!token) {
      this.router.navigateByUrl('/login');
      return of(false);
    }

    return this.authService.verifyToken(token).pipe(
      catchError(() => {
        console.log('Error in verifyToken');
        this.router.navigateByUrl('/login');
        return of(false);
      }),
      switchMap((result) => {
        console.log('SwitchMap result:', result);

        if (result === true || (result && result.isValid)) {
          return this.authService.isUserActive(this.authService.getEmail()).pipe(
            map(userActiveResult => {
              if (userActiveResult.isActive) {
                console.log(' result:', userActiveResult);
                return true;
              } else {
                this.router.navigateByUrl('/login');
                return false;
              }
            }),
            catchError(() => {
              this.router.navigateByUrl('/login');
              return of(false);
            })
          );
        } else {
          this.router.navigateByUrl('/login');
          return of(false);
        }
      })
    );
  }
}
