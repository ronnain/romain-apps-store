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

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  template: `<section class="bg-gray-50 dark:bg-gray-900 min-h-screen">
    <div
      class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0"
    >
      <div
        class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
      >
        <span>Romain Apps Store</span>
      </div>
      <div
        class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700"
      >
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
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
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Your email</label
              >
              <input
                type="email"
                name="email"
                id="email"
                class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="name@company.com"
                formControlName="email"
              />
            </div>
            <div>
              <label
                for="password"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Password</label
              >
              <input
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                formControlName="password"
              />
            </div>
            <button
              type="submit"
              class="w-full text-gray-900 bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
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

  constructor() {
    this.supabaseService.authChange$.subscribe((data) => {
      console.log('data', data);
      if (data.event === 'SIGNED_IN') {
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
