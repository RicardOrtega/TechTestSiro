import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {UserInputComponent} from './core/shared/components/user-input/user-input.component';
import {RemitenteComponent} from './core/shared/components/remitente/remitente.component';
import {NgIf} from '@angular/common';
import {PackageSelectionComponent} from './core/shared/components/package/package.component';
import {LocationData, MapSelectionComponent} from './core/shared/components/map-selection/map-selection.component';




@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RemitenteComponent, UserInputComponent, NgIf, PackageSelectionComponent,MapSelectionComponent],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  showSender = true;
  showPackage = false; // Add this line
  senderData: any;

  onSenderComplete(data: any) {
    this.senderData = data;
    this.showSender = false;
    this.showPackage = true; // Add this line
  }

  onLocationSelected(location: LocationData) {
    console.log('Selected location:', location);
    // Handle the selected location
  }

}
