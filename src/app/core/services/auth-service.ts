import { Injectable } from '@angular/core';
import { createClient, Session, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment.development';
import { UserModel } from '../model/user-model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase: SupabaseClient;
  public authUser: User | null = null;
  public session: Session | null = null;
  public appUser: UserModel | null = null;
  private isManualSignIn = false;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

    const storedSession = localStorage.getItem('supabase_session');
    if (storedSession) {
      const parsed = JSON.parse(storedSession) as Session;
      this.session = parsed;
      this.authUser = parsed.user ?? null;
    }


    this.supabase.auth.onAuthStateChange(async (event, session) => {
      if (this.isManualSignIn) {
        this.isManualSignIn = false;
        return;
      }

      this.session = session;
      this.authUser = session?.user ?? null;

      if (this.authUser) {
        localStorage.setItem('supabase_session', JSON.stringify(session));
        // await this.loadAppUser(this.authUser.id);
      } else {
        localStorage.removeItem('supabase_session');
        this.appUser = null;
      }
    });
  }

  async signIn(username: string, password: string) {
    const email = `nesma2357@gmail.com`;

    this.isManualSignIn = true;

    const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
    console.log('SIGN IN RESPONSE:', { data, error });

    if (error) throw error;

    this.session = data.session;
    this.authUser = data.user ?? null;

    if (this.authUser) {
      localStorage.setItem('supabase_session', JSON.stringify(data.session));
      // await this.loadAppUser(this.authUser.id);
    }

    return data;
  }

  async signOut() {
    await this.supabase.auth.signOut();
    this.session = null;
    this.authUser = null;
    this.appUser = null;


    localStorage.removeItem('supabase_session');
  }

  private async loadAppUser(authId: string) {
    console.log('Loading App User for authId:', authId);
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('auth_id', authId)
      .single();

    if (error) {
      console.error('Error loading app user:', error);
      this.appUser = null;
      return;
    }

    this.appUser = data;
  }

  getToken(): string | null {
    return this.session?.access_token ?? null;
  }
}
