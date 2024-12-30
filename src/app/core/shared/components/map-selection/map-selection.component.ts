
import { Component, OnInit, OnChanges, SimpleChanges, Output, EventEmitter, Input } from '@angular/core';
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
export class MapSelectionComponent implements OnInit, OnChanges {
  @Input() type: 'origin' | 'destination' = 'origin';
  @Output() locationSelected = new EventEmitter<LocationData>();

  private map!: Leaflet.Map;
  private marker?: Leaflet.Marker;
  selectedLocation?: LocationData;
  searchControl = new FormControl('');
  isLoading = false;

  steps = [
    { id: 1, title: '¿Quién envía?', active: false },
    { id: 2, title: '¿A quién quieres enviar?', active: false },
    { id: 3, title: '¿Qué quieres enviar?', active: false },
    { id: 4, title: '¿Desde qué lugar envías?', active: true },
    { id: 5, title: '¿A dónde quieres enviar?', active: false },
    { id: 6, title: 'Detalles de envío', active: false }
  ];


  get placeholderText(): string {
    return this.type === 'origin'
      ? 'Buscar dirección de origen...'
      : 'Buscar dirección de destino...';
  }

  // Getter para el texto del botón según el tipo
  get buttonText(): string {
    return this.type === 'origin'
      ? 'Confirmar origen'
      : 'Confirmar destino';
  }

  ngOnInit() {
    this.initializeMap();
    this.updateStep();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['type']) {
      this.updateStep();
    }
  }

  private initializeMap() {
    this.map = Leaflet.map('map', {
      center: [-33.4489, -70.6693],
      zoom: 13
    });

    Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    setTimeout(() => {
      this.map.invalidateSize();
    }, 0);

    // Agregar evento de click en el mapa
    this.map.on('click', (e: Leaflet.LeafletMouseEvent) => {
      setTimeout(() => {
        this.map.invalidateSize();
      }, 0);
      this.handleMapClick(e.latlng);
    });
  }

  private handleMapClick(latlng: Leaflet.LatLng) {
    if (this.marker) {
      this.marker.setLatLng(latlng);
    } else {
      this.marker = Leaflet.marker(latlng).addTo(this.map);
    }

    this.reverseGeocode(latlng)
      .then(result => {
        this.selectedLocation = {
          displayAddress: result.display_name,
          coordinates: {
            lat: latlng.lat,
            lng: latlng.lng
          }
        };
      })
      .catch(error => console.error('Error:', error));
  }

  private reverseGeocode(latlng: Leaflet.LatLng): Promise<any> {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latlng.lat}&lon=${latlng.lng}&format=json`;
    return fetch(url).then(response => response.json());
  }

  searchAddress() {
    const searchText = this.searchControl.value;
    if (!searchText) return;

    this.isLoading = true;

    this.forwardGeocode(searchText)
      .then(result => {
        const latlng = Leaflet.latLng(parseFloat(result.lat), parseFloat(result.lon));

        if (this.marker) {
          this.marker.setLatLng(latlng);
        } else {
          this.marker = Leaflet.marker(latlng).addTo(this.map);
        }

        this.map.setView(latlng, 16);

        this.selectedLocation = {
          displayAddress: result.display_name,
          coordinates: {
            lat: parseFloat(result.lat),
            lng: parseFloat(result.lon)
          }
        };
      })
      .catch(error => {
        console.error('Error en la búsqueda:', error);
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  private forwardGeocode(address: string): Promise<any> {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
    return fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data && data.length > 0) {
          return data[0];
        } else {
          throw new Error('No address found');
        }
      });
  }

  onConfirmLocation() {
    if (this.selectedLocation) {
      this.locationSelected.emit(this.selectedLocation);
      this.updateStep();
    }
  }

  private updateStep() {
    if (this.type === 'origin') {
      this.steps[3].active = true;
      this.steps[4].active = false;
    } else {
      this.steps[3].active = false;
      this.steps[4].active = true;
    }
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
  }
}
