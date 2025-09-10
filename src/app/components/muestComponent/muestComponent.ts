import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RegistroMuestraService } from '../../services/registro-muestra.service';
import { RegistroMuestra } from '../../models/registro.interface';

// Define the interface with the new fields and editing properties
interface RegistroLocal extends RegistroMuestra {
  editando?: boolean;
  registroTemporal?: {
    numero_muestra: string;
    fecha: string;
    palet: string;
    ubicacion_palet: string;
  };
}

@Component({
  selector: 'app-muestcomponent',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './muestComponent.html',
  styleUrl: './muestComponent.css'
})
export class MuestComponent implements OnInit {

  private registroService = inject(RegistroMuestraService);

  // Properties for form inputs
  numeroMuestra: string = '';
  fecha: string = '';
  palet: string = '';
  ubicacionPalet: string = '';

  registros: RegistroLocal[] = [];

  // Propiedades computadas del servicio
  loading = this.registroService.loading;
  error = this.registroService.error;

  // Implement OnInit to load data when the component starts
  ngOnInit(): void {
    this.cargarRegistros();
  }

  // --- Logic Methods ---
  async agregarRegistro() {
    if (!this.numeroMuestra || !this.fecha || !this.palet || !this.ubicacionPalet) {
      return; // Validación básica
    }

    const nuevoRegistro = {
      numero_muestra: this.numeroMuestra,
      fecha: this.fecha,
      palet: this.palet,
      ubicacion_palet: this.ubicacionPalet
    };

    const resultado = await this.registroService.crearRegistro(nuevoRegistro);
    
    if (resultado) {
      this.limpiarFormulario();
    }
  }

  async eliminarRegistro(index: number) {
    const registro = this.registros[index];
    if (registro.id) {
      const resultado = await this.registroService.eliminarRegistro(registro.id);
      if (resultado) {
        this.registros.splice(index, 1);
      }
    }
  }

  limpiarFormulario() {
    this.numeroMuestra = '';
    this.fecha = '';
    this.palet = '';
    this.ubicacionPalet = '';
  }

  // --- Storage Methods ---
  async cargarRegistros() {
    await this.registroService.obtenerTodosLosRegistros();
    // Convertir los registros de Supabase a registros locales con propiedades de edición
    this.registros = this.registroService.registros().map(registro => ({
      ...registro,
      editando: false
    }));
  }

  busquedanumeroMuestra: string = '';
  busquedafecha: string = '';
  busquedapalet: string = '';
  busquedaubicacionPalet: string = '';

  // Filtering method
  get registrosFiltrados() {
    return this.registros.filter(registro => {
      const coincideMuestra = !this.busquedanumeroMuestra ||
        registro.numero_muestra.toLowerCase().includes(this.busquedanumeroMuestra.toLowerCase());
      const coincideFecha = !this.busquedafecha ||
        registro.fecha.toLowerCase().includes(this.busquedafecha.toLowerCase());
      const coincidePalet = !this.busquedapalet ||
        registro.palet.toLowerCase().includes(this.busquedapalet.toLowerCase());
      const coincideUbicacionPalet = !this.busquedaubicacionPalet ||
        registro.ubicacion_palet.toLowerCase().includes(this.busquedaubicacionPalet.toLowerCase());

      return coincideMuestra && coincideFecha && coincidePalet && coincideUbicacionPalet;
    });
  }

  // Method to start editing a record
  editarRegistro(index: number) {
    const registro = this.registros[index];
    registro.editando = true;
    registro.registroTemporal = {
      numero_muestra: registro.numero_muestra,
      fecha: registro.fecha,
      palet: registro.palet,
      ubicacion_palet: registro.ubicacion_palet
    };
  }

  // Method to save the edited changes
  async guardarEdicion(index: number) {
    const registro = this.registros[index];
    if (registro.registroTemporal && registro.id) {
      const datosActualizados = {
        numero_muestra: registro.registroTemporal.numero_muestra,
        fecha: registro.registroTemporal.fecha,
        palet: registro.registroTemporal.palet,
        ubicacion_palet: registro.registroTemporal.ubicacion_palet
      };

      const resultado = await this.registroService.actualizarRegistro(registro.id, datosActualizados);
      
      if (resultado) {
        registro.numero_muestra = registro.registroTemporal.numero_muestra;
        registro.fecha = registro.registroTemporal.fecha;
        registro.palet = registro.registroTemporal.palet;
        registro.ubicacion_palet = registro.registroTemporal.ubicacion_palet;
        registro.editando = false;
        delete registro.registroTemporal;
      }
    }
  }

  // Método para cancelar la edición
  cancelarEdicion(index: number) {
    const registro = this.registros[index];
    registro.editando = false;
    delete registro.registroTemporal;
  }
  
  //Comprobar si la fecha es mayor a un mes
  isDateOlderThanOneMonth(fecha: string): boolean {
    const registroDate = new Date(fecha);
    const currentDate = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(currentDate.getMonth() - 1);

    return registroDate < oneMonthAgo;
  }

  // Método para limpiar errores
  limpiarError() {
    this.registroService.limpiarError();
  }
}