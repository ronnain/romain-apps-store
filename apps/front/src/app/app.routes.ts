import { inject } from '@angular/core';
import { Route, Router } from '@angular/router';
import { SupabaseService } from './core/api/supabase.service';
import { map } from 'rxjs/operators';

export const appRoutes: Route[] = [
  {
    path: 'login',
    loadComponent: () => import('./feature/auth/login.component'),
  },
  {
    path: '',
    canActivate: [
      () => {
        const router = inject(Router);
        return inject(SupabaseService).authChange$.pipe(
          map(({ event }) => event === 'SIGNED_IN'),
          map((isSignedIn) => {
            if (!isSignedIn) {
              router.navigate(['login']);
            }
            return isSignedIn;
          })
        );
      },
    ],
    children: [
      {
        path: 'project-list',
        loadComponent: () => import('./feature/project/list.component'),
      },
      {
        path: 'add',
        loadComponent: () => import('./feature/project/add.component'),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
