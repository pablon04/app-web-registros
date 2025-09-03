import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Resume } from './components/resume/resume';
import { Register } from './components/register/register';
import { RegisterSecond } from './components/register-2/register-2'; // Renamed to a valid class name

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet, 
    Register, 
    RegisterSecond], // Corrected import
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly nombreProyecto = signal('Laboratorio');
}