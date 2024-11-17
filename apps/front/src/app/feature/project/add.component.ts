import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SupabaseService } from '../../core/api/supabase.service';
import { forkJoin, from, switchMap } from 'rxjs';
import { generateManifestContent } from './manifest.util';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <section class="bg-white dark:bg-gray-900">
      <div class="mx-auto max-w-2xl px-4 py-8 lg:py-16">
        <h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          Add a new IOS project with IPA
        </h2>
        <p class="mb-6 text-gray-500 dark:text-gray-400">
          Fill the form to add a new IPA with a generated manifest
        </p>
        <form #form [formGroup]="iosProject" (ngSubmit)="onSubmit()">
          <div class="grid gap-4 sm:grid-cols-2 sm:gap-6">
            <div class="sm:col-span-2">
              <label
                for="name"
                class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >Project Name</label
              >
              <input
                type="text"
                name="name"
                id="name"
                formControlName="name"
                class="focus:ring-primary-600 focus:border-primary-600 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                placeholder="pet-owner-chat"
              />
            </div>
            <div class="w-full">
              <label
                for="bundle"
                class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >Bundle</label
              >
              <input
                type="text"
                name="bundle"
                id="brand"
                class="focus:ring-primary-600 focus:border-primary-600 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                placeholder="fr.happypets.app"
                formControlName="bundle"
              />
            </div>
            <div class="w-full">
              <label
                for="version"
                class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >Version</label
              >
              <input
                type="text"
                name="version"
                id="version"
                class="focus:ring-primary-600 focus:border-primary-600 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                placeholder="0.1.0"
                formControlName="version"
              />
            </div>
            <!-- file input -->
            <div class="w-full">
              <label
                for="file"
                class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >IPA</label
              >
              <input
                type="file"
                name="file"
                id="file"
                (change)="onFileChange($event)"
                class="focus:ring-primary-600 focus:border-primary-600 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              />
            </div>
          </div>

          <button
            type="submit"
            class="bg-primary-700 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800 mt-4 inline-flex items-center rounded-lg px-5 py-2.5 text-center text-sm font-medium text-black focus:ring-4 sm:mt-6 dark:text-white"
          >
            Add project
          </button>
        </form>
      </div>
    </section>
  `,
})
export default class DetailsComponent {
  // !remember to add policies in supabase storage to enbale upload
  private readonly supabaseService = inject(SupabaseService);
  protected readonly iosProject = new FormGroup({
    name: new FormControl('pet-owner-chat', [Validators.required]),
    version: new FormControl('0.1.0', [Validators.required]),
    bundle: new FormControl('fr.happypets.app', [Validators.required]),
    ipaFile: new FormControl<File | undefined>(undefined, [
      Validators.required,
    ]),
  });

  onSubmit() {
    console.log('this.iosProject', typeof this.iosProject.value.ipaFile);
    const iosProject = this.iosProject;
    if (iosProject.invalid) {
      console.error('form invalid', iosProject.errors);
      return;
    }
    const { name, version, bundle } = iosProject.value;
    const file = iosProject.get('ipaFile')?.value;
    if (!name || !version || !bundle || !file) {
      console.error('form invalid', iosProject.errors);
      return;
    }

    const manifest = generateManifestContent('', {
      name,
      version,
      bundleId: bundle,
    });

    forkJoin({
      manifest: this.supabaseService.supabase.storage
        .from('ios-projects')
        .upload(`private/${name}/${version}/manifest.plist`, manifest, {
          upsert: true,
        }),
      upload: this.supabaseService.supabase.storage
        .from('ios-projects')
        .upload(`private/${name}/${version}/ipa.ipa`, file, { upsert: true }),
      data: this.supabaseService.supabase.from('iosProject').insert({
        name,
        version,
        bundle,
      }),
    }).subscribe((result) => {
      console.log('result', result);
    });
  }

  // generateManifestContent
  protected readonly onFileChange = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      const uploadedFile = input.files[0];
      this.iosProject.patchValue({
        ipaFile: uploadedFile, // Met à jour la valeur du contrôle
      });
    }
  };
}
