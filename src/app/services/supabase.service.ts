import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.SUPABASE_URL, 
      environment.SUPABASE_KEY,
      {
        auth: {
          persistSession: false, // Desactivar persistencia de sesión para evitar conflictos
          autoRefreshToken: false,
          detectSessionInUrl: false
        },
        global: {
          headers: {
            'X-Client-Info': 'app-web-registros'
          }
        }
      }
    );
  }

  get client(): SupabaseClient {
    return this.supabase;
  }
}
