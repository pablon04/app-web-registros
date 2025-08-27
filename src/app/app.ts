import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Videojuegos } from './components/videojuegos/videojuegos';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Videojuegos],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly nombreProyecto = signal('angular-15-minutos');
  description = 'This is an Angular project created in 15 minutes';
  profesor = 'Pablo Deeleman';
}
