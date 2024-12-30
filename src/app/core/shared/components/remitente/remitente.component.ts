import { Component, Output, EventEmitter } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-remitente',
  imports: [
    ReactiveFormsModule,
    NgForOf,
    NgIf
  ],
  templateUrl: './remitente.component.html',
  standalone: true,
  styleUrl: './remitente.component.css'
})
export class RemitenteComponent {
  @Output() continueClicked = new EventEmitter<any>();
  senderForm: FormGroup;
  submitted = false;
  currentStep = 1;

  steps = [
    { id: 1, title: '¿Quién envía?', active: true },
    { id: 2, title: '¿A quién quieres enviar?', active: false },
    { id: 3, title: '¿Qué quieres enviar?', active: false },
    { id: 4, title: '¿Desde qué lugar envías?', active: false },
    { id: 5, title: '¿A dónde quieres enviar?', active: false },
    { id: 6, title: 'Detalles de envío', active: false }
  ];

  constructor(private fb: FormBuilder) {
    this.senderForm = this.fb.group({
      rut: ['', [Validators.required, this.rutValidator()]],
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ ]*')]],
      apellido: ['', [Validators.required, Validators.minLength(2), Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ ]*')]],
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]]
    });
  }

  rutValidator() {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const rut = control.value;
      if (!rut) return null;

      const rutLimpio = rut.replace(/\./g, '').replace(/-/g, '');

      if (!/^[0-9]{7,8}[0-9k]$/i.test(rutLimpio)) {
        return { 'rutInvalido': true };
      }

      const rutSinDv = rutLimpio.slice(0, -1);
      const dv = rutLimpio.slice(-1).toLowerCase();

      let suma = 0;
      let multiplicador = 2;

      for (let i = rutSinDv.length - 1; i >= 0; i--) {
        suma += parseInt(rutSinDv[i]) * multiplicador;
        multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
      }

      const dvEsperado = 11 - (suma % 11);
      const dvCalculado = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'k' : dvEsperado.toString();

      if (dv !== dvCalculado) {
        return { 'rutInvalido': true };
      }

      return null;
    };
  }

  get f() {
    return this.senderForm.controls;
  }

  getErrorMessage(fieldName: string): string {
    const control = this.f[fieldName];

    if (!control.errors) return '';

    const errors = control.errors;

    switch (fieldName) {
      case 'rut':
        if (errors['required']) return 'El RUT es obligatorio';
        if (errors['rutInvalido']) return 'El RUT ingresado no es válido';
        break;

      case 'nombre':
      case 'apellido':
        if (errors['required']) return `El ${fieldName} es obligatorio`;
        if (errors['minlength']) return `El ${fieldName} debe tener al menos 2 caracteres`;
        if (errors['pattern']) return `El ${fieldName} solo puede contener letras`;
        break;

      case 'email':
        if (errors['required']) return 'El email es obligatorio';
        if (errors['email'] || errors['pattern']) return 'El formato del email no es válido';
        break;

      case 'telefono':
        if (errors['required']) return 'El teléfono es obligatorio';
        if (errors['pattern']) return 'El teléfono debe tener 9 dígitos';
        break;
    }

    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.f[fieldName];
    return field.invalid && (field.dirty || field.touched || this.submitted);
  }

  continuar() {
    this.submitted = true;

    if (this.senderForm.invalid) {
      Object.keys(this.f).forEach(key => {
        const control = this.f[key];
        control.markAsTouched();
      });
      return;
    }

    this.continueClicked.emit(this.senderForm.value);
  }
}
