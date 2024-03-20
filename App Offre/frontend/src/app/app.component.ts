import { Component, ElementRef } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { LoadingService } from './Services/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Jaxapp';
  loading$ = this.loadingService.loading$;
  private destroy$ = new Subject<void>();

  constructor(private loadingService: LoadingService, private router: Router, private el: ElementRef) {
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      const clickedElement = document.activeElement;
      const isInput = clickedElement instanceof HTMLInputElement || clickedElement instanceof HTMLTextAreaElement;
      const isLiElement = clickedElement instanceof HTMLLIElement;

      this.loadingService.setShouldStartLoading(!(isInput || isLiElement));

      this.loadingService.startLoading();
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onLinkClick() {
    this.loadingService.startLoading();
  }
}
