import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RemitenteComponent} from './core/shared/components/remitente/remitente.component';
import {UserInputComponent} from './core/shared/components/user-input/user-input.component';
import {MapSelectionComponent} from './core/shared/components/map-selection/map-selection.component';
import {PackageSelectionComponent} from './core/shared/components/package/package.component';
import {LocationData, ShippingFormData} from './core/shared/interface/data';
import { ShippingDetailsComponent } from './core/shared/components/shipping-details/shipping-details.component';
import {AlertModalComponent} from './core/shared/components/alert-modal/alert-modal.component';

export enum ShippingStep {
  Sender,
  UserInput,
  OriginMap,
  DestinationMap,
  Package,
  Details
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',

  standalone: true,
  imports: [
    CommonModule,
    RemitenteComponent,
    UserInputComponent,
    MapSelectionComponent,
    PackageSelectionComponent,
    ShippingDetailsComponent,
    AlertModalComponent,

  ], styleUrls: ['./app.component.css'],
})
export class AppComponent {
  readonly ShippingStep = ShippingStep;

  currentStep = ShippingStep.Sender;
  senderData: any;
  originLocation?: LocationData;
  destinationLocation?: LocationData;
  shippingData?: ShippingFormData;
  showAlertModal = false;
  alertMessage = '';

  onSenderComplete(data: any) {


    if (!this.shippingData) {
      this.shippingData = {
        sender: data,
        recipient: {
          rut: '',
          nombre: '',
          apellido: '',
          email: '',
          telefono: ''
        },
        origin: {
          displayAddress: '',
          coordinates: { lat: 0, lng: 0 }
        },
        destination: {
          displayAddress: '',
          coordinates: { lat: 0, lng: 0 }
        },
        package: {
          isCustom: false,
          selectedPackage: null,
          calculatedValue: 0
        },
        status: 'draft'
      };
    } else {
      this.shippingData.sender = data;
    }
    this.currentStep = ShippingStep.UserInput;
  }

  showAlert(message: string) {
    this.alertMessage = message;
    this.showAlertModal = true;
  }

  closeAlert() {
    this.showAlertModal = false;
  }

  onUserInputComplete(data: any) {
    console.log('User recipient data:', data);
    if (this.shippingData) {
      this.shippingData.recipient = data;
    }
    this.currentStep = ShippingStep.Package;
  }

  onPackageComplete(packageData: any) {
    console.log('Package data received:', packageData);
    if (this.shippingData) {
      this.shippingData.package = packageData;
    }
    this.currentStep = ShippingStep.OriginMap;
  }

  onOriginSelected(location: LocationData) {
    if (this.shippingData) {
      this.shippingData.origin = location;
    }
    this.originLocation = location;
    this.currentStep = ShippingStep.DestinationMap;
  }

  onDestinationSelected(location: LocationData) {
    if (this.shippingData) {
      this.shippingData.destination = location;

      this.shippingData = {
        ...this.shippingData,
        origin: this.originLocation || this.shippingData.origin,
        status: 'draft'
      };
    }
    this.currentStep = ShippingStep.Details;
  }

  onOrderConfirmed() {
    if (this.shippingData) {
      this.shippingData.status = 'completed';
      console.log('Orden confirmada:', this.shippingData);
    }
    alert('Orden confirmada');
    this.resetData();
    this.currentStep = ShippingStep.Sender;
  }

  private resetData() {
    this.shippingData = undefined;
    this.senderData = undefined;
    this.originLocation = undefined;
    this.destinationLocation = undefined;
  }


}
