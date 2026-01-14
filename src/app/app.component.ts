import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { HeaderComponent } from './shared/components/header/header.component';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet, HeaderComponent],
})
export class AppComponent {
  private router = inject(Router);

  // Create a signal to track the current URL
  currentUrl = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    )
  );

  constructor() { }

  get showHeader(): boolean {
    return this.router.url !== '/login' && this.router.url !== '/';
  }
}
