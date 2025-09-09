import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Define the interface for a "Registro" object. This is a best practice.
interface Registro {
  tara: string;
  muestra: string;
  ensayo: string;
  horno: string;
  editando?: boolean;
  registroTemporal?: {
    tara: string;
    muestra: string;
    ensayo: string;
    horno: string;
  };
}

@Component({
  selector: 'app-humcomponent',
  imports: [FormsModule, CommonModule],
  templateUrl: './humComponent.html',
  styleUrl: './humComponent.css'
})


export class HumComponent implements OnInit {
  // Propiedades para los inputs del formulario
  tara: string = '';
  muestra: string = '';
  ensayo: string = '';
  horno: string = '';

  // Lista que almacenará todos los registros.
  // Correctly type the array with the 'Registro' interface.
  registros: Registro[] = [];

  ngOnInit(): void {
      this.cargarRegistros();
  }

  // Método para agregar un nuevo registro a la lista
  agregarRegistro() {
    // Crea un nuevo objeto con los valores del formulario
    const nuevoRegistro: Registro = {
      tara: this.tara,
      muestra: this.muestra,
      ensayo: this.ensayo,
      horno: this.horno
    };
    // Agrega el nuevo registro al principio de la lista
    this.registros.unshift(nuevoRegistro);
    this.guardarRegistros(); // Guarda los registros en el almacenamiento local
    // Opcional: Limpia los campos del formulario después de agregar un registro
    this.limpiarFormulario();
  }

  // Método para eliminar un registro por su índice
  eliminarRegistro(index: number) {
    this.registros.splice(index, 1);
    this.guardarRegistros(); // Guarda los registros en el almacenamiento local
  }

  // Método auxiliar para limpiar los inputs del formulario
  limpiarFormulario() {
    this.tara = '';
    this.muestra = '';
    this.ensayo = '';
    this.horno = '';
  }

  guardarRegistros() {
    localStorage.setItem('registros', JSON.stringify(this.registros));
  }

  cargarRegistros() {
    const datosGuardados = localStorage.getItem('registros');
    if (datosGuardados) {
      this.registros = JSON.parse(datosGuardados);
    }
  }

  busquedaTara: string = '';
  busquedaMuestra: string = '';
  busquedaEnsayo: string = '';
  busquedaHorno: string = '';

  // Método de filtrado
  get registrosFiltrados() {
    return this.registros.filter(registro => {
      const coincideTara = !this.busquedaTara || 
        registro.tara.toLowerCase().includes(this.busquedaTara.toLowerCase());
      const coincideMuestra = !this.busquedaMuestra || 
        registro.muestra.toLowerCase().includes(this.busquedaMuestra.toLowerCase());
      const coincideEnsayo = !this.busquedaEnsayo || 
        registro.ensayo.toLowerCase().includes(this.busquedaEnsayo.toLowerCase());
      const coincideHorno = !this.busquedaHorno || 
        registro.horno.toLowerCase().includes(this.busquedaHorno.toLowerCase());

      return coincideTara && coincideMuestra && coincideEnsayo && coincideHorno;
    });
  }

  // Método para iniciar la edición de un registro
  editarRegistro(index: number) {
    const registro = this.registros[index];
    registro.editando = true;
    registro.registroTemporal = {
      tara: registro.tara,
      muestra: registro.muestra,
      ensayo: registro.ensayo,
      horno: registro.horno
    };
  }

  // Método para guardar los cambios de la edición
  guardarEdicion(index: number) {
    const registro = this.registros[index];
    if (registro.registroTemporal) {
      registro.tara = registro.registroTemporal.tara;
      registro.muestra = registro.registroTemporal.muestra;
      registro.ensayo = registro.registroTemporal.ensayo;
      registro.horno = registro.registroTemporal.horno;
    }
    registro.editando = false;
    delete registro.registroTemporal;
    this.guardarRegistros();
  }
}
