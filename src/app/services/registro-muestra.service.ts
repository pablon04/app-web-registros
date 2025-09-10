import { Injectable, inject, signal, computed } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { RegistroMuestra } from '../models/registro.interface';

interface RegistroMuestraState {
  registros: RegistroMuestra[];
  loading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class RegistroMuestraService {
  private supabaseService = inject(SupabaseService);
  
  private _state = signal<RegistroMuestraState>({
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
        .from('registros_muestras')
        .select('*')
        .order('fecha_creacion', { ascending: false });

      if (error) {
        console.error('Error de Supabase:', error);
        throw new Error(`Error al obtener registros: ${error.message}`);
      }

      // Inicializar propiedades de edición
      const registrosConEdicion = (data || []).map(registro => ({
        ...registro,
        editando: false
      }));

      this._state.update((state) => ({ 
        ...state, 
        registros: registrosConEdicion, 
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

  async crearRegistro(registro: Omit<RegistroMuestra, 'id' | 'fecha_creacion' | 'fecha_actualizacion'>): Promise<RegistroMuestra | null> {
    try {
      this._state.update((state) => ({ ...state, loading: true, error: null }));

      const { data, error } = await this.supabaseService.client
        .from('registros_muestras')
        .insert([registro])
        .select()
        .single();

      if (error) throw error;

      // Inicializar propiedades de edición
      const registroConEdicion = {
        ...data,
        editando: false
      };

      // Actualizar el estado local
      this._state.update((state) => ({
        ...state,
        registros: [registroConEdicion, ...state.registros],
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

  async actualizarRegistro(id: number, registro: Partial<RegistroMuestra>): Promise<RegistroMuestra | null> {
    try {
      this._state.update((state) => ({ ...state, loading: true, error: null }));

      const { data, error } = await this.supabaseService.client
        .from('registros_muestras')
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
        .from('registros_muestras')
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
