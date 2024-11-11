import { Injectable } from '@angular/core';
import {
  AuthChangeEvent,
  AuthSession,
  createClient,
  EmailOtpType,
  Session,
  SupabaseClient,
} from '@supabase/supabase-js';
import { environment } from '../../../environment/environment';
import { ReplaySubject } from 'rxjs';

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
  private supabase: SupabaseClient;
  _session: AuthSession | null = null;

  public authChange$ = new ReplaySubject<{
    event: AuthChangeEvent;
    session: Session | null;
  }>();

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );

    this.authChanges((event, session) => {
      this.authChange$.next({ event, session });
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
