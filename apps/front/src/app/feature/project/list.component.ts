import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { SupabaseService } from '../../core/api/supabase.service';
import { from, map } from 'rxjs';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="bg-white dark:bg-gray-900">
      <div
        class="mx-auto grid max-w-screen-xl px-4 py-8 lg:grid-cols-12 lg:gap-8 lg:py-16 xl:gap-0"
      >
        <div class="mr-auto place-self-center lg:col-span-7">
          <h1
            class="mb-4 max-w-2xl text-4xl font-extrabold leading-none tracking-tight md:text-5xl xl:text-6xl dark:text-white"
          >
            App Store provided by Romain
          </h1>
          <p
            class="mb-6 max-w-2xl font-light text-gray-500 md:text-lg lg:mb-8 lg:text-xl dark:text-gray-400"
          >
            Share easily your apps with your friends and family
          </p>
          <a
            routerLink="/add"
            class="bg-primary-700 hover:bg-primary-800 focus:ring-primary-300 dark:focus:ring-primary-900 mr-3 inline-flex items-center justify-center rounded-lg px-5 py-3 text-center text-base font-medium text-white focus:ring-4"
          >
            Add a release
            <svg
              class="-mr-1 ml-2 h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </a>
        </div>
        <div class="hidden lg:col-span-5 lg:mt-0 lg:flex">
          <img src="app-store-real-image.webp" alt="mockup" />
        </div>
      </div>
    </section>
    <section>
      <div class="">
        @for(iosProject of iosProjects(); track iosProject.id){
        {{ iosProject | json }}
        <div
          class="flex items-center justify-between rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800 dark:text-white"
        >
          <div class="flex-1">
            {{ iosProject.name }}
            <button>download</button>
          </div>
          <div class="">
            {{ iosProject.version }}
          </div>
          <div class="">
            {{ iosProject.bundle }}
          </div>
        </div>
        } @empty {
        <div class="text-center dark:text-white">No data</div>
        }
      </div>
    </section>
  `,
})
export default class ListComponent {
  private readonly supabaseService = inject(SupabaseService);

  protected readonly iosProjects = toSignal(
    from(this.supabaseService.supabase.from('iosProject').select('*')).pipe(
      map((response) => response.data)
    )
  );

  // todo continue to download the files and find a way to pass the IPA adress to the manifest
}
