import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CalculationService {
  private rate: number = 2000; // Tarifa por cada 20 cm^3

  calculateVolume(length: number, width: number, height: number): number {
    return length * width * height;
  }

  calculatePrice(volume: number): number {
    return (volume / 20) * this.rate;
  }
}
