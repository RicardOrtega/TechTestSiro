import {Component, Input, Output, EventEmitter} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ShippingFormData, LocationData} from '../../interface/data';

@Component({
  selector: 'app-shipping-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './shipping-details.component.html',
  styleUrls: ['./shipping-details.component.css'],
})
export class ShippingDetailsComponent {
  @Input() shippingData!: ShippingFormData;
  @Output() orderConfirmed = new EventEmitter<void>();

  steps = [
    { id: 1, title: '¿Quién envía?', active: false },
    { id: 2, title: '¿A quién quieres enviar?', active: false },
    { id: 3, title: '¿Qué quieres enviar?', active: false },
    { id: 4, title: '¿Desde qué lugar envías?', active: false },
    { id: 5, title: '¿A dónde quieres enviar?', active: false },
    { id: 6, title: 'Detalles de envío', active: true }
  ];

  hasContent(obj: any): boolean {
    return obj && Object.keys(obj).length > 0;
  }

  confirmOrder() {
    if (this.validateShippingData()) {
      console.log('Confirmando orden con datos:', this.shippingData);
      this.orderConfirmed.emit();
    } else {
      console.warn('Datos de envío incompletos');
    }
  }

  private validateShippingData(): boolean {
    return !!(
      this.shippingData &&
      this.shippingData.sender &&
      this.shippingData.recipient &&
      this.shippingData.origin &&
      this.shippingData.destination &&
      this.shippingData.package
    );
  }
}
