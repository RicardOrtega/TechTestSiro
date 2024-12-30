import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import * as Leaflet from 'leaflet';

interface LocationCoordinates {
  lat: number;
  lng: number;
}

export interface LocationData {
  displayAddress: string;
  coordinates: LocationCoordinates;
}

@Component({
  selector: 'app-map-selection',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './map-selection.component.html',
  styleUrls: ['./map-selection.component.css']
})
export class MapSelectionComponent implements OnInit {
  @Output() locationSelected = new EventEmitter<LocationData>();

  private map!: Leaflet.Map;
  private marker?: Leaflet.Marker;
  selectedLocation?: LocationData;
  searchControl = new FormControl('');
  isLoading = false;

  ngOnInit() {
    this.initializeMap();
  }

  private initializeMap() {
    this.map = Leaflet.map('map', {
      center: [-33.4489, -70.6693], // Santiago, Chile
      zoom: 13
    });

    Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
  }

  private forwardGeocode(address: string): Promise<any> {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;

    return fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data && data.length > 0) {
          return data[0]; // Retorna el primer resultado
        } else {
          throw new Error('No address found');
        }
      });
  }

  searchAddress() {
    const searchText = this.searchControl.value;
    if (!searchText) {
      return;
    }

    this.isLoading = true;

    this.forwardGeocode(searchText)
      .then(result => {
        // Crear el LatLng para el marcador
        const latlng = Leaflet.latLng(parseFloat(result.lat), parseFloat(result.lon));

        // Actualizar o crear el marcador
        if (this.marker) {
          this.marker.setLatLng(latlng);
        } else {
          this.marker = Leaflet.marker(latlng).addTo(this.map);
        }

        // Centrar el mapa en la ubicación
        this.map.setView(latlng, 16);

        // Actualizar la ubicación seleccionada
        this.selectedLocation = {
          displayAddress: result.display_name,
          coordinates: {
            lat: parseFloat(result.lat),
            lng: parseFloat(result.lon)
          }
        };

        // Emitir la ubicación seleccionada
        this.locationSelected.emit(this.selectedLocation);
      })
      .catch(error => {
        console.error('Error en la búsqueda:', error);
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  onConfirmLocation() {
    if (this.selectedLocation) {
      this.locationSelected.emit(this.selectedLocation);
    }
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
  }
}
