export interface RegistroHumedad {
  id?: number;
  tara: string;
  muestra: string;
  ensayo: string;
  horno: string;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
  // Propiedades para edición local
  editando?: boolean;
  registroTemporal?: {
    tara: string;
    muestra: string;
    ensayo: string;
    horno: string;
  };
}

export interface RegistroMuestra {
  id?: number;
  numero_muestra: string;
  fecha: string;
  palet: string;
  ubicacion_palet: string;
  observaciones?: string; // Nueva propiedad para observaciones
  tirar?: boolean; // Nueva propiedad para marcar si se debe tirar
  almacenar?: boolean; // Nueva propiedad para marcar si se debe almacenar
  fecha_creacion?: string;
  fecha_actualizacion?: string;
  // Propiedades para edición local
  editando?: boolean;
  registroTemporal?: {
    numero_muestra: string;
    fecha: string;
    palet: string;
    ubicacion_palet: string;
    observaciones?: string;
    tirar?: boolean;
    almacenar?: boolean;
  };
}

export interface ApiResponse<T> {
  data: T[] | null;
  error: any;
}
