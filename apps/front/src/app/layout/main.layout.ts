import { Component, inject } from '@angular/core';
import { HeaderSmartComponent } from '../smart-component/header/header.smart-component';
import { Router, RouterModule } from '@angular/router';
import { AuthStore } from '../core/auth/auth.store';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterModule, HeaderSmartComponent, RouterModule],
  host: { class: 'block min-h-[100vh] bg-gray-50 dark:bg-gray-900' },
  template: ` <app-header-smart-component />
    <router-outlet></router-outlet>`,
})
export default class MainLayout {
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);

  constructor() {
    this.authStore.isAuth$.subscribe((isAuth) => {
      if (!isAuth) {
        this.router.navigate(['login']);
      }
    });
  }
}
