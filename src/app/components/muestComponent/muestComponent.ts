import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Asegúrate de importar CommonModule

// Define la interfaz con los nuevos campos
interface Registro {
  numeroMuestra: string;
  fecha: string;
  palet: string;
  ubicacionPalet: string;
}

@Component({
  selector: 'app-muestcomponent',
  imports: [FormsModule, CommonModule],
  templateUrl: './muestComponent.html',
  styleUrl: './muestComponent.css'
})
export class MuestComponent implements OnInit {

  // Propiedades para los inputs del formulario
  numeroMuestra: string = '';
  fecha: string = '';
  palet: string = '';
  ubicacionPalet: string = '';

  registros: Registro[] = [];

  // Implementa OnInit para cargar los datos al iniciar el componente
  ngOnInit(): void {
    this.cargarRegistros();
  }

  // --- Métodos de Lógica ---
  agregarRegistro() {
    const nuevoRegistro: Registro = {
      numeroMuestra: this.numeroMuestra,
      fecha: this.fecha,
      palet: this.palet,
      ubicacionPalet: this.ubicacionPalet
    };
    this.registros.push(nuevoRegistro);
    this.guardarRegistros(); // Guarda los registros después de agregar uno
    this.limpiarFormulario();
  }

  eliminarRegistro(index: number) {
    this.registros.splice(index, 1);
    this.guardarRegistros(); // Guarda los registros después de eliminar uno
  }

  limpiarFormulario() {
    this.numeroMuestra = '';
    this.fecha = '';
    this.palet = '';
    this.ubicacionPalet = '';
  }

  // --- Métodos de Almacenamiento ---
  guardarRegistros() {
    // Convierte el array a una cadena de texto y lo guarda en localStorage
    localStorage.setItem('registrosData', JSON.stringify(this.registros));
  }

  cargarRegistros() {
    const registrosGuardados = localStorage.getItem('registrosData');
    if (registrosGuardados) {
      // Si hay datos, los parsea de vuelta a un objeto y los asigna al array
      this.registros = JSON.parse(registrosGuardados);
    }
  }

  busquedanumeroMuestra: string = '';
  busquedafecha: string = '';
  busquedapalet: string = '';
  busquedaubicacionPalet: string = '';

    // Método de filtrado
  get registrosFiltrados() {
    return this.registros.filter(registro => {
      const coincideMuestra2 = !this.busquedanumeroMuestra || 
        registro.numeroMuestra.toLowerCase().includes(this.busquedanumeroMuestra.toLowerCase());
      const coincideFecha = !this.  busquedafecha || 
        registro.fecha.toLowerCase().includes(this.  busquedafecha.toLowerCase());
      const coincidePalet = !this.  busquedapalet || 
        registro.palet.toLowerCase().includes(this.  busquedapalet.toLowerCase());
      const coincideUbicacionPalet = !this.busquedaubicacionPalet || 
        registro.ubicacionPalet.toLowerCase().includes(this.busquedaubicacionPalet.toLowerCase());

      return coincideMuestra2 && coincideFecha && coincidePalet && coincideUbicacionPalet;
    });
  }
}