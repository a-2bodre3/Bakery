import { Injectable } from '@angular/core';
import {createClient, Session, SupabaseClient, User} from '@supabase/supabase-js';
import {environment} from '../../../environments/environment.development';
import {UserModel} from '../model/user-model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase:SupabaseClient;
  public authUser:User | null = null;
  public session:Session | null = null;
  public appUser:UserModel | null = null;
  // إضافة flag لتجنب التكرار
  private isManualSignIn = false;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    this.supabase.auth.onAuthStateChange(async (event, session) => {
      // إذا كانت العملية يدوية، نتخطى التحميل التلقائي
      if (this.isManualSignIn) {
        this.isManualSignIn = false;
        return;
      }

      this.session = session;
      this.authUser = session?.user ?? null;

      if (this.authUser) {
        await this.loadAppUser(this.authUser.id);
      } else {
        this.appUser = null;
      }
    });
  }

  async signIn(username: string, password: string) {
    const email = `nesma2357@gmail.com`;

    // تعيين flag أن هذه عملية يدوية
    this.isManualSignIn = true;

    const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });

    console.log('SIGN IN RESPONSE:', { data, error });

    if (error) throw error;

    this.session = data.session;
    this.authUser = data.user ?? null;

    if (this.authUser) {
      console.log('Auth user exists, loading AppUser...');
      await this.loadAppUser(this.authUser.id);
    }

    console.log('Returning from signIn...');
    return data;
  }



  async signOut() {
    await this.supabase.auth.signOut();
    this.session = null;
    this.authUser = null;
    this.appUser = null;
  }





  private async loadAppUser(authId:string) {
    console.log('Loading App User for authId:', authId);
    const {data, error} = await this.supabase
      .from('users')
      .select('*')
      .eq('auth_id', authId)
      .single();

    if (error) {
      console.error('Error loading app user:', error);
      this.appUser = null;
      return;
    }

    console.log('Loaded App User:', data);
    this.appUser = data;
  }

  getToken(): string | null {
    return this.session?.access_token ?? null;
  }

}
