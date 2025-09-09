import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Define the interface with the new fields
interface Registro {
  numeroMuestra: string;
  fecha: string;
  palet: string;
  ubicacionPalet: string;
  editando?: boolean;
  registroTemporal?: {
    numeroMuestra: string;
    fecha: string;
    palet: string;
    ubicacionPalet: string;
  };
}

@Component({
  selector: 'app-muestcomponent',
  standalone: true, // You may need to add standalone: true depending on your Angular version
  imports: [FormsModule, CommonModule],
  templateUrl: './muestComponent.html',
  styleUrl: './muestComponent.css'
})
export class MuestComponent implements OnInit {

  // Properties for form inputs
  numeroMuestra: string = '';
  fecha: string = '';
  palet: string = '';
  ubicacionPalet: string = '';

  registros: Registro[] = [];

  // Implement OnInit to load data when the component starts
  ngOnInit(): void {
    this.cargarRegistros();
  }

  // --- Logic Methods ---
  agregarRegistro() {
    const nuevoRegistro: Registro = {
      numeroMuestra: this.numeroMuestra,
      fecha: this.fecha,
      palet: this.palet,
      ubicacionPalet: this.ubicacionPalet
    };
    this.registros.unshift(nuevoRegistro);
    this.guardarRegistros();
    this.limpiarFormulario();
  }

  eliminarRegistro(index: number) {
    this.registros.splice(index, 1);
    this.guardarRegistros();
  }

  limpiarFormulario() {
    this.numeroMuestra = '';
    this.fecha = '';
    this.palet = '';
    this.ubicacionPalet = '';
  }

  // --- Storage Methods ---
  guardarRegistros() {
    localStorage.setItem('registrosData', JSON.stringify(this.registros));
  }

  cargarRegistros() {
    const registrosGuardados = localStorage.getItem('registrosData');
    if (registrosGuardados) {
      this.registros = JSON.parse(registrosGuardados);
    }
  }

  busquedanumeroMuestra: string = '';
  busquedafecha: string = '';
  busquedapalet: string = '';
  busquedaubicacionPalet: string = '';

  // Filtering method
  get registrosFiltrados() {
    return this.registros.filter(registro => {
      const coincideMuestra = !this.busquedanumeroMuestra ||
        registro.numeroMuestra.toLowerCase().includes(this.busquedanumeroMuestra.toLowerCase());
      const coincideFecha = !this.busquedafecha ||
        registro.fecha.toLowerCase().includes(this.busquedafecha.toLowerCase());
      const coincidePalet = !this.busquedapalet ||
        registro.palet.toLowerCase().includes(this.busquedapalet.toLowerCase());
      const coincideUbicacionPalet = !this.busquedaubicacionPalet ||
        registro.ubicacionPalet.toLowerCase().includes(this.busquedaubicacionPalet.toLowerCase());

      return coincideMuestra && coincideFecha && coincidePalet && coincideUbicacionPalet;
    });
  }

  // Method to start editing a record
  editarRegistro(index: number) {
    const registro = this.registros[index];
    registro.editando = true;
    registro.registroTemporal = {
      numeroMuestra: registro.numeroMuestra,
      fecha: registro.fecha,
      palet: registro.palet,
      ubicacionPalet: registro.ubicacionPalet
    };
  }

  // Method to save the edited changes
  guardarEdicion(index: number) {
    const registro = this.registros[index];
    if (registro.registroTemporal) {
      registro.numeroMuestra = registro.registroTemporal.numeroMuestra;
      registro.fecha = registro.registroTemporal.fecha;
      registro.palet = registro.registroTemporal.palet;
      registro.ubicacionPalet = registro.registroTemporal.ubicacionPalet;
    }
    registro.editando = false;
    delete registro.registroTemporal;
    this.guardarRegistros();
  }
  
  //Comprobar si la fecha es mayor a un mes
  isDateOlderThanOneMonth(fecha: string): boolean {
    const registroDate = new Date(fecha);
    const currentDate = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(currentDate.getMonth() - 1);

   
    return registroDate < oneMonthAgo;
  }
}