import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-videojuegos',
  imports: [FormsModule],
  templateUrl: './videojuegos.html',
  styleUrl: './videojuegos.css'
})
export class Videojuegos {

  videojuegos: string[] = [];

  nuevojuego: string = "";

  addJuego() {
    if (this.nuevojuego.trim() !== "") {
      this.videojuegos.push(this.nuevojuego.trim());
      this.nuevojuego = "";
    }
  }
  
}
