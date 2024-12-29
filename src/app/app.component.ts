import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {VolumeCalculatorComponent} from './core/shared/components/volume-calculator/volume-calculator.component';
import {UserInputComponent} from './core/shared/components/user-input/user-input.component';
import {HeaderComponent} from './core/shared/components/header/header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, VolumeCalculatorComponent, UserInputComponent, HeaderComponent],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Prueba';
}
