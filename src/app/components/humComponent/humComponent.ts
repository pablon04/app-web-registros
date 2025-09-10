import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RegistroHumedadService } from '../../services/registro-humedad.service';
import { RegistroHumedad } from '../../models/registro.interface';

// Define the interface for a "Registro" object with editing properties
interface RegistroLocal extends RegistroHumedad {
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


export default class HumComponent implements AfterViewInit {

  private registroService = inject(RegistroHumedadService);

  // Propiedades para los inputs del formulario
  tara: string = '';
  muestra: string = '';
  ensayo: string = '';
  horno: string = '';

  // Lista que almacenará todos los registros.
  registros: RegistroLocal[] = [];

  // Propiedades computadas del servicio
  loading = this.registroService.loading;
  error = this.registroService.error;

  ngAfterViewInit(): void {
    this.cargarRegistros();
  }

  // Método para agregar un nuevo registro a la lista
  async agregarRegistro() {
    if (!this.tara || !this.muestra || !this.ensayo || !this.horno) {
      return; // Validación básica
    }

    const nuevoRegistro = {
      tara: this.tara,
      muestra: this.muestra,
      ensayo: this.ensayo,
      horno: this.horno
    };

    const resultado = await this.registroService.crearRegistro(nuevoRegistro);
    
    if (resultado) {
      this.limpiarFormulario();
    }
  }

  // Método para eliminar un registro por su índice
  async eliminarRegistro(index: number) {
    const registro = this.registros[index];
    if (registro.id) {
      const resultado = await this.registroService.eliminarRegistro(registro.id);
      if (resultado) {
        this.registros.splice(index, 1);
      }
    }
  }

  // Método auxiliar para limpiar los inputs del formulario
  limpiarFormulario() {
    this.tara = '';
    this.muestra = '';
    this.ensayo = '';
    this.horno = '';
  }

  async cargarRegistros() {
    await this.registroService.obtenerTodosLosRegistros();
    // Convertir los registros de Supabase a registros locales con propiedades de edición
    this.registros = this.registroService.registros().map(registro => ({
      ...registro,
      editando: false
    }));
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
  async guardarEdicion(index: number) {
    const registro = this.registros[index];
    if (registro.registroTemporal && registro.id) {
      const datosActualizados = {
        tara: registro.registroTemporal.tara,
        muestra: registro.registroTemporal.muestra,
        ensayo: registro.registroTemporal.ensayo,
        horno: registro.registroTemporal.horno
      };

      const resultado = await this.registroService.actualizarRegistro(registro.id, datosActualizados);
      
      if (resultado) {
        registro.tara = registro.registroTemporal.tara;
        registro.muestra = registro.registroTemporal.muestra;
        registro.ensayo = registro.registroTemporal.ensayo;
        registro.horno = registro.registroTemporal.horno;
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

  // Método para limpiar errores
  limpiarError() {
    this.registroService.limpiarError();
  }
}
