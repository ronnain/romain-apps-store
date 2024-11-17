import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { SupabaseService } from '../../core/api/supabase.service';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthStore } from '../../core/auth/auth.store';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  template: `<section class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div
      class="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0"
    >
      <div
        class="mb-6 flex items-center text-2xl font-semibold text-gray-900 dark:text-white"
      >
        <span>Romain Apps Store</span>
      </div>
      <div
        class="w-full rounded-lg bg-white shadow sm:max-w-md md:mt-0 xl:p-0 dark:border dark:border-gray-700 dark:bg-gray-800"
      >
        <div class="space-y-4 p-6 sm:p-8 md:space-y-6">
          <h1
            class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
          >
            Sign in to your account
          </h1>
          <form
            class="space-y-4 md:space-y-6"
            [formGroup]="signInForm"
            (ngSubmit)="signInWithEmail(signInForm.value, signInForm.valid)"
          >
            <div>
              <label
                for="email"
                class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >Your email</label
              >
              <input
                type="email"
                name="email"
                id="email"
                class="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                placeholder="name@company.com"
                formControlName="email"
              />
            </div>
            <div>
              <label
                for="password"
                class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >Password</label
              >
              <input
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                class="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                formControlName="password"
              />
            </div>
            <button
              type="submit"
              class="bg-primary-600 hover:bg-primary-700 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 w-full rounded-lg px-5 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>`,
})
export default class LoginComponent {
  private readonly supabaseService = inject(SupabaseService);
  private readonly router = inject(Router);
  private readonly authStore = inject(AuthStore);

  constructor() {
    this.authStore.isAuth$.subscribe((isAuth) => {
      if (isAuth) {
        this.router.navigate(['project-list']);
      }
    });
  }

  signInForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  async signInWithEmail(
    data: Partial<{ email: string | null; password: string | null }>,
    valid: boolean
  ) {
    console.log('data', data, valid);
    if (!valid || !data.email || !data.password) {
      return;
    }
    const result = await this.supabaseService.signInWithEmail(
      data.email,
      data.password
    );
    console.log('result', result);
  }
}
