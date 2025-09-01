import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  registro: string[] = [];

  nuevoRegistro: string = '';
 
  addRegistro() {
    if(this.nuevoRegistro.trim()) {
      this.registro.push(this.nuevoRegistro.trim());

      this.nuevoRegistro = '';
  }
}

}
