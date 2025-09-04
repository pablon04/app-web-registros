import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Register } from './components/register/register';
import { RegisterSecond } from './components/register-2/register-2';


@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    Register,
    RegisterSecond
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