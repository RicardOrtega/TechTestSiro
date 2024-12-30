import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RemitenteComponent} from './core/shared/components/remitente/remitente.component';
import {UserInputComponent} from './core/shared/components/user-input/user-input.component';
import {MapSelectionComponent} from './core/shared/components/map-selection/map-selection.component';
import {PackageSelectionComponent} from './core/shared/components/package/package.component';
import {LocationData, ShippingFormData} from './core/shared/interface/data';
import {ShippingDetailsComponent} from './core/shared/components/shiping-details/shiping-details.component';

export enum ShippingStep {
  Sender,
  UserInput,    // Movido antes de OriginMap
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

  ], styleUrls: ['./app.component.css'],
})
export class AppComponent {
  readonly ShippingStep = ShippingStep;

  currentStep = ShippingStep.Sender;
  senderData: any;
  originLocation?: LocationData;
  destinationLocation?: LocationData;
  shippingData?: ShippingFormData;

  onSenderComplete(data: any) {
    console.log('User recepetor :', data);
    this.senderData = data;
    this.currentStep = ShippingStep.UserInput;
  }

  onUserInputComplete(data: any) {
    console.log('User input data received:', data);

    this.senderData = { ...this.senderData, ...data };
    this.currentStep = ShippingStep.Package;
  }

  onOriginSelected(location: LocationData) {
    this.originLocation = location;
    this.currentStep = ShippingStep.DestinationMap;
  }

  onPackageComplete(packageData: any) {
    console.log('Package data received:', packageData);
    this.shippingData = {
      ...this.shippingData,
      package: packageData,
      sender: this.senderData, // Asegurarse de que senderData esté completo
      status: 'draft'
    } as ShippingFormData;

    this.currentStep = ShippingStep.OriginMap;
  }

  onDestinationSelected(location: LocationData) {
    this.destinationLocation = location;
    this.shippingData = {
      sender: this.senderData,
      origin: this.originLocation!,
      destination: location,
    } as unknown as ShippingFormData;
    this.currentStep = ShippingStep.Package;
  }

  onOrderConfirmed() {
    alert('Orden confirmada');
    this.currentStep = ShippingStep.Sender;
  }


}
