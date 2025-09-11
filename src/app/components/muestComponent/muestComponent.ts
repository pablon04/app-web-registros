import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RegistroMuestraService } from '../../services/registro-muestra.service';
import { RegistroMuestra } from '../../models/registro.interface';

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
  observaciones: string = '';

  // Propiedades computadas del servicio (reactivas)
  registros = this.registroService.registros;
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
      ubicacion_palet: this.ubicacionPalet,
      observaciones: this.observaciones.trim() || undefined, // Solo guardar si no está vacío
      tirar: false, // Por defecto, los nuevos registros no están marcados para tirar
      almacenar: false // Por defecto, los nuevos registros no están marcados para almacenar
    };

    const resultado = await this.registroService.crearRegistro(nuevoRegistro);
    
    if (resultado) {
      this.limpiarFormulario();
      // No necesitamos actualizar manualmente, el servicio ya actualiza los datos reactivos
    }
  }

  async eliminarRegistro(index: number) {
    const registro = this.registros()[index]; // Ahora usamos la función reactiva
    if (registro.id) {
      const resultado = await this.registroService.eliminarRegistro(registro.id);
      // No necesitamos splice, el servicio actualiza automáticamente la lista
    }
  }

  limpiarFormulario() {
    this.numeroMuestra = '';
    this.fecha = '';
    this.palet = '';
    this.ubicacionPalet = '';
    this.observaciones = '';
  }

  // --- Storage Methods ---
  async cargarRegistros() {
    await this.registroService.obtenerTodosLosRegistros();
    // Ya no necesitamos copiar datos, usamos directamente las señales reactivas
  }

  busquedanumeroMuestra: string = '';
  busquedafecha: string = '';
  busquedapalet: string = '';
  busquedaubicacionPalet: string = '';
  
  // Nuevos filtros con checkbox
  filtroSoloTirar: boolean = false;
  filtroSoloAlmacenar: boolean = false;
  filtroSoloVencidos: boolean = false;

  // Filtering method
  get registrosFiltrados() {
    return this.registros().filter(registro => {
      const coincideMuestra = !this.busquedanumeroMuestra ||
        registro.numero_muestra.toLowerCase().includes(this.busquedanumeroMuestra.toLowerCase());
      const coincideFecha = !this.busquedafecha ||
        registro.fecha.toLowerCase().includes(this.busquedafecha.toLowerCase());
      const coincidePalet = !this.busquedapalet ||
        registro.palet.toLowerCase().includes(this.busquedapalet.toLowerCase());
      const coincideUbicacionPalet = !this.busquedaubicacionPalet ||
        registro.ubicacion_palet.toLowerCase().includes(this.busquedaubicacionPalet.toLowerCase());
      
      // Nuevos filtros de checkbox
      const filtroTirar = !this.filtroSoloTirar || registro.tirar;
      const filtroAlmacenar = !this.filtroSoloAlmacenar || registro.almacenar;
      const filtroVencidos = !this.filtroSoloVencidos || this.isDateOlderThanOneMonth(registro.fecha);

      return coincideMuestra && coincideFecha && coincidePalet && coincideUbicacionPalet && filtroTirar && filtroAlmacenar && filtroVencidos;
    });
  }

  // Method to start editing a record
  editarRegistro(index: number) {
    const registro = this.registros()[index];
    registro.editando = true;
    registro.registroTemporal = {
      numero_muestra: registro.numero_muestra,
      fecha: registro.fecha,
      palet: registro.palet,
      ubicacion_palet: registro.ubicacion_palet,
      observaciones: registro.observaciones || '', // Incluir observaciones en la edición
      tirar: registro.tirar || false, // Incluir el estado de tirar en la edición
      almacenar: registro.almacenar || false // Incluir el estado de almacenar en la edición
    };
  }

  // Method to save the edited changes
  async guardarEdicion(index: number) {
    const registro = this.registros()[index];
    if (registro.registroTemporal && registro.id) {
      const datosActualizados = {
        numero_muestra: registro.registroTemporal.numero_muestra,
        fecha: registro.registroTemporal.fecha,
        palet: registro.registroTemporal.palet,
        ubicacion_palet: registro.registroTemporal.ubicacion_palet,
        observaciones: registro.registroTemporal.observaciones?.trim() || undefined, // Guardar observaciones
        tirar: registro.registroTemporal.tirar || false, // Guardar el estado de tirar
        almacenar: registro.registroTemporal.almacenar || false // Guardar el estado de almacenar
      };

      const resultado = await this.registroService.actualizarRegistro(registro.id, datosActualizados);
      
      if (resultado) {
        registro.editando = false;
        delete registro.registroTemporal;
      }
    }
  }

  // Método para cancelar la edición
  cancelarEdicion(index: number) {
    const registro = this.registros()[index];
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