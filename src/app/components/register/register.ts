import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

// Define the interface for a "Registro" object. This is a best practice.
interface Registro {
  tara: string;
  muestra: string;
  ensayo: string;
  horno: string;
}

@Component({
  selector: 'app-register',
  imports: [FormsModule], // Add NgForOf and NgIf
  templateUrl: './register.html',
  styleUrl: './register.css'
})


export class Register {
  // Propiedades para los inputs del formulario
  tara: string = '';
  muestra: string = '';
  ensayo: string = '';
  horno: string = '';

  // Lista que almacenará todos los registros.
  // Correctly type the array with the 'Registro' interface.
  registros: Registro[] = [];

  // Método para agregar un nuevo registro a la lista
  agregarRegistro() {
    // Crea un nuevo objeto con los valores del formulario
    const nuevoRegistro: Registro = {
      tara: this.tara,
      muestra: this.muestra,
      ensayo: this.ensayo,
      horno: this.horno
    };
    // Agrega el nuevo registro a la lista
    this.registros.push(nuevoRegistro);
    // Opcional: Limpia los campos del formulario después de agregar un registro
    this.limpiarFormulario();
  }

  // Método para eliminar un registro por su índice
  eliminarRegistro(index: number) {
    this.registros.splice(index, 1);
  }

  // Método auxiliar para limpiar los inputs del formulario
  limpiarFormulario() {
    this.tara = '';
    this.muestra = '';
    this.ensayo = '';
    this.horno = '';
  }
}
