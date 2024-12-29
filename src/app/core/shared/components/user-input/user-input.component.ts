import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-user-input',
  templateUrl: './user-input.component.html',
  styleUrls: ['./user-input.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class UserInputComponent {
  shippingForm: FormGroup;
  currentStep = 1;
  submitted = false;

  steps = [
    { id: 1, title: '¿A quién quieres enviar?', active: true },
    { id: 2, title: '¿Qué quieres enviar?', active: false },
    { id: 3, title: '¿Desde qué lugar envías?', active: false },
    { id: 4, title: '¿A dónde quieres enviar?', active: false },
    { id: 5, title: 'Detalles de envío', active: false }
  ];

  constructor(private fb: FormBuilder) {
    this.shippingForm = this.fb.group({
      rut: ['', [Validators.required, this.rutValidator()]],
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ ]*')]],
      apellido: ['', [Validators.required, Validators.minLength(2), Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ ]*')]],
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]]
    });
  }

  // Validador personalizado para RUT chileno
  rutValidator() {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const rut = control.value;
      if (!rut) return null;

      // Eliminar puntos y guión
      const rutLimpio = rut.replace(/\./g, '').replace(/-/g, '');

      // Validar formato
      if (!/^[0-9]{7,8}[0-9k]$/i.test(rutLimpio)) {
        return { 'rutInvalido': true };
      }

      // Validar dígito verificador
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

  // Getters para fácil acceso en el template
  get f() {
    return this.shippingForm.controls;
  }

  // Obtener mensajes de error para cada campo
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

  // Verificar si un campo tiene errores y ha sido tocado
  isFieldInvalid(fieldName: string): boolean {
    const field = this.f[fieldName];
    return field.invalid && (field.dirty || field.touched || this.submitted);
  }

  continuar() {
    this.submitted = true;

    if (this.shippingForm.invalid) {
      // Marcar todos los campos como tocados para mostrar los errores
      Object.keys(this.f).forEach(key => {
        const control = this.f[key];
        control.markAsTouched();
      });
      return;
    }

    if (this.currentStep < this.steps.length) {
      this.steps[this.currentStep - 1].active = false;
      this.currentStep++;
      this.steps[this.currentStep - 1].active = true;
      this.submitted = false;
    }
  }
}
