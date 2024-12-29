import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';
import {CalculationService} from '../../../service/calculation-service/calculation-service.service';
import {UserDataService} from '../../../service/user-data/user-data.service';

@Component({
  selector: 'app-volume-calculator',
  templateUrl: './volume-calculator.component.html',
  styleUrls: ['./volume-calculator.component.css'],
  standalone: true,
  imports: [FormsModule, NgIf]
})
export class VolumeCalculatorComponent {
  length: number | null = null;
  width: number | null = null;
  height: number | null = null;
  totalVolume: number = 0;
  price: number | null = null;
  errorMessage: string | null = null;
  confirmationMessage: string | null = null;

  constructor(
    private calculationService: CalculationService,
    private userDataService: UserDataService
  ) {
  }

  calculatePrice(): void {
    if (this.length && this.width && this.height) {
      const lengthInMeters = this.length / 100;
      const widthInMeters = this.width / 100;
      const heightInMeters = this.height / 100;
      this.totalVolume = this.calculationService.calculateVolume(lengthInMeters, widthInMeters, heightInMeters);
      if (this.totalVolume > 2) { // 2 m³
        this.errorMessage = 'El volumen supera los 2 m³. Por favor, contacte a un ejecutivo.';
        this.resetValues();
      } else {
        const volumeInCm3 = this.totalVolume * 1000000; // Convert m³ to cm³
        this.price = this.calculationService.calculatePrice(volumeInCm3);
        this.errorMessage = null;
        this.generateConfirmationMessage();
      }
    } else {
      this.errorMessage = 'Por favor, ingrese todos los valores.';
    }
  }

  resetValues(): void {
    this.length = null;
    this.width = null;
    this.height = null;
    this.totalVolume = 0;
    this.price = null;
    this.confirmationMessage = null;
  }

  generateConfirmationMessage(): void {
    const orderId = Math.floor(Math.random() * 1000000);
    const now = new Date();
    const date = now.toLocaleDateString('es-ES');
    const time = now.toLocaleTimeString('es-ES');
    const volumeInMeters = this.totalVolume;
    const formattedPrice = new Intl.NumberFormat('es-CL', {style: 'currency', currency: 'CLP'}).format(this.price!);
    const userData = this.userDataService.getUserData();
    this.confirmationMessage = `Pedido ingresado al sistema. Número de pedido: ${orderId}. Volumen: ${volumeInMeters.toFixed(6)} m³. Costo: ${formattedPrice}. Fecha: ${date}. Hora: ${time}. Usuario: ${userData?.name || 'N/A'}, Email: ${userData?.email || 'N/A'}, Teléfono: ${userData?.phone || 'N/A'}.`;
  }

  clearInput(event: Event): void {
    (event.target as HTMLInputElement).value = '';
  }
}
