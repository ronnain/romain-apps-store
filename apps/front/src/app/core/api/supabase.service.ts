import { Injectable } from '@angular/core';
import {
  AuthChangeEvent,
  AuthSession,
  createClient,
  EmailOtpType,
  Session,
} from '@supabase/supabase-js';
import { environment } from '../../../environment/environment';
import { ReplaySubject, shareReplay } from 'rxjs';
import { toSource } from '@state-adapt/rxjs';
import { Database } from '../../../supabase-types';

export interface Profile {
  id?: string;
  username: string;
  website: string;
  avatar_url: string;
}

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  public readonly supabase = createClient<Database>(
    environment.supabaseUrl,
    environment.supabaseKey
  );
  _session: AuthSession | null = null;

  private _authChange$ = new ReplaySubject<{
    event: AuthChangeEvent;
    session: Session | null;
  }>();

  public authChange$ = this._authChange$
    .asObservable()
    .pipe(shareReplay(1), toSource('authChange'));

  constructor() {
    this.authChanges((event, session) => {
      this._authChange$.next({ event, session });
    });
  }

  get session() {
    this.supabase.auth.getSession().then(({ data }) => {
      this._session = data.session;
    });
    return this._session;
  }

  private authChanges(
    callback: (event: AuthChangeEvent, session: Session | null) => void
  ) {
    return this.supabase.auth.onAuthStateChange(callback);
  }

  signOut() {
    return this.supabase.auth.signOut();
  }

  async signInWithEmail(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  }

  async checkMagicLinkToken(token_hash: string, type: EmailOtpType) {
    const { error } = await this.supabase.auth.verifyOtp({
      token_hash,
      type,
    });
    return { error };
  }
}
