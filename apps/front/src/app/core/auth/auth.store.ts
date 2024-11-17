import { inject, InjectionToken } from '@angular/core';
import { adapt } from '@state-adapt/angular';
import { createAdapter } from '@state-adapt/core';
import { AuthSession } from '@supabase/supabase-js';
import { SupabaseService } from '../api/supabase.service';
import { toSource } from '@state-adapt/rxjs';
import { map, filter } from 'rxjs';

type AuthState = {
  isAuth: boolean;
  userName: string;
};

const authAdapter = createAdapter<AuthState>()({
  loadAuthenticatedUser: (state, authData: AuthSession) => {
    return {
      ...state,
      isAuth: true,
      userName: authData.user?.email?.split('@')[0] || '',
    };
  },
  logout: (state) => ({ ...state, isAuth: false }),
  selectors: {
    isAuth: (state) => state.isAuth,
    userName: (state) => state.userName,
  },
});
// create a service, enable to expose the source of the store
// and create effect
export const AuthStore = new InjectionToken('Auth store', {
  providedIn: 'root',
  factory: () => {
    const supabaseService = inject(SupabaseService);
    return adapt(
      {
        isAuth: false,
        userName: '',
      },
      {
        adapter: authAdapter,
        sources: {
          loadAuthenticatedUser: supabaseService.authChange$.pipe(
            map(({ payload }) => payload.session as AuthSession),
            filter((session) => !!session),
            toSource('loadAuthenticatedUser')
          ),
          logout: supabaseService.authChange$.pipe(
            map(({ payload: { event } }) => event === 'SIGNED_OUT'),
            filter((event) => !!event),
            toSource('logout')
          ),
        },
      }
    );
  },
});
