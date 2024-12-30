import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShippingFormData } from '../../interface/data';

@Component({
  selector: 'app-shipping-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shipping-details.component.html',
  styleUrls: ['./shipping-details.component.css']
})
export class ShippingDetailsComponent {
  @Input() shippingData!: ShippingFormData;
  @Output() orderConfirmed = new EventEmitter<void>();

  confirmOrder() {
    // Emitir evento cuando se confirma la orden
    this.orderConfirmed.emit();
  }
}
