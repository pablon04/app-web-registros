import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HumComponent } from './components/humComponent/humComponent';
import { MuestComponent } from './components/muestComponent/muestComponent';


@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HumComponent,
    MuestComponent
], // Corrected import
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
   activeComponent = signal('humedad');

   showHumedad() {
    this.activeComponent.set('humedad');
  }

  showMuestras() {
    this.activeComponent.set('muestras');
  }

}