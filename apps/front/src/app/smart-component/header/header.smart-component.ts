import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthStore } from '../../core/auth/auth.store';
import { SupabaseService } from '../../core/api/supabase.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header-smart-component',
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` <header>
    <nav class="border-gray-200 bg-white px-4 py-2.5 lg:px-6 dark:bg-gray-800">
      <div
        class="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between"
      >
        <span
          (click)="router.navigate(['/'])"
          (keydown)="handleKeyDownTitle($event)"
          tabindex="0"
          class="self-center whitespace-nowrap text-xl font-semibold dark:text-white"
          >App Store</span
        >
        <div class="flex items-center lg:order-2">
          <span
            class="mr-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-300 lg:px-5 lg:py-2.5 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-800"
          >
            {{ authStore.userName$ | async }}
          </span>
          <a
            (click)="logOut()"
            (keydown)="handleKeyDown($event)"
            tabindex="0"
            class="bg-primary-700 hover:bg-primary-800 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 mr-2 rounded-lg px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-4 lg:px-5 lg:py-2.5"
            >Log out</a
          >
        </div>
      </div>
    </nav>
  </header>`,
})
export class HeaderSmartComponent {
  protected readonly authStore = inject(AuthStore);
  protected readonly router = inject(Router);
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      this.logOut();
    }
  }

  private readonly supabaseService = inject(SupabaseService);
  logOut() {
    this.supabaseService.signOut();
  }
  handleKeyDownTitle(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      this.router.navigate(['/']);
    }
  }
}
