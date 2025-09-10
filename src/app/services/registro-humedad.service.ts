import { Injectable, inject, signal, computed } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { RegistroHumedad, ApiResponse } from '../models/registro.interface';

interface RegistroHumedadState {
  registros: RegistroHumedad[];
  loading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class RegistroHumedadService {
  private supabaseService = inject(SupabaseService);
  
  private _state = signal<RegistroHumedadState>({
    registros: [],
    loading: false,
    error: null,
  });

  // Selectores
  registros = computed(() => this._state().registros);
  loading = computed(() => this._state().loading);
  error = computed(() => this._state().error);

  async obtenerTodosLosRegistros(): Promise<void> {
    try {
      this._state.update((state) => ({ ...state, loading: true, error: null }));
      
      const { data, error } = await this.supabaseService.client
        .from('registros_humedad')
        .select('*')
        .order('fecha_creacion', { ascending: false });

      if (error) {
        console.error('Error de Supabase:', error);
        throw new Error(`Error al obtener registros: ${error.message}`);
      }

      this._state.update((state) => ({ 
        ...state, 
        registros: data || [], 
        loading: false 
      }));
    } catch (error: any) {
      console.error('Error completo:', error);
      this._state.update((state) => ({ 
        ...state, 
        error: `Error al cargar datos: ${error.message}. Asegúrate de que las tablas están creadas en Supabase.`, 
        loading: false 
      }));
    }
  }

  async crearRegistro(registro: Omit<RegistroHumedad, 'id' | 'fecha_creacion' | 'fecha_actualizacion'>): Promise<RegistroHumedad | null> {
    try {
      this._state.update((state) => ({ ...state, loading: true, error: null }));

      const { data, error } = await this.supabaseService.client
        .from('registros_humedad')
        .insert([registro])
        .select()
        .single();

      if (error) throw error;

      // Actualizar el estado local
      this._state.update((state) => ({
        ...state,
        registros: [data, ...state.registros],
        loading: false
      }));

      return data;
    } catch (error: any) {
      this._state.update((state) => ({ 
        ...state, 
        error: error.message, 
        loading: false 
      }));
      return null;
    }
  }

  async actualizarRegistro(id: number, registro: Partial<RegistroHumedad>): Promise<RegistroHumedad | null> {
    try {
      this._state.update((state) => ({ ...state, loading: true, error: null }));

      const { data, error } = await this.supabaseService.client
        .from('registros_humedad')
        .update(registro)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Actualizar el estado local
      this._state.update((state) => ({
        ...state,
        registros: state.registros.map(r => r.id === id ? data : r),
        loading: false
      }));

      return data;
    } catch (error: any) {
      this._state.update((state) => ({ 
        ...state, 
        error: error.message, 
        loading: false 
      }));
      return null;
    }
  }

  async eliminarRegistro(id: number): Promise<boolean> {
    try {
      this._state.update((state) => ({ ...state, loading: true, error: null }));

      const { error } = await this.supabaseService.client
        .from('registros_humedad')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Actualizar el estado local
      this._state.update((state) => ({
        ...state,
        registros: state.registros.filter(r => r.id !== id),
        loading: false
      }));

      return true;
    } catch (error: any) {
      this._state.update((state) => ({ 
        ...state, 
        error: error.message, 
        loading: false 
      }));
      return false;
    }
  }

  limpiarError(): void {
    this._state.update((state) => ({ ...state, error: null }));
  }
}
