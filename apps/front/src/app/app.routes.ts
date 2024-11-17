import { inject } from '@angular/core';
import { Route, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { AuthStore } from './core/auth/auth.store';

export const appRoutes: Route[] = [
  {
    path: 'login',
    canActivate: [
      () => {
        const router = inject(Router);
        return inject(AuthStore).isAuth$.pipe(
          take(1),
          map((isAuth) => {
            if (isAuth) {
              router.navigate(['']);
            }
            return true;
          })
        );
      },
    ],
    loadComponent: () => import('./feature/auth/login.component'),
  },
  {
    path: '',
    canActivate: [
      () => {
        const router = inject(Router);
        return inject(AuthStore).isAuth$.pipe(
          // it returns false for the first time, when the page just loaded, maybe add a isLoading state to the store
          map((isSignedIn) => {
            if (!isSignedIn) {
              router.navigate(['login']);
            }
            return true;
          })
        );
      },
    ],
    loadComponent: () => import('./layout/main.layout'),
    children: [
      {
        path: 'project-list',
        loadComponent: () => import('./feature/project/list.component'),
      },
      {
        path: 'add',
        loadComponent: () => import('./feature/project/add.component'),
      },
      {
        path: '',
        redirectTo: 'project-list',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
