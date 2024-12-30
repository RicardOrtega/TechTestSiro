import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

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
  packageForm: FormGroup;
  selectedPackage: PackageSize | null = null;
  calculatedValue: number = 0;
  isCustomSizeSelected: boolean = false;

  packageSizes: PackageSize[] = [
    /* Your existing package sizes */
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
      alert('El volumen no puede superar los 2m³ (200,000 cm³).');
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
      console.log('Continuing with:', {
        isCustom: this.isCustomSizeSelected,
        selectedPackage: this.selectedPackage,
        customDimensions: this.isCustomSizeSelected ? {
          length: this.packageForm.get('length')?.value,
          width: this.packageForm.get('width')?.value,
          height: this.packageForm.get('height')?.value
        } : null,
        calculatedValue: this.calculatedValue
      });
    }
  }

}
