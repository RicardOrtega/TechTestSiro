import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ShippingFormData} from '../../interface/data';

interface PackageSize {
  id: string;
  name: string;
  dimensions: string;
  maxWeight: string;
  volumeCm3: number;
}

@Component({
  selector: 'app-package',
  templateUrl: './package.component.html',
  styleUrls: ['./package.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class PackageSelectionComponent {
  @Input() shippingData: any;
  @Output() continueClicked = new EventEmitter<any>();


  packageForm: FormGroup;
  selectedPackage: PackageSize | null = null;
  calculatedValue: number = 0;
  isCustomSizeSelected: boolean = false;

  currentStep = 3;

  steps = [
    {id: 1, title: '¿Quién envía?', active: false},
    {id: 2, title: '¿A quién quieres enviar?', active: false},
    {id: 3, title: '¿Qué quieres enviar?', active: true},
    {id: 4, title: '¿Desde qué lugar envías?', active: false},
    {id: 5, title: '¿A dónde quieres enviar?', active: false},
    {id: 6, title: 'Detalles de envío', active: false}
  ];


  packageSizes: PackageSize[] = [
    {
      id: 'XXS',
      name: 'XXS',
      dimensions: '30x10x10',
      maxWeight: 'Hasta 850gr',
      volumeCm3: 3000
    },
    {
      id: 'XS',
      name: 'XS',
      dimensions: '30x20x10',
      maxWeight: 'Hasta 1,5kg',
      volumeCm3: 6000
    },
    {
      id: 'S',
      name: 'S',
      dimensions: '30x20x20',
      maxWeight: 'Hasta 3kg',
      volumeCm3: 12000
    },
    {
      id: 'M',
      name: 'M',
      dimensions: '40x30x20',
      maxWeight: 'Hasta 6kg',
      volumeCm3: 24000
    },
    {
      id: 'L',
      name: 'L',
      dimensions: '50x40x20',
      maxWeight: 'Hasta 10kg',
      volumeCm3: 40000
    },
    {
      id: 'XL',
      name: 'XL',
      dimensions: '60x40x25',
      maxWeight: 'Hasta 15kg',
      volumeCm3: 60000
    }
  ];

  constructor(private fb: FormBuilder) {
    this.packageForm = this.fb.group({
      selectedSize: [''],
      length: ['', [Validators.min(1), Validators.max(1000)]],
      width: ['', [Validators.min(1), Validators.max(1000)]],
      height: ['', [Validators.min(1), Validators.max(1000)]]
    });

    // Subscribe to form changes
    this.packageForm.valueChanges.subscribe(() => {
      if (this.isCustomSizeSelected) {
        this.onDimensionChange();
      }
    });
  }

  calculateValue(volumeCm3: number): number {
    if (volumeCm3 <= 0) return 0;
    return Math.ceil(volumeCm3 / 20) * 2000;
  }

  onPackageSelect(pkg: PackageSize) {
    this.isCustomSizeSelected = false;
    if (pkg.volumeCm3 > 200000) {
      alert('El volumen no puede superar los 2m³ (200,000 cm³), por favor solicitar asistencia de un encargado.');
      return;
    }
    this.selectedPackage = pkg;
    this.calculatedValue = this.calculateValue(pkg.volumeCm3);
    this.packageForm.patchValue({
      selectedSize: pkg.id,
      length: '',
      width: '',
      height: ''
    });
  }

  onCustomSizeSelect() {
    this.isCustomSizeSelected = true;
    this.selectedPackage = null;
    this.calculatedValue = 0;
    this.packageForm.patchValue({
      selectedSize: 'custom'
    });
  }

  onDimensionChange() {
    if (!this.isCustomSizeSelected) return;

    const length = Number(this.packageForm.get('length')?.value) || 0;
    const width = Number(this.packageForm.get('width')?.value) || 0;
    const height = Number(this.packageForm.get('height')?.value) || 0;

    const customVolume = length * width * height;

    if (customVolume > 200000) {
      alert('El volumen no puede superar los 2m³ (200,000 cm³).');
      this.calculatedValue = 0;
      return;
    }

    this.calculatedValue = this.calculateValue(customVolume);
  }

  isFormValid(): boolean {
    if (this.isCustomSizeSelected) {
      return this.packageForm.get('length')!.valid &&
        this.packageForm.get('width')!.valid &&
        this.packageForm.get('height')!.valid &&
        this.calculatedValue > 0;
    }
    return !!this.selectedPackage;
  }

  onContinue() {
    if (this.isFormValid()) {
      const packageData = {
        isCustom: this.isCustomSizeSelected,
        selectedPackage: this.selectedPackage,
        customDimensions: this.isCustomSizeSelected ? {
          length: this.packageForm.get('length')?.value,
          width: this.packageForm.get('width')?.value,
          height: this.packageForm.get('height')?.value
        } : null,
        calculatedValue: this.calculatedValue
      };

      console.log('Continuing with:', packageData);
      this.continueClicked.emit(packageData); // Emitir el evento con los datos
    }
  }
}
