import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Resume } from './components/resume/resume';
import { Register } from "./components/register/register";


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Resume, Register],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly nombreProyecto = signal('Laboratorio');
}
