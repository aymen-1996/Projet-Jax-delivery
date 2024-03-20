import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private shouldStartLoading = false;

  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  startLoading() {
    if (this.shouldStartLoading) {
      this.loadingSubject.next(true);

      timer(600).subscribe(() => {
        this.loadingSubject.next(false);
      });
    }

    this.shouldStartLoading = false;
  }

  setShouldStartLoading(value: boolean) {
    this.shouldStartLoading = value;
  }
}
